import { useEffect, useState, useReducer, useMemo } from "react";
import { Alert, TextField, Box, Button, Grid, Card, CardContent, Typography, Select, FormControl, InputLabel, MenuItem, IconButton, SelectChangeEvent, TextFieldProps } from "@mui/material";
import { ReportProblemRounded, Edit, Check, Close } from "@mui/icons-material";
import Page from '@components/Page'
import axios from "axios";

type Exchange = {
  id: string; // currency
  symbol: string;
  name: string;
  rate: number;
}

type ExchangeState = {
  exchanges: Exchange[];
  selected?: Exchange;
  isLoading: boolean;
  isError?: APIError;
  isEditing: boolean;
}

const initExchangeState: ExchangeState = {
  exchanges: [],
  isLoading: false,
  isEditing: false,
}

type ExchangeAction =
  | {
    type: 'FETCH_EXCHANGES_START',
  }
  | {
    type: 'FETCH_EXCHANGES_SUCCESS',
    payload: Exchange[],
  }
  | {
    type: 'FETCH_EXCHANGES_ERROR',
    payload: APIError,
  }
  | { 
    type: 'SELECT_EXCHANGE',
    payload: Exchange['id'],
  }
  | {
    type: 'START_EDIT',
  }
  | {
    type: 'CANCEL_EDIT',
  }
  | {
    type: 'SUBMIT_EDIT',
  }
  | {
    type: 'EDIT_RATE',
    payload: Exchange['rate'],
  }
  | {
    type: 'RESET',
  }


function exchangeReducer(state: ExchangeState, action: ExchangeAction): ExchangeState {
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
      const selected = state.exchanges.find((ex) => ex.id === action.payload);
      if (selected) {
        return {
          ...state,
          selected,
        }
      }
      return state;
    case 'START_EDIT':
      return {
        ...state,
        isEditing: true,
      }
    case 'CANCEL_EDIT':
      const original = state.exchanges.find((ex) => ex.id === state.selected?.id);
      if (original) {
        return {
          ...state,
          selected: original,
          isEditing: false,
        }
      }
      return {
        ...state,
        selected: undefined,
        isEditing: false,
      };
    case 'SUBMIT_EDIT':
      const originalIdx = state.exchanges.findIndex((ex) => ex.id === state.selected?.id);
      if (originalIdx > -1 && state.selected) {
        const exchanges = state.exchanges;
        exchanges[originalIdx] = state.selected;
        return {
          ...state,
          exchanges,
          isEditing: false,
        }
      }
      return state;
    case 'EDIT_RATE':
      if (state.selected) {
        return {
          ...state,
          selected: {
            ...state.selected,
            rate: action.payload,
          }
        }
      }
      
      return {
        ...state,
        isEditing: false,
      };
    case 'RESET':
      return initExchangeState;
    default:
      throw new Error(`Unknown action type: ${(action as any).type}`);
  }
}

type WalletState = {
  balance: number;
  isLoading: boolean;
  isLoaded: boolean;
  isError?: APIError;
}

const initWalletState: WalletState = {
  balance: 0,
  isLoading: false,
  isLoaded: false,
}

type WalletAction =
  | {
    type: 'FETCH_BALANCE_START',
  }
  | {
    type: 'FETCH_BALANCE_SUCCESS',
    payload: number,
  }
  | {
    type: 'FETCH_BALANCE_ERROR',
    payload: APIError,
  }
  | {
    type: 'RESET'
  }


