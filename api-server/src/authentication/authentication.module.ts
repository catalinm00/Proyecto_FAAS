import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { ApisixService } from "./apisix.service";

@Module({
    imports: [JwtModule.register({})],
    providers: [AuthService,ApisixService],
    exports: [AuthService],
})
export class AuthModule{}