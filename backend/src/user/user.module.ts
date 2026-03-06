import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./entities/User.schema";
import { ContactMessage, ContactMessageSchema } from './entities/contact-message.entity';
import { ContactModule } from '../contact/contact.module';
import { ContactController } from './controller/Contact.controller';
import { CreateUserService } from "./service/CreateUser.service";
import { CreateUserController } from "./controller/CreateUser.controller";
import { UserAccountRepository } from "./repository/user-login-register.repository";
import { UserQueryRepository } from "./repository/user-read.repository";
import { AuthModule } from '../auth/auth.module'
import { LoginController } from '../auth/controller/Login.controller';
import { ListAllUsersController } from "./controller/ListAllUsers.controller";
import { ListAllUsersService } from "./service/ListAllUser.service";
import { UserMetricsRepository } from "./repository/user-count.repository";
import { UserDeleteRepository } from "./repository/user-delete.repository";
import { DeleteUserService } from "./service/DeleteUser.service";
import { DeleteUserController } from "./controller/DeleteUser.controller";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: ContactMessage.name, schema: ContactMessageSchema}
        ]),
        forwardRef(() => AuthModule),
        ContactModule,
    ],
    providers: [
        CreateUserService,
        DeleteUserService,
        UserAccountRepository,
        UserQueryRepository,
        UserMetricsRepository,
        UserDeleteRepository,
        ListAllUsersService,
    ],
    controllers: [
        CreateUserController,
        DeleteUserController,
        LoginController,
        ListAllUsersController,
    ContactController
    ],
    exports: [
        UserAccountRepository,
        UserQueryRepository,
        UserMetricsRepository,
        UserDeleteRepository
    ]
})
export class UserModule {}