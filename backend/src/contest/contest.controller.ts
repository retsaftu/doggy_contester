import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ID_NOT_FOUND } from './contest.constants';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) { }

  // @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createContestDto: CreateContestDto) {
    return this.contestService.create(createContestDto);
  }

  @Get()
  findAll() {
    return this.contestService.findAll();
  }

  @Get('myContests')
  findMyContest(@Query('id') id: string) {
    console.log(`id`, id);
    if (!id) {
      return ID_NOT_FOUND
    }
    return this.contestService.findMyContest(id);
  }

  @Get('myActiveContests')
  findMyActiveContest(@Query('id') id: string) {
    console.log(`id`, id);
    if (!id) {
      return ID_NOT_FOUND
    }
    return this.contestService.findMyActiveContest(id);
  }

  @Get('currentContests')
  findCurrentContests(@Query('id') id: string) {
    console.log(`id`, id);
    if (!id) {
      return ID_NOT_FOUND
    }
    return this.contestService.findCurrentContests(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto) {
    return this.contestService.update(+id, updateContestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contestService.remove(+id);
  }
}
