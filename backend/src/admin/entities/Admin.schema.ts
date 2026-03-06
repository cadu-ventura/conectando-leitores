import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose"
import { Role } from "../../util/Role";
import { Book } from "src/books/entities/book.schema";

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Book' }], default: [] })
  favorites: Book[];

  @Prop({ required: true, unique: true })
  mail: string;

  @Prop({ required: true })
  password: string;
  
  @Prop({ type: Date, required: true })
  birthDate: Date;

  @Prop({ type: String, enum: Role, default: Role.SYSADMIN })
  roles: Role;

  @Prop({ type: Date, require: true, default: Date.now })
    createdAt: Date;

  @Prop({ type: Date, require: true, default: Date.now })
    updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);