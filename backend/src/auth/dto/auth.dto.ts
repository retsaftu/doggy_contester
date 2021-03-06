import { IsEmail, IsString } from 'class-validator';

export class AuthDto {
	@IsString()
	email: string;

	@IsString()
	password: string;
}

export class LoginByGoogleAccountDto {
	@IsString()
	email: string;
}