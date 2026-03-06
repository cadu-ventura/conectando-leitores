import { Injectable } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactMessage } from '../entities/contact-message.entity';
import { CreateContactMessageDto } from '../dtos/create-contact-message.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name) private readonly contactModel: Model<ContactMessage>,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createContactMessageDto: CreateContactMessageDto, createdBy: string): Promise<ContactMessage> {
    const contactMessage = new this.contactModel({
      ...createContactMessageDto,
      createdAt: new Date(),
      createdBy,
    });
    const savedMessage = await contactMessage.save();
    // Cria notificação para o admin
    await this.notificationService.create({
      type: 'contact',
      message: `Nova mensagem de contato de ${createdBy}: ${createContactMessageDto.title}`,
      user: createdBy,
    });
    return savedMessage;
  }

  async findAll(): Promise<ContactMessage[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }
}
