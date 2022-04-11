import { IsString } from 'class-validator';

export class RegisterDto {
	@IsString()
	name?: string;

	@IsString()
	username: string;
	
	@IsString()
	email: string;

	@IsString()
	password: string;

	@IsString()
	avatar: string;
}