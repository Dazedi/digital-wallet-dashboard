import { useEffect, useState, useReducer } from 'react';
import {
  Alert,
  TextField,
  Box,
  Button,
  Grid,
  Card,
  SelectChangeEvent,
} from '@mui/material';
import { ReportProblemRounded } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import Page from '@components/Page';
import { APIError } from '@/api/APIUtils';
import { ExchangeApi } from '@/api/ExchangeAPI';
import { WalletApi } from '@/api/WalletAPI';

import { ExchangeRateCardContent } from './ExchangeRateCardContent';
import { ExchangeSelectCardContent } from './ExchangeSelectCardContent';

import { exchangeReducer, initExchangeState } from './exchangeReducer';
import { walletReducer, initWalletState } from './walletReducers';

export const Dashboard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [walletAddress, setWalletAddress] = useState('');
  const [isOld, setIsOld] = useState(false);
  const [exchangeState, exchangeDispatch] = useReducer(
    exchangeReducer,
    initExchangeState,
  );
  const [walletState, walletDispatch] = useReducer(
    walletReducer,
    initWalletState,
  );

  const fetchExchanges = async () => {
    exchangeDispatch({ type: 'FETCH_EXCHANGES_START' });
    const result = await ExchangeApi.fetchExchanges();
    if (result instanceof APIError) {
      exchangeDispatch({ type: 'FETCH_EXCHANGES_ERROR', payload: result });
      enqueueSnackbar(result.message, { variant: 'error' });
    } else {
      exchangeDispatch({ type: 'FETCH_EXCHANGES_SUCCESS', payload: result });
    }
  };

  const fetchBalance = async (currency?: string) => {
    if (walletAddress && exchangeState.selected) {
      walletDispatch({ type: 'FETCH_BALANCE_START' });
      const result = await WalletApi.fetchWalletBalance(
        walletAddress,
        currency || exchangeState.selected.id,
      );
      if (result instanceof APIError) {
        walletDispatch({ type: 'FETCH_BALANCE_ERROR', payload: result });
        enqueueSnackbar(result.message, { variant: 'error' });
      } else {
        walletDispatch({ type: 'FETCH_BALANCE_SUCCESS', payload: result });
      }
    }
  };

  const fetchAge = async () => {
    if (walletAddress) {
      const result = await WalletApi.fetchWalletAge(walletAddress);
      if (result instanceof APIError) {
        // ERROR
        enqueueSnackbar(result.message, { variant: 'error' });
      } else {
        setIsOld(result);
      }
    }
  };

  const handleWalletSearch = () => {
    fetchBalance();
    fetchAge();
  };

  const handleSelectCurrency = (e: SelectChangeEvent<string>) => {
    exchangeDispatch({ type: 'SELECT_EXCHANGE', payload: e.target.value });
    fetchBalance(e.target.value);
  };

  useEffect(() => {
    fetchExchanges();

    return () => {
      exchangeDispatch({ type: 'RESET' });
    };
  }, []);

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
        <Button onClick={handleWalletSearch}>Search</Button>
      </Box>
      {isOld && (
        <Alert
          severity="error"
          iconMapping={{
            error: <ReportProblemRounded fontSize="inherit" />,
          }}
        >
          Wallet is old!
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid item xs={6}>
          <Card
            variant="outlined"
            sx={{
              backgroundColor: '#f8f9fb',
              height: 130,
              position: 'relative',
            }}
          >
            <ExchangeRateCardContent
              exchangeState={exchangeState}
              dispatch={exchangeDispatch}
              fetchBalance={fetchBalance}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            variant="outlined"
            sx={{ backgroundColor: '#f8f9fb', height: 130, px: 3, py: 3, position: 'relative', }}
          >
            <ExchangeSelectCardContent
              exchangeState={exchangeState}
              walletState={walletState}
              handleSelectCurrency={handleSelectCurrency}
            />
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

export default Dashboard;