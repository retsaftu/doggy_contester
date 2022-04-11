import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserProfileDto {
    @IsString()
    name: string;

    @IsString()
    username: string;

    @IsString()
    about: string;

    @IsString()
    avatar: string;
}

export class UpdateUserProfileDto extends PartialType(UserProfileDto) {}

export class ChangePasswordDto {
    @IsString()
    oldPassword: string;

    @IsString()
    newPassword: string;
}