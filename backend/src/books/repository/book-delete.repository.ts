import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from '../entities/book.schema';

@Injectable()
export class BookDeleteRepository {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<Book>,
  ) {}

  async findById(bookId: string): Promise<Book | null> {
    return this.bookModel.findById(bookId);
  }

  async deleteById(bookId: string): Promise<void> {
    await this.bookModel.findByIdAndDelete(bookId);
  }
}
