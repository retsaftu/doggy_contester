import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContestModule } from './contest/contest.module';
import { DatabaseModule } from './database/database.module';
import { SubmissionModule } from './submission/submission.module';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';


@Module({
  imports: [DatabaseModule, AuthModule, ContestModule, SubmissionModule, UserModule, FileModule, LeaderboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
