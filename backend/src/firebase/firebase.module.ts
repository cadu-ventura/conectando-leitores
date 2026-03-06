import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FirebaseService } from "./firebase.service";

@Global()
@Module({
    imports: [ConfigModule.forRoot()],
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule {}