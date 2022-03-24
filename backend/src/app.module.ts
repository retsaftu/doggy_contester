import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContestModule } from './contest/contest.module';

@Module({
  imports: [AuthModule, ContestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
