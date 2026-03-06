import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoriaLivro, StatusLivro } from '../enums/book.enums';
import { BookFile, BookFileSchema } from './bookFile.schema';

/**
 * Schema principal do livro
 */
@Schema({ timestamps: true })
export class Book extends Document {
  @Prop({ 
    required: [true, 'O campo Título é obrigatório'], 
    maxlength: [50, 'O título deve ter no máximo 50 caracteres'], 
    trim: true 
  })
  title: string;

  @Prop({ 
    required: [true, 'O campo Autor é obrigatório'], 
    maxlength: [50, 'O autor deve ter no máximo 50 caracteres'], 
    trim: true 
  })
  author: string;

  @Prop({ 
    required: [true, 'O campo Categoria é obrigatório'], 
    enum: {
      values: Object.values(CategoriaLivro),
      message: 'Categoria inválida'
    }
  })
  category: CategoriaLivro;

  @Prop({ 
    required: [true, 'O campo Descrição é obrigatório'], 
    maxlength: [800, 'A descrição deve ter no máximo 800 caracteres'], 
    trim: true 
  })
  description: string;

  @Prop({ required: [true, 'O campo Data de lançamento é obrigatório'] })
  releaseDate: Date;

  @Prop({ 
    required: [true, 'O campo Responsável pelo upload é obrigatório'], 
    type: Types.ObjectId, 
    ref: 'User' 
  })
  uploadedBy: Types.ObjectId;

  @Prop({ 
    type: BookFileSchema, 
    required: [true, 'O arquivo do livro é obrigatório'] 
  })
  book: BookFile;

  @Prop({
    required: [true, 'O campo Status é obrigatório'],
    enum: {
      values: Object.values(StatusLivro),
      message: 'Status inválido'
    },
    default: StatusLivro.PENDENTE,
  })
  status: StatusLivro;
}

export const BookSchema = SchemaFactory.createForClass(Book);