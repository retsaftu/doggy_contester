import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, Put } from '@nestjs/common';
import { ContestService } from './contest.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ID_NOT_FOUND } from './contest.constants';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Req() req: any,
    @Body() createContestDto: CreateContestDto
  ) {
    return this.contestService.create(createContestDto, req.user);
  }

  @Get()
  findAll() {
    return this.contestService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myContests')
  findMyContest(
    @Req() req: any,
    // @Query('id') id: string
  ) {
    // console.log(`req`, req);
    const id = req.user._id
    // console.log(`req.user`, req.user.email);
    // console.log(`req.user`, req._id);
    // console.log(`id`, id);
    if (!id) {
      return ID_NOT_FOUND
    }
    return this.contestService.findMyContest(id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('myActiveContests')
  async findMyActiveContest(
    @Req() req: any,

    // @Query('id') id: string
  ) {
    console.log('---myActiveContests');

    const id = req.user._id

    console.log(`id`, id);
    if (!id) {
      return ID_NOT_FOUND
    } else
      return this.contestService.findMyActiveContest(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('currentContests')
  findCurrentContests(
    @Req() req: any,

    // @Query('id') id: string
  ) {
    console.log('---currentContests');

    const id = req.user._id

    console.log(`id`, id);
    if (!id) {
      return ID_NOT_FOUND
    }
    return this.contestService.findCurrentContests(id);
  }

  @Get('currentContestsForUnauthorizedUser')
  findCurrentContestsForUnauthorizedUser(
    @Req() req: any,

    // @Query('id') id: string
  ) {
    return this.contestService.findCurrentContestsForUnauthorizedUser();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('joinContest/:contestId')
  joinContest(@Param('contestId') contestId: string, @Req() req: any) {
    console.log('contestId', contestId)
    const userId = req.user._id;
    const username = req.user.username;
    return this.contestService.joinContest(contestId, userId, username);
  }

  @Get(':_id')
  findOne(
    @Param('_id') _id: string
  ) {
    return this.contestService.findOne(_id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto) {
  //   return this.contestService.update(+id, updateContestDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contestService.remove(+id);
  }
}
