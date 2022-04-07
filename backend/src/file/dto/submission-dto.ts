import { Type } from 'class-transformer';
import { IsArray, IsDate, IsDateString, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';


export class CreateSubmissionDto {
    @IsString()
    contestId: string;

    @IsString()
    taskId: string;

    @IsString()
    extension: string
}

