import {
  InMemoryDBService,
  InMemoryDBEntity,
} from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';

// Exchanges from ISO 4216 currency from ETH to selected currency
export interface ExchangeEntity extends InMemoryDBEntity {
  /**
   * id is a ISO 4216 alphabetic currency code
   */
  id: string;
  symbol: string;
  name: string;
  rate: number;
}

@Injectable()
export class ExchangeService {
  constructor(private readonly inMemoryDb: InMemoryDBService<ExchangeEntity>) {
    inMemoryDb.createMany([{
      id: 'USD',
      symbol: '$',
      name: 'United States Dollar',
      rate: 1.23,
    }, {
      id: 'EUR',
      symbol: '€',
      name: 'Euro',
      rate: 0.91
    }])
  }

  public getAll() {
    return this.inMemoryDb.getAll();
  }

  public create(exchange: ExchangeEntity): ExchangeEntity {
    return this.inMemoryDb.create(exchange);
  }

  public get(id: string): ExchangeEntity | undefined {
    return this.inMemoryDb.get(id);
  }

  public getByCurrency(currency: string): ExchangeEntity | undefined {
    const exchanges = this.inMemoryDb.query((o) => o.id === currency);
    if (exchanges.length > 0) return exchanges[0];
    return null;
  }

  public update(exchange: ExchangeEntity) {
    this.inMemoryDb.update(exchange);
  }

  public delete(id: string) {
    this.inMemoryDb.delete(id);
  }
}