function walletReducer(state: WalletState, action: WalletAction): WalletState {
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

class APIError extends Error {
  public data?: any;
  
  constructor(message?: string, data?: any) {
    super(message);
    this.name = 'API_ERROR';
    this.data = data;
  }
}

const WalletApi = {
  fetchWalletAge: async (walletAddress: string): Promise<boolean | APIError> => {
    try {
      const response = await axios.get<boolean>(`/v1/api/wallet/${walletAddress}/isOld`);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          return new APIError(err.message, err.response.data);
        }
        return new APIError(err.message);
      }
      return new APIError('Failed to fetch wallet age');
    }
  },
  fetchWalletBalance: async (walletAddress: string, currencyId: string): Promise<number | APIError> => {
    try {
      const response = await axios.get<number>(`/v1/api/wallet/${walletAddress}/balance?currencyId=${currencyId}`);
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          return new APIError(err.message, err.response.data);
        }
        return new APIError(err.message);
      }
      return new APIError('Failed to fetch wallet balance');
    }
  }
}

const ExchangeApi = {
  fetchExchanges: async (): Promise<Exchange[] | APIError> => {
    try {
      const response = await axios.get<Exchange[]>('/v1/api/exchange');
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          return new APIError(err.message, err.response.data);
        }
        return new APIError(err.message);
      }
      return new APIError('Failed to fetch exchanges');
    }
  },
  updateExchange: async (data: Exchange): Promise<void | APIError> => {
    try {
      const response = await axios.put<void>(`/v1/api/exchange/${data.id}`, {
        data: {
          rate: data.rate,
        }
      });
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          return new APIError(err.message, err.response.data);
        }
        return new APIError(err.message);
      }
      return new APIError('Failed to update exchange');
    }
  }
}

export const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isOld, setIsOld] = useState(false);
  const [exchangeState, exchangeDispatch] = useReducer(exchangeReducer, initExchangeState);
  const [walletState, walletDispatch] = useReducer(walletReducer, initWalletState);
  const [validRate, setValidRate] = useState(true);

  const fetchExchanges = async () => {
    exchangeDispatch({ type: 'FETCH_EXCHANGES_START' });
    const result = await ExchangeApi.fetchExchanges();
    if (result instanceof APIError) {
      exchangeDispatch({ type: 'FETCH_EXCHANGES_ERROR', payload: result });
    } else {
      exchangeDispatch({ type: 'FETCH_EXCHANGES_SUCCESS', payload: result });
    }
  }

  const fetchBalance = async () => {
    if (walletAddress && exchangeState.selected) {
      walletDispatch({ type: 'FETCH_BALANCE_START' });
      const result = await WalletApi.fetchWalletBalance(walletAddress, exchangeState.selected.id);
      if (result instanceof APIError) {
        walletDispatch({ type: 'FETCH_BALANCE_ERROR', payload: result });
      } else {
        walletDispatch({ type: 'FETCH_BALANCE_SUCCESS', payload: result });
      }
    }
  }

  const fetchAge = async () => {
    if (walletAddress) {
      const result = await WalletApi.fetchWalletAge(walletAddress);
      if (result instanceof APIError) {
        // ERROR
      } else {
        setIsOld(result);
      }
    }
  }

  const handleWalletSearch = () => {
    fetchBalance();
    fetchAge();
  }

  const handleSelectCurrency = (e: SelectChangeEvent<string>) => {
    exchangeDispatch({ type: 'SELECT_EXCHANGE', payload: e.target.value });
    fetchBalance();
  }

  useEffect(() => {
    fetchExchanges();
    
    return () => {
      exchangeDispatch({ type: 'RESET' });
    }
  }, [])

  return (
    <Page sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField 
          label="Wallet address" 
          placeholder="Input wallet address" 
          size="small"
          sx={{
            flex: 1,
          }}
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
        />
        <Button 
          onClick={handleWalletSearch}
        >
          Search
        </Button>
      </Box>
      {
        isOld && (
          <Alert
            severity="error"
            iconMapping={{
              error: <ReportProblemRounded fontSize="inherit" />,
            }}
          >
            Wallet is old!
          </Alert>
        )
      }
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ backgroundColor: "#f8f9fb", height: 130, position: 'relative' }}>
            <Box sx={{ display: 'flex', justifyContent: 'end', padding: '4px' }}>
              {
                exchangeState.isLoading 
                ? null
                : exchangeState.isEditing
                ? <>
                  <IconButton size="small" color="error" onClick={() => {
                    setValidRate(true);
                    exchangeDispatch({ type: 'CANCEL_EDIT' })
                  }}><Close sx={{ fontSize: 16 }}/></IconButton>
                  <IconButton size="small" color="success" onClick={() => {
                    exchangeDispatch({ type: 'CANCEL_EDIT' })
                  }} disabled={!validRate}><Check sx={{ fontSize: 16 }}/></IconButton>
                </>
                : <IconButton size="small" onClick={() => {
                  exchangeDispatch({ type: 'START_EDIT' })
                }}><Edit sx={{ fontSize: 16, color: '#3a74e1' }}/></IconButton>
              }
            </Box>
            <Box sx={{ px: 3 }}>
              {
                exchangeState.isLoading 
                ? 'Loading...' 
                : exchangeState.isEditing
                ? (
                  <NumberInput 
                    value={exchangeState.selected?.rate || 0} 
                    onValidChange={(value) => {
                      exchangeDispatch({ type: 'EDIT_RATE', payload: value })
                    }}
                    onChangeValidState={(value) => {
                      setValidRate(value);
                    }}
                    sx={{ py: 0 }}
                  />
                )
                : (
                  <Typography variant="body1" sx={{ fontWeight: "bold", py: 2 }}>
                    {exchangeState.selected?.rate}
                  </Typography>
                )
              }
            </Box>
            {`real rate: ${exchangeState.selected?.rate}`}
            {/* <TextField value={exchangeState.selected?.rate} inputProps={{ inputMode: 'decimal' }} fullWidth onChange={(e) => {
                exchangeDispatch({ type: 'EDIT_RATE', payload: parseInt(e.target.value) })
              }}/> */}
            {/* <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              {exchangeState.selected?.rate}
            </Typography> */}
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" sx={{ backgroundColor: "#f8f9fb", height: 130, px: 3, py: 3 }}>
            { exchangeState.isLoading ? 'loading...' : (
              <>
                <Select
                  labelId="currency-label"
                  id="currency-select"
                  value={exchangeState.selected?.id}
                  size="small"
                  type="number"
                  sx={{ background: 'white', width: 1/2 }}
                  onChange={handleSelectCurrency}
                  disabled={exchangeState.isEditing}
                >
                  {exchangeState.exchanges.map((exchange) => (
                    <MenuItem value={exchange.id}>{exchange.id}</MenuItem>
                  ))}
                </Select>
                <Typography variant="body1" sx={{ fontWeight: "bold", py: 2 }}>
                  {
                    walletState.isLoading 
                      ? 'loading...' 
                      : !walletState.isLoaded 
                      ? `0 ${exchangeState.selected?.symbol}` 
                      : `${walletState.balance} ${exchangeState.selected?.symbol}` 
                  }
                </Typography>
              </>
            ) }
          </Card>
        </Grid>
      </Grid>
    </Page>
  )
}

interface NumberInputProps {
  value: number;
  onChangeValidState: (value: boolean) => void;
  onValidChange: (value: number) => void;
  sx?: TextFieldProps['sx'];
}

const NumberInput = ({ value, onValidChange, onChangeValidState, sx }: NumberInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());
  
  const isValid = useMemo(
    () => {
      return value.toString() === inputValue;
    },
    [inputValue, value]
  );
    

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onValidChange(num);
    }
    onChangeValidState(inputValue === num.toString());
  }, [inputValue]);

  return (
    <TextField 
      value={inputValue} 
      fullWidth 
      onChange={(e) => {
        setInputValue(e.target.value);
      }}
      helperText={!isValid && 'Not valid number'}
      error={!isValid}
      sx={{
        backgroundColor: 'white',
        ...sx
      }}
    />
  )
}

export default Dashboard;