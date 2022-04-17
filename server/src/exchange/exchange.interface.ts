import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

// Exchanges from ISO 4216 currency from ETH to selected currency
export interface ExchangeEntity extends InMemoryDBEntity {
  /**
   * id is a ISO 4216 alphabetic currency code
   */
  id: string;
  symbol: string;
  name: string;
  /**
   * Rate from currency to ETH (Ethereum)
   */
  rate: number;
}
