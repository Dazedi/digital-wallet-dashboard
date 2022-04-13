import { IsNotEmpty, Min, IsNumber, IsString } from 'class-validator';

export class CreateExchangeDto {
    @IsNotEmpty()
    @IsString()
    currency: string;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    rate: number;
}