import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadBookController } from './controller/uploadBook.controller';
import { FavoriteBookController } from './controller/favoriteBook.controller';
import { UploadBookService } from './service/uploadBook.service';
import { FavoriteBookService } from './service/favoriteBook.service';
import { ListFavoriteBookService } from './service/listFavoriteBook.service';
import { Book, BookSchema } from './entities/book.schema';
import { User, UserSchema } from '../user/entities/User.schema';
import { Admin, AdminSchema } from '../admin/entities/Admin.schema';
import { AuthModule } from '../auth/auth.module';
import { ContactModule } from '../contact/contact.module';
import { ListFavoriteBookController } from './controller/listFavoriteBook.controller';
import { GetMostFavoriteBookController } from './controller/getMostFavoriteBook.controller';
import { GetMostFavoriteBookService } from './service/getMostFavoriteBook.service';
import { DeleteFavoriteBookController } from './controller/deleteFavoriteBook.controller';
import { BookStatusController } from './controller/bookStatus.controller';
import { DeleteFavoriteBookService } from './service/deleteFavoriteBook.service';
import { GetBookController } from './controller/getBook.controller';
import { GetBookService } from './service/getBook.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { DeleteBookController } from './controller/DeleteBook.controller';
import { DeleteBookService } from './service/DeleteBook.service';
import { BookDeleteRepository } from './repository/book-delete.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: User.name, schema: UserSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
    AuthModule,
    ContactModule,
    FirebaseModule,
  ],
  controllers: [
    UploadBookController, 
    FavoriteBookController, 
    ListFavoriteBookController, 
    GetMostFavoriteBookController,
    DeleteFavoriteBookController,
    BookStatusController,
    GetBookController,
    DeleteBookController
  ],
  providers: [
    UploadBookService, 
    FavoriteBookService, 
    ListFavoriteBookService, 
    GetMostFavoriteBookService,
    DeleteFavoriteBookService,
    GetBookService,
    DeleteBookService,
    BookDeleteRepository
  ],
  exports: [
    UploadBookService, 
    FavoriteBookService, 
    ListFavoriteBookService, 
    GetMostFavoriteBookService,
    DeleteFavoriteBookService,
    GetBookService,
    DeleteBookService,
    BookDeleteRepository
  ],
})
export class BookModule {}