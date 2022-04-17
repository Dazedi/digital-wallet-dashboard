import {
  InMemoryDBModule,
  InMemoryDBService,
} from '@nestjs-addons/in-memory-db';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeEntity } from './exchange.interface';
import { ExchangeService } from './exchange.service';

describe('ExchangeService', () => {
  let service: ExchangeService;
  let inMemoryDb: InMemoryDBService<ExchangeEntity>;

  let items: ExchangeEntity[] = [];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InMemoryDBModule.forRoot({})],
      providers: [ExchangeService],
    }).compile();

    service = module.get<ExchangeService>(ExchangeService);
    inMemoryDb = module.get<
      InMemoryDBService<ExchangeEntity>,
      InMemoryDBService<ExchangeEntity>
    >(InMemoryDBService);

    items = inMemoryDb.createMany([
      { id: 'YEN', rate: 100, symbol: '¥', name: 'Japanese Yen' },
    ]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(inMemoryDb).toBeDefined();
  });

  describe('getAll', () => {
    it('should return exchange array', async () => {
      const result = service.getAll();

      expect(result).toEqual(items);
    });
    it('insert item and should return it', async () => {
      const exchange = service.create({
        id: 'USD',
        rate: 1,
        symbol: '$',
        name: 'United States Dollar',
      });
      const result = service.getAll();

      expect(result.length).toBe(2);
      expect(result[1].id).toBe('USD');
      expect(result[1].rate).toBe(1);
    });
  });

  describe('create', () => {
    it('should create exchange and return it', async () => {
      const exchange = service.create({
        id: 'EUR',
        rate: 1,
        symbol: '€',
        name: 'Euro',
      });
      expect(exchange.id).toBe('EUR');
      expect(exchange.rate).toBe(1);
    });
  });

  describe('get', () => {
    it('should get existing exchanges', async () => {
      const exchange = service.get(items[0].id);
      expect(exchange).toEqual(items[0]);
    });
  });

  describe('update', () => {
    it('should update currency rate', async () => {
      items[0].rate = 2;
      service.update(items[0]);

      const exchange = service.get(items[0].id);
      expect(exchange).toEqual(items[0]);
      expect(exchange.rate).toBe(2);
    });
  });

  describe('delete', () => {
    it('should delete exchange', async () => {
      service.delete(items[0].id);
      const exchange = service.get(items[0].id);
      expect(exchange).toBeUndefined();
    });
  });
});
