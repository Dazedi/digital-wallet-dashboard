import { APIError } from '@/api/APIUtils';

export type WalletState = {
  balance: number;
  isLoading: boolean;
  isLoaded: boolean;
  isError?: APIError;
};

export const initWalletState: WalletState = {
  balance: 0,
  isLoading: false,
  isLoaded: false,
};

type WalletAction =
  | {
      type: 'FETCH_BALANCE_START';
    }
  | {
      type: 'FETCH_BALANCE_SUCCESS';
      payload: number;
    }
  | {
      type: 'FETCH_BALANCE_ERROR';
      payload: APIError;
    }
  | {
      type: 'RESET';
    };

export function walletReducer(
  state: WalletState,
  action: WalletAction,
): WalletState {
  switch (action.type) {
    case 'FETCH_BALANCE_START':
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        isError: undefined,
      };
    case 'FETCH_BALANCE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        balance: action.payload,
        isError: undefined,
      };
    case 'FETCH_BALANCE_ERROR':
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        isError: action.payload,
      };
    case 'RESET':
      return initWalletState;
    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}
