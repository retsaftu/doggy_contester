import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }


  @UseGuards(JwtAuthGuard)
  @Get()
  findSubmissionByContestIdAndUserId(
    @Query('contestId') contestId: string,
    @Req() req: any,

    ) {
    const userId = req.user._id
    console.log(`id`, userId);
    return this.leaderboardService.findSubmissionByContestIdAndUserId(contestId, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaderboardService.findOne(+id);
  }


}
