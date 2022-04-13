import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [ConfigModule.forRoot(), WalletModule, ExchangeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
