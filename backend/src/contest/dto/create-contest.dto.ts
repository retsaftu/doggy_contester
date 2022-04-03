import { IsArray, IsString } from 'class-validator';


export class CreateContestDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsArray()
    tasks: [];
}
