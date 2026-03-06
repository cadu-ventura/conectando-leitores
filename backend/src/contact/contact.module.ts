import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactService } from './service/contact.service';
import { NotificationService } from './service/notification.service';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { NotificationController } from './controller/notification.controller';
import { ContactMessage, ContactMessageSchema } from './entities/contact-message.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [ContactService, NotificationService],
  exports: [ContactService, NotificationService],
})
export class ContactModule {}
