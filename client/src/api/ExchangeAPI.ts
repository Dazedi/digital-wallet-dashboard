import axios from 'axios';
import { APIError } from './APIUtils';

export type Exchange = {
  id: string; // currency
  symbol: string;
  name: string;
  rate: number;
};

export const ExchangeApi = {
  fetchExchanges: async (): Promise<Exchange[] | APIError> => {
    try {
      const response = await axios.get<Exchange[]>('/v1/api/exchange');
      return response.data;
    } catch (err) {
      const data: Record<string, any> = {};
      if (axios.isAxiosError(err)) {
        data.message = err.message;
        if (err.response) {
          data.data = err.response.data;
        }
      }
      return new APIError('Failed to fetch exchanges', data);
    }
  },
  updateExchange: async (data: Exchange): Promise<void | APIError> => {
    try {
      const response = await axios.put<void>(`/v1/api/exchange/${data.id}`, {
        rate: data.rate,
      });
      return response.data;
    } catch (err) {
      const data: Record<string, any> = {};
      if (axios.isAxiosError(err)) {
        data.message = err.message;
        if (err.response) {
          data.data = err.response.data;
        }
      }
      return new APIError('Failed to update exchange', data);
    }
  },
};
