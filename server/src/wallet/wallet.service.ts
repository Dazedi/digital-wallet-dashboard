import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

type EtherscanResponse<T = any> = {
    status: string;
    message: string;
    result: T;
}

type BalanceResponse = EtherscanResponse<string>;

type Transaction = {
    blockNumber: string;
    timeStamp: string;
    hash: string;
    nonce: string;
    blockHash: string;
    transactionIndex: string;
    from: string;
    to: string;
    value: string;
    gas: string;
    gasPrice: string;isError: string;
    txreceipt_status: string;
    input: string;
    contractAddress: string;
    cumulativeGasUsed: string;
    gasUsed: string;
    confirmations: string;
}

type TransactionList = Transaction[];

type TransactionListResponse = EtherscanResponse<TransactionList>;

type TransactionListRequestParams = {
    startBlock?: number;
    endBlock?: number;
    page?: number;
    offset?: number;
    sort?: string; 
}

@Injectable()
export class WalletService {
    private get accountUrl() {
        const url = new URL('https://api.etherscan.io/api');
        url.searchParams.set('module', 'account');
        return url;
    }

    constructor(private configService: ConfigService, private httpService: HttpService) {
        // this.client = init(configService.get<string>('ETHERSCAN_API_KEY'));

        // console.log(this.client);
    }

    public async getBalance(address: string, tag?: string) {
        const url = this.accountUrl;
        url.searchParams.set('action', 'balance');
        url.searchParams.set('address', address);
        url.searchParams.set('apikey', this.configService.get<string>('ETHERSCAN_API_KEY'));
        if (tag) {
            url.searchParams.set('tag', tag);
        }
        return lastValueFrom(this.httpService.get<BalanceResponse>(url.href));
    }

    public async getTxList(address: string, { startBlock = 0, endBlock = 99999999, page = 1, offset = 10, sort = 'asc' }: TransactionListRequestParams = {}) {
        const url = this.accountUrl;
        url.searchParams.set('action', 'txlist');
        url.searchParams.set('address', address);
        url.searchParams.set('startBlock', startBlock.toString());
        url.searchParams.set('endBlock', endBlock.toString());
        url.searchParams.set('page', page.toString());
        url.searchParams.set('offset', offset.toString());
        url.searchParams.set('sort', sort);

        return lastValueFrom(this.httpService.get<TransactionListResponse>(url.href));
    }
}
