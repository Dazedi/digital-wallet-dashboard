import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { ExchangeService } from '../exchange/exchange.service';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly exchangeService: ExchangeService,
  ) {}

  @Get(':address/balance')
  async getBalance(
    @Param('address') address: string,
    @Query('currencyId') currencyId: string,
  ) {
    const result = await this.walletService.getBalance(address);

    if (result.data.status !== '1') {
      throw new HttpException(result.data.message, HttpStatus.BAD_REQUEST);
    }

    const eth = parseInt(result.data.result, 10) / 1000000000000000000;
    
    console.log('wei', result.data.result);
    console.log('etc', eth);

    const exchange = this.exchangeService.get(currencyId);

    if (!exchange) {
      throw new HttpException(
        `Exchange with selected currency not found`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return eth * exchange.rate;
  }

  @Get(':address/isOld')
  async isOldWallet(@Param('address') address: string) {
    const result = await this.walletService.getTxList(address, {
      sort: 'asc',
      offset: 1,
    });

    const oldestTransaction = result.data.result[0];

    return (
      parseInt(oldestTransaction.timeStamp, 10) * 1000 +
        365 * 24 * 60 * 60 * 1000 <
      Date.now()
    );
  }
}
