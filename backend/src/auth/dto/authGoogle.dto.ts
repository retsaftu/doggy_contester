import { IsEmail, IsString } from 'class-validator';

export class AuthGoogleDto {
	@IsString()
	username: string;

	@IsString()
	name: string;

	@IsEmail()
	email: string;

}