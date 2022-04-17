import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import {
  BalanceResponse,
  TransactionListRequestParams,
  TransactionListResponse,
} from './wallet.interface';

@Injectable()
export class WalletService {
  private get accountUrl() {
    const url = new URL('https://api.etherscan.io/api');
    url.searchParams.set('module', 'account');
    return url;
  }

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  public async getBalance(address: string, tag?: string) {
    const url = this.accountUrl;
    url.searchParams.set('action', 'balance');
    url.searchParams.set('address', address);
    url.searchParams.set(
      'apikey',
      this.configService.get<string>('ETHERSCAN_API_KEY'),
    );
    if (tag) {
      url.searchParams.set('tag', tag);
    }
    return lastValueFrom(this.httpService.get<BalanceResponse>(url.href));
  }

  public async getTxList(
    address: string,
    {
      startBlock = 0,
      endBlock = 99999999,
      page = 1,
      offset = 10,
      sort = 'asc',
    }: TransactionListRequestParams = {},
  ) {
    const url = this.accountUrl;
    url.searchParams.set('action', 'txlist');
    url.searchParams.set('address', address);
    url.searchParams.set('startBlock', startBlock.toString());
    url.searchParams.set('endBlock', endBlock.toString());
    url.searchParams.set('page', page.toString());
    url.searchParams.set('offset', offset.toString());
    url.searchParams.set('sort', sort);

    return lastValueFrom(
      this.httpService.get<TransactionListResponse>(url.href),
    );
  }
}
