import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

/**
 * Schema para informações da capa do livro
 */
@Schema({ _id: false })
export class Cover {
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
  uploadAt: Date;

  @Prop({ required: false })
  url?: string;
}

export const CoverSchema = SchemaFactory.createForClass(Cover);
