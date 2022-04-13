import { InMemoryDBService, InMemoryDBEntity } from '@nestjs-addons/in-memory-db';
import { Injectable } from '@nestjs/common';

export interface ExchangeEntity extends InMemoryDBEntity {
    currency: string;
    rate: number;
}

@Injectable()
export class ExchangeService {
    constructor(private readonly inMemoryDb: InMemoryDBService<ExchangeEntity>) {}

    public getAll() {
        return this.inMemoryDb.getAll();
    }

    public create(exchange: Omit<ExchangeEntity, 'id'>) {
        return this.inMemoryDb.create(exchange);
    }

    public get(id: string) {
        return this.inMemoryDb.get(id);
    }

    public getByCurrency(currency: string) {
        const exchanges = this.inMemoryDb.query((o) => o.currency === currency);
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
