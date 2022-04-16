import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateExchangeDto {
  @IsNumber()
  @Min(0)
  rate: number;
}