import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UpdateUserDto, UpdateUserProfileDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RechargeBalance } from './dto/balance.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log(`id`, id);
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deleteAvatar')
  deleteAvatar(@Req() req: any) {
    const userId = req.user._id;
    return this.userService.deleteAvatar(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateUserProfile')
  updateUserProfile(@Req() req: any, @Body() updateUserProfile: UpdateUserProfileDto) {
    const userId = req.user._id;
    console.log(updateUserProfile);
    return this.userService.updateUserProfile(userId, updateUserProfile);
  }

  @UseGuards(JwtAuthGuard)
  @Put('changePassword')
  changePassword(@Req() req: any, @Body() changePassword: ChangePasswordDto) {
    const userId = req.user._id;
    console.log('changePassword', changePassword)
    return this.userService.changePassword(userId, changePassword); 
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('balance/recharge')
  rechargeBalance(@Req() req: any, @Body() rechargeBalance: RechargeBalance) {
    const userId = req.user._id;
    return this.userService.rechargeBalance(userId, rechargeBalance.balance);
  }
}
