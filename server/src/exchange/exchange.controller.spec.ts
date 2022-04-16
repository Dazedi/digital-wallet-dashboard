import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

describe('ExchangeController', () => {
  let controller: ExchangeController;
  let service: ExchangeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [InMemoryDBModule.forRoot({})],
      controllers: [ExchangeController],
      providers: [ExchangeService],
    }).compile();

    controller = module.get<ExchangeController>(ExchangeController);
    service = module.get<ExchangeService>(ExchangeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
