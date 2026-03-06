/**
   * Sanitiza o nome do arquivo removendo caracteres especiais
   * @param nome - Nome a ser sanitizado
   * @returns Nome sanitizado
   */
export default function sanitizarNomeArquivo(nome: string): string {
    if (!nome) {
        throw new Error('O título do livro não pode ser vazio ou indefinido');
    }
    return nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Substitui caracteres especiais por underscore
        .replace(/_{2,}/g, '_') // Remove underscores duplicados
        .toLowerCase();
}
