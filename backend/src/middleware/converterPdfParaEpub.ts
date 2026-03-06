const pdfParse = require('pdf-parse');
import Epub from 'epub-gen';
import * as os from 'os';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Converte um arquivo PDF para EPUB com otimizações de memória
 * @param pdfBuffer - Buffer do arquivo PDF
 * @param titulo - Título do livro
 * @param autor - Autor do livro
 * @returns Buffer do arquivo EPUB gerado
 */
export async function converterPdfParaEpub(
  pdfBuffer: Buffer,
  titulo: string,
  autor: string,
): Promise<Buffer> {
  let tempDir: string | null = null;
  let nomeArquivoTemp: string | null = null;

  try {

    // LIMITE DE TAMANHO: Previne crash por memória
    const MAX_PDF_SIZE_MB = 50;
    const sizeInMB = pdfBuffer.length / 1024 / 1024;
    
    if (sizeInMB > MAX_PDF_SIZE_MB) {
      throw new BadRequestException(
        `PDF muito grande para conversão (${sizeInMB.toFixed(1)}MB). Máximo: ${MAX_PDF_SIZE_MB}MB`
      );
    }

    // Extrai o texto do PDF com timeout e tratamento de erro
    let textoCompleto: string;
    
    try {
      const parsePromise = pdfParse(pdfBuffer, {
        max: 0,
        version: 'v1.10.100'
      });

      // Timeout de 30 segundos para extração
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na extração do PDF')), 30000)
      );

      const pdfData = await Promise.race([parsePromise, timeoutPromise]);
      textoCompleto = (pdfData as any).text;


    } catch (parseError) {
      console.error('Erro no pdf-parse:', parseError);
      throw new BadRequestException(
        'Não foi possível extrair o texto do PDF. O arquivo pode estar corrompido ou protegido.'
      );
    }

    // Validação do texto extraído
    if (!textoCompleto || textoCompleto.trim().length < 50) {
      throw new BadRequestException(
        'O PDF não contém texto suficiente para conversão. Pode ser um PDF de imagens (escaneado).'
      );
    }

    // Libera o buffer original da memória (se possível)
    pdfBuffer = null as any;
    if (global.gc) {
      global.gc();
      console.log('Garbage collection executado');
    }

    // Divide o texto em capítulos de forma mais eficiente
    const conteudoCapitulos = gerarCapitulos(textoCompleto, titulo);
    
    // Libera o texto completo da memória
    textoCompleto = null as any;

    // Configuração do EPUB
    const opcoes = {
      title: titulo,
      author: autor,
      content: conteudoCapitulos,
      lang: 'pt-BR',
      verbose: false,
    };

    // Cria diretório temporário com tratamento robusto
    const baseTempDir = os.tmpdir();
    tempDir = await fs.promises.mkdtemp(path.join(baseTempDir, 'epub-'));
    nomeArquivoTemp = path.join(tempDir, `${uuidv4()}.epub`);

    // Define permissões no Linux
    if (process.platform !== 'win32') {
      await fs.promises.chmod(tempDir, 0o755).catch(() => {});
    }

    // Gera o EPUB com timeout de 45 segundos
    const epubPromise: Promise<void> = (new Epub(opcoes, nomeArquivoTemp) as any).promise;
    const timeoutMs = 45_000;

    await Promise.race([
      epubPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout ao gerar EPUB (45s)')), timeoutMs)
      ),
    ]);

    // Verifica se o arquivo foi criado
    if (!fs.existsSync(nomeArquivoTemp)) {
      throw new Error('Arquivo EPUB não foi criado pelo epub-gen');
    }

    // Lê o arquivo EPUB com verificação de tamanho
    const stats = await fs.promises.stat(nomeArquivoTemp);

    if (stats.size > 30 * 1024 * 1024) { // Máximo 30MB para o EPUB final
      throw new Error('EPUB gerado muito grande (>30MB)');
    }

    const epubBuffer = await fs.promises.readFile(nomeArquivoTemp);

    return epubBuffer;

  } catch (erro) {
    console.error('=== ERRO NA CONVERSÃO PDF->EPUB ===');
    console.error('Erro:', erro);
    console.error(`Memory usage no erro: ${JSON.stringify(process.memoryUsage())}`);

    if (erro instanceof BadRequestException) {
      throw erro;
    }

    throw new InternalServerErrorException(
      `Erro ao converter PDF para EPUB: ${erro.message || 'Erro desconhecido'}`
    );

  } finally {
    // Cleanup SEMPRE executado (mesmo em crash)
    if (tempDir) {
      try {
        await fs.promises.rm(tempDir, { recursive: true, force: true });
        console.log(`Diretório temporário removido: ${tempDir}`);
      } catch (cleanupError) {
        console.warn('Aviso: falha ao remover temp dir:', cleanupError);
      }
    }
  }
}

/**
 * Gera capítulos a partir do texto extraído
 */
function gerarCapitulos(texto: string, titulo: string): Array<{ title: string; data: string }> {
  // Divide por quebras de página primeiro
  let paginas = texto.split('\f').filter(p => p.trim().length > 0);

  // Se não houver quebras de página, divide por parágrafos grandes
  if (paginas.length <= 1) {
    const paragrafos = texto.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    // Agrupa parágrafos em capítulos de tamanho razoável
    const PARAGRAFOS_POR_CAPITULO = Math.max(5, Math.ceil(paragrafos.length / 15));
    paginas = [];
    
    for (let i = 0; i < paragrafos.length; i += PARAGRAFOS_POR_CAPITULO) {
      const secao = paragrafos.slice(i, i + PARAGRAFOS_POR_CAPITULO).join('\n\n');
      paginas.push(secao);
    }
  }

  // Gera os capítulos com HTML simples
  return paginas.map((pagina, index) => ({
    title: `Capítulo ${index + 1}`,
    data: `<div>${escapeHtml(pagina).replace(/\n/g, '<br/>')}</div>`,
  }));
}

/**
 * Escapa caracteres HTML para prevenir problemas de formatação
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}