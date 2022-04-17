import { APIError } from '@/api/APIUtils';
import { Exchange } from '@/api/ExchangeAPI';

export type ExchangeState = {
  exchanges: Exchange[];
  selected?: Exchange;
  isLoading: boolean;
  isError?: APIError;
  isEditing: boolean;
};

export const initExchangeState: ExchangeState = {
  exchanges: [],
  isLoading: false,
  isEditing: false,
};

export type ExchangeAction =
  | {
      type: 'FETCH_EXCHANGES_START';
    }
  | {
      type: 'FETCH_EXCHANGES_SUCCESS';
      payload: Exchange[];
    }
  | {
      type: 'FETCH_EXCHANGES_ERROR';
      payload: APIError;
    }
  | {
      type: 'SELECT_EXCHANGE';
      payload: Exchange['id'];
    }
  | {
      type: 'START_EDIT';
    }
  | {
      type: 'CANCEL_EDIT';
    }
  | {
      type: 'SUBMIT_EDIT';
    }
  | {
      type: 'EDIT_RATE';
      payload: Exchange['rate'];
    }
  | {
      type: 'RESET';
    };

function cancelEdit(state: ExchangeState): ExchangeState {
  const original = state.exchanges.find((ex) => ex.id === state.selected?.id);
  if (original) {
    return {
      ...state,
      selected: original,
      isEditing: false,
    };
  }
  return {
    ...state,
    selected: undefined,
    isEditing: false,
  };
}

function selectExchange(state: ExchangeState, currency: string): ExchangeState {
  const selected = state.exchanges.find((ex) => ex.id === currency);
  if (selected) {
    return {
      ...state,
      selected,
    };
  }
  return state;
}

function submitRateEdit(state: ExchangeState): ExchangeState {
  const originalIdx = state.exchanges.findIndex(
    (ex) => ex.id === state.selected?.id,
  );
  if (originalIdx > -1 && state.selected) {
    const exchanges = state.exchanges;
    exchanges[originalIdx] = state.selected;
    return {
      ...state,
      exchanges,
      isEditing: false,
    };
  }
  return state;
}

function editExchangeRate(state: ExchangeState, rate: number): ExchangeState {
  if (state.selected) {
    return {
      ...state,
      selected: {
        ...state.selected,
        rate: rate,
      },
    };
  }

  return {
    ...state,
    isEditing: false,
  };
}

export function exchangeReducer(
  state: ExchangeState,
  action: ExchangeAction,
): ExchangeState {
  switch (action.type) {
    case 'FETCH_EXCHANGES_START':
      return {
        ...state,
        isLoading: true,
        isError: undefined,
      };
    case 'FETCH_EXCHANGES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        exchanges: action.payload,
        selected: action.payload[0],
        isError: undefined,
      };
    case 'FETCH_EXCHANGES_ERROR':
      return {
        ...state,
        isLoading: false,
        exchanges: [],
        isError: action.payload,
      };
    case 'SELECT_EXCHANGE':
      return selectExchange(state, action.payload);
    case 'START_EDIT':
      return {
        ...state,
        isEditing: true,
      };
    case 'CANCEL_EDIT':
      return cancelEdit(state);
    case 'SUBMIT_EDIT':
      return submitRateEdit(state);
    case 'EDIT_RATE':
      return editExchangeRate(state, action.payload);
    case 'RESET':
      return initExchangeState;
    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}
