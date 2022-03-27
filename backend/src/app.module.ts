import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContestModule } from './contest/contest.module';
import { DatabaseModule } from './database/database.module';
import { SubmissionModule } from './submission/submission.module';


@Module({
  imports: [DatabaseModule, AuthModule, ContestModule, SubmissionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
