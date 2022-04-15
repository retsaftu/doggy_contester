import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsDateString, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';




class Task {
    @IsString()
    index: string

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    inputExample: string;

    @IsString()
    outputExample: string;



    @IsString()
    code?: string;

    @IsString()
    time: string;

    @IsString()
    memory: string;

    @IsArray()
    @Type(() => Test)
    @ValidateNested()
    tests: Test[];
}

class Test {
    @IsString()
    input: string;

    @IsString()
    output: string;
}

class Owner {
    @IsString()
    _id: string;

    @IsString()
    name: string;
}






export class CreateContestDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    // @Type(() => Owner)
    // @ValidateNested()
    // @IsObject()
    // owner: Owner;

    @IsNumber()
    total_participants: number;

    @IsDateString()
    startDate: Date | string;

    @IsDateString()
    endDate: Date | string;

    @IsBoolean()
    premium: boolean

    @IsNumber()
    price?: number

    @IsArray()

    @Type(() => Task)
    @ValidateNested()
    tasks: Task[];
}

