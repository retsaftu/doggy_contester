import { BadRequestException, Body, Controller, HttpCode, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from "./dto/auth.dto";
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { RegisterDto } from './dto/register.dto';
import { AuthGoogleDto } from './dto/authGoogle.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const oldUser = await this.authService.findUser(dto.email);
    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto);
  }



  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() { email, password }: AuthDto) {
    const { user } = await this.authService.validateUser(email, password);
    return this.authService.login(user);

  }

}
