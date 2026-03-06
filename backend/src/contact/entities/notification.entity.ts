import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  user: string; 

  @Prop({ required: false })
  userName?: string; 

  @Prop({ default: false })
  read: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
