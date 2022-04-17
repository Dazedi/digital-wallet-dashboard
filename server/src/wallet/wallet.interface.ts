export type EtherscanResponse<T = any> = {
  status: string;
  message: string;
  result: T;
};

export type BalanceResponse = EtherscanResponse<string>;

export type Transaction = {
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
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
};

export type TransactionList = Transaction[];

export type TransactionListResponse = EtherscanResponse<TransactionList>;

export type TransactionListRequestParams = {
  startBlock?: number;
  endBlock?: number;
  page?: number;
  offset?: number;
  sort?: string;
};
