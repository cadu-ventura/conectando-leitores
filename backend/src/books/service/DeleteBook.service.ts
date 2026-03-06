import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { BookDeleteRepository } from '../repository/book-delete.repository';

@Injectable()
export class DeleteBookService {
  constructor(
    private readonly bookDeleteRepository: BookDeleteRepository,
  ) {}

  async deleteBook(bookId: string) {
    // Validar se o ID é um ObjectId válido
    if (!isValidObjectId(bookId)) {
      throw new BadRequestException('ID de livro inválido');
    }

    // Buscar o livro
    const book = await this.bookDeleteRepository.findById(bookId);
    
    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }
    
    // Deletar permanentemente
    await this.bookDeleteRepository.deleteById(bookId);
    
    return {
      message: 'Obra excluída com sucesso!',
      deletedBook: book,
    };
  }
}
