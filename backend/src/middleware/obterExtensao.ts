/**
   * Obtém a extensão do arquivo
   * @param nomeArquivo - Nome do arquivo
   * @returns Extensão do arquivo com ponto (ex: .pdf)
   */
export default function obterExtensao(nomeArquivo: string): string {
    const partes = nomeArquivo.split('.');
    return partes.length > 1 ? `.${partes[partes.length - 1]}` : '';
}
