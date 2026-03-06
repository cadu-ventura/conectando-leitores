import * as crypto from 'crypto';

/**
   * Calcula o checksum SHA256 de um buffer
   * @param buffer - Buffer do arquivo
   * @returns Hash SHA256 em formato hexadecimal
   */
export default function calcularChecksum(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}
