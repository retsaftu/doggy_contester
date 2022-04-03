import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../../config/jwt.config';

import { PassportModule } from '@nestjs/passport';
import { JwtStratagy } from './strategies/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    }),
    PassportModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStratagy]
})
export class AuthModule { }
