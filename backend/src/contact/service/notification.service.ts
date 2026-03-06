import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from '../dtos/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
  ) {}

  async findByUser(userIdOrEmail: string): Promise<Notification[]> {
    const all = await this.notificationModel.find({ user: userIdOrEmail }).sort({ createdAt: -1 }).exec();
    const unique = Object.values(
      all.reduce((acc: Record<string, Notification>, curr: Notification) => {
        acc[curr._id.toString()] = curr;
        return acc;
      }, {})
    );
    return unique;
  }

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(): Promise<Notification[]> {
    const all = await this.notificationModel.find().sort({ createdAt: -1 }).exec();
    const unique = Object.values(
      all.reduce((acc: Record<string, Notification>, curr: Notification) => {
        acc[curr._id.toString()] = curr;
        return acc;
      }, {})
    );
    return unique;
  }

  async markAsRead(notificationId: string, userIdentifier: string): Promise<Notification> {
    
    const notification = await this.notificationModel.findById(notificationId).exec();

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    
    if (notification.user !== userIdentifier) {
      throw new ForbiddenException('Você não tem permissão para modificar esta notificação.');
    }

    
    notification.read = true;
    return notification.save();
  }
}
