import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import Epub from 'epub-gen';

(async () => {
  try {
    const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'epub-'));
    const outPath = path.join(tempDir, `${uuidv4()}.epub`);

    console.log('Temp dir:', tempDir);
    console.log('Output path:', outPath);

    const options = {
      title: 'Teste EPUB',
      author: 'Tester',
      content: [
        { title: 'Cap 1', data: '<p>Olá mundo</p>' },
        { title: 'Cap 2', data: '<p>Segunda página</p>' },
      ],
      verbose: true,
    };

    const epubPromise = new Epub(options, outPath).promise;
    const timeoutMs = 60_000;

    await Promise.race([
      epubPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout gerando EPUB')), timeoutMs)),
    ]);

    console.log('EPUB gerado com sucesso em:', outPath);

    const buf = fs.readFileSync(outPath);
    console.log('Tamanho do EPUB (bytes):', buf.length);

    // Ler o diretório temporário para ver arquivos gerados
    const files = await fs.promises.readdir(tempDir);
    console.log('Arquivos em tempDir:', files);

  // Copia o EPUB gerado para a raiz do projeto para inspeção e mantém o temp dir
  const dest = path.join(process.cwd(), `converted-${path.basename(outPath)}`);
  await fs.promises.copyFile(outPath, dest);
  console.log('Cópia do EPUB para inspeção em:', dest);
  console.log('Diretório temporário mantido em:', tempDir);
  } catch (err) {
    console.error('Erro no teste EPUB:', err);
  }
})();
