import { IsNumber } from "class-validator";

export class RechargeBalance {

    @IsNumber()
    balance: number;
}