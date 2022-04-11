import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../../config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStratagy } from 'src/auth/strategies/jwt.strategy';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    }),
    PassportModule,
  ],
  controllers: [UserController],
  providers: [UserService, JwtStratagy,]
})
export class UserModule {}
