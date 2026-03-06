import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContactMessage extends Document {
  @Prop({ required: true, maxlength: 50 })
  title!: string;

  @Prop({ required: true, maxlength: 700 })
  summary!: string;

  @Prop({ required: true })
  createdAt!: Date;

  @Prop({ required: true })
  createdBy!: string; // email ou id do usuário
}

export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
