import { IsNotEmpty, Min, IsNumber, IsString } from 'class-validator';

export class CreateExchangeDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    symbol: string;

    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    rate: number;
}