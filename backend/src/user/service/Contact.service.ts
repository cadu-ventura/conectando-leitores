import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage } from '../entities/contact-message.entity';
import { UserCreateContactDto } from '../dtos/user-create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name) private readonly contactModel: Model<ContactMessage>,
  ) {}


  async create(dto: UserCreateContactDto, createdBy: string): Promise<ContactMessage> {
    try {
      // Sanitização dos campos (trim)
      const message = new this.contactModel({
        title: dto.title?.trim(),
        summary: dto.summary?.trim(),
        createdAt: new Date(),
        createdBy,
      });
      const saved = await message.save();
      return saved;
    } catch (error) {
      throw new Error('Erro ao salvar mensagem de contato. Tente novamente mais tarde.');
    }
  }

  async findAll(): Promise<ContactMessage[]> {
    try {
      return await this.contactModel.find().sort({ createdAt: -1 }).exec();
    } catch (error) {
      throw new Error('Erro ao buscar mensagens de contato.');
    }
  }
}
