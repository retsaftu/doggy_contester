import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContestModule } from './contest/contest.module';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [DatabaseModule, AuthModule, ContestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
