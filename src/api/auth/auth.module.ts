import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CustomStrategy } from './custom.strategy';
@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, CustomStrategy],
})
export class AuthModule {}
