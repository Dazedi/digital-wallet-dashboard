import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateExchangeDto {
    @IsString()
    currency: string;
    
    @IsNumber()
    @Min(0)
    rate: number;
}