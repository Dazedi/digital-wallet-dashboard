import axios from 'axios';
import { APIError } from './APIUtils';

export const WalletApi = {
  fetchWalletAge: async (
    walletAddress: string,
  ): Promise<boolean | APIError> => {
    try {
      const response = await axios.get<boolean>(
        `/v1/api/wallet/${walletAddress}/isOld`,
      );
      return response.data;
    } catch (err) {
      const data: Record<string, any> = {};
      if (axios.isAxiosError(err)) {
        data.message = err.message;
        if (err.response) {
          data.data = err.response.data;
        }
      }
      return new APIError('Failed to fetch wallet age', data);
    }
  },
  fetchWalletBalance: async (
    walletAddress: string,
    currencyId: string,
  ): Promise<number | APIError> => {
    try {
      const response = await axios.get<number>(
        `/v1/api/wallet/${walletAddress}/balance?currency=${currencyId}`,
      );
      return response.data;
    } catch (err) {
      const data: Record<string, any> = {};
      if (axios.isAxiosError(err)) {
        data.message = err.message;
        if (err.response) {
          data.data = err.response.data;
        }
      }
      return new APIError('Failed to fetch wallet balance', data);
    }
  },
};
