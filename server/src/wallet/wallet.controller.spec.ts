import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExchangeModule } from '../exchange/exchange.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

describe('WalletController', () => {
  let controller: WalletController;
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, HttpModule, ExchangeModule],
      controllers: [WalletController],
      providers: [WalletService],
    }).compile();

    controller = module.get<WalletController>(WalletController);
    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
