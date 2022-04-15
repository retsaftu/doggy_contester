import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { DatabaseModule } from 'src/database/database.module';

import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJWTConfig } from '../../config/jwt.config';

@Module({
  imports:[
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig
    })
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService]
})
export class LeaderboardModule {}
