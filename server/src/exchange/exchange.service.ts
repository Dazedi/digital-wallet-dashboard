import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';
import { ExchangeEntity } from './exchange.interface';

@Injectable()
export class ExchangeService {
  constructor(private readonly inMemoryDb: InMemoryDBService<ExchangeEntity>) {
    inMemoryDb.createMany([
      {
        id: 'USD',
        symbol: '$',
        name: 'United States Dollar',
        rate: 1.23,
      },
      {
        id: 'EUR',
        symbol: '€',
        name: 'Euro',
        rate: 0.91,
      },
    ]);
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

  public update(exchange: ExchangeEntity) {
    this.inMemoryDb.update(exchange);
  }

  public delete(id: string) {
    this.inMemoryDb.delete(id);
  }
}
