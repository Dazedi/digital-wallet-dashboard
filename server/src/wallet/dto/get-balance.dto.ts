import { IsString, IsNotEmpty } from 'class-validator';

export class GetBalanceDto {
  @IsNotEmpty()
  @IsString()
  currency: string;
}
