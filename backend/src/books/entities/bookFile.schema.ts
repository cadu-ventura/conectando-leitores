import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Cover, CoverSchema } from './cover.schema';

/**
 * Schema para informações do arquivo do livro
 */
@Schema({ _id: false })
export class BookFile {
  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  storagePath: string;

  @Prop({ required: true })
  storageFileName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  checksum: string;

  @Prop({ required: true })
  uploadAt: Date;

  @Prop({ type: CoverSchema, required: true })
  cover: Cover;
}

export const BookFileSchema = SchemaFactory.createForClass(BookFile);

