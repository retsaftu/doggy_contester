import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }


  @Get()
  findAll(@Query('contestId') contestId: string) {
    return this.leaderboardService.findAll(contestId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardService.findOne(+id);
  }


}
