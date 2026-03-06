/**
   * Converte uma string de data no formato dd/MM/yyyy para Date
   * @param dataString - Data no formato dd/MM/yyyy
   * @returns Objeto Date
   */
export default function converterDataString(dataString: string): Date {
    const [dia, mes, ano] = dataString.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
}
