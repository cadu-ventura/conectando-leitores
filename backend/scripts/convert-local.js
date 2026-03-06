const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');
const pdfParse = require('pdf-parse');
const Epub = require('epub-gen');

function sanitizarNome(nome) {
  if (!nome) return 'sem-titulo';
  return nome
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}

async function converter(pdfPath, coverPath, titulo = 'Livro sem titulo', autor = 'Autor desconhecido') {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  const textoCompleto = pdfData.text || '';

  // divide por form feed
  let paginas = textoCompleto.split('\f').filter(p => p && p.trim().length > 0);

  if (paginas.length <= 1) {
    const paragrafos = textoCompleto.split(/\n\n+/).filter(p => p && p.trim().length > 0);
    const tamanhoCapitulo = Math.max(1, Math.ceil(paragrafos.length / 10));
    const capitulos = [];
    for (let i = 0; i < paragrafos.length; i += tamanhoCapitulo) {
      const secao = paragrafos.slice(i, i + tamanhoCapitulo).join('\n\n');
      if (secao.trim().length > 0) {
        capitulos.push({ title: `Capítulo ${Math.floor(i / tamanhoCapitulo) + 1}`, data: `<p>${secao.replace(/\n/g, '</p><p>')}</p>` });
      }
    }
    if (capitulos.length > 0) paginas = capitulos.map(c => ({ raw: true, title: c.title, data: c.data }));
  }

  // monta content para epub-gen
  let content = [];
  if (Array.isArray(paginas) && paginas.length > 0 && typeof paginas[0] === 'string') {
    content = paginas.map((p, i) => ({ title: `Capítulo ${i + 1}`, data: `<p>${p.replace(/\n/g, '</p><p>')}</p>` }));
  } else if (Array.isArray(paginas) && paginas.length > 0 && paginas[0].raw) {
    content = paginas;
  } else {
    content = [{ title: 'Conteúdo', data: '<p>Sem conteúdo extraído</p>' }];
  }

  const opcoes = {
    title: titulo,
    author: autor,
    content,
    lang: 'pt-BR',
    verbose: false,
  };

  const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'epub-'));
  const outPath = path.join(tempDir, `${uuidv4()}.epub`);

  console.log('Gerando EPUB em:', outPath);
  await (new Epub(opcoes, outPath)).promise;

  // prepara destino local-storage
  const tituloSanitizado = sanitizarNome(titulo);
  const storageRoot = path.join(process.cwd(), 'local-storage');
  const destDir = path.join(storageRoot, 'oraculo', 'livros', tituloSanitizado);
  await fs.promises.mkdir(destDir, { recursive: true });

  const destEpub = path.join(destDir, `${uuidv4()}.epub`);
  await fs.promises.copyFile(outPath, destEpub);

  let destCover = null;
  if (coverPath && fs.existsSync(coverPath)) {
    const ext = path.extname(coverPath) || '.jpg';
    destCover = path.join(destDir, `capa-${uuidv4()}${ext}`);
    await fs.promises.copyFile(coverPath, destCover);
  }

  console.log('EPUB salvo em:', destEpub);
  if (destCover) console.log('Capa copiada para:', destCover);
  console.log('Temp dir mantido em:', tempDir);
  console.log('file url epub:', `file://${destEpub}`);
  if (destCover) console.log('file url cover:', `file://${destCover}`);
  return { epub: destEpub, cover: destCover, tempDir };
}

// CLI
(async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Uso: node scripts/convert-local.js <pdfPath> [coverPath] [titulo] [autor]');
    process.exit(1);
  }
  const [pdfPath, coverPath, titulo, autor] = args;
  try {
    await converter(pdfPath, coverPath, titulo, autor);
  } catch (err) {
    console.error('Erro na conversão:', err);
    process.exit(1);
  }
})();
