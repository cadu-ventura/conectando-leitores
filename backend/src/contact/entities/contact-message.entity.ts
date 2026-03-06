import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ContactMessage extends Document {
  @Prop({ 
    required: [true, 'O campo Título da mensagem é obrigatório'], 
    maxlength: [50, 'O campo Título da mensagem deve conter no máximo 50 caracteres.'] 
  })
  title: string;

  @Prop({ 
    required: [true, 'O campo Mensagem é obrigatório'], 
    maxlength: [700, 'O campo Mensagem deve conter no máximo 700 caracteres.'] 
  })
  summary: string;

  @Prop({ required: [true, 'A data de criação é obrigatória'] })
  createdAt: Date;

  @Prop({ required: [true, 'O criador da mensagem é obrigatório'] })
  createdBy: string; // email ou id do usuário
}

export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);
