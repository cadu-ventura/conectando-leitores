import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "./entities/Admin.schema";
import { CreateAdminService } from "./service/CreateAdmin.service";
import { CreateAdminController } from "./controller/CreateAdmin.controller";
import { AdminAccountRepository } from "./repository/admin-login-register.repository";
import { AdminQueryRepository } from "./repository/admin-read.repository";
import { AuthModule } from '../auth/auth.module'

@Module({
    imports: [
        MongooseModule.forFeature([{name: Admin.name, schema: AdminSchema}]),
        forwardRef(() => AuthModule),
    ],
    providers: [
        CreateAdminService,
        AdminAccountRepository,
        AdminQueryRepository,
    ],
    controllers: [
        CreateAdminController,
    ],
    exports: [
        AdminAccountRepository,
        AdminQueryRepository
    ]
})
export class AdminModule {}