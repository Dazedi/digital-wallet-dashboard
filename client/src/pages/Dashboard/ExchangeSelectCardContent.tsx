import { useState, useEffect } from 'react';
import {
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { Loader } from '@components/Loader';

import { ExchangeState } from './exchangeReducer';
import { WalletState } from './walletReducers';

interface ExchangeSelectCardContentProps {
  exchangeState: ExchangeState;
  walletState: WalletState;
  handleSelectCurrency(e: SelectChangeEvent<string>): void;
}

export const ExchangeSelectCardContent = (props: ExchangeSelectCardContentProps) => {
  const {
    exchangeState: {
      isLoading,
      isEditing,
      selected,
      exchanges,
    },
    walletState,
    handleSelectCurrency,
  } = props;

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Select
        labelId="currency-label"
        id="currency-select"
        value={selected?.id || ''}
        size="small"
        type="number"
        sx={{ background: 'white', width: 1 / 2 }}
        onChange={handleSelectCurrency}
        disabled={isEditing}
        displayEmpty={true}
      >
        {exchanges.length > 0 ? (
          exchanges.map((exchange) => (
            <MenuItem value={exchange.id}>{exchange.id}</MenuItem>
          ))
        ) : (
          <MenuItem value={''}>{''}</MenuItem>
        )}
      </Select>
      <WalletBalance walletState={walletState} currencySymbol={selected?.symbol || ''}/>
    </>
  )
}

interface WalletBalanceProps {
  walletState: WalletState;
  currencySymbol: string;
}

const WalletBalance = (props: WalletBalanceProps) => {
  const { 
    walletState: {
      isLoading,
      isLoaded,
      balance,
    },
    currencySymbol,
  } = props;

  const [text, setText] = useState('Loading...');

  useEffect(() => {
    if (isLoading) {
      setText('Loading...')
    } else if (!isLoaded) {
      setText(`0 ${currencySymbol}`);
    } else {
      setText(`${balance} ${currencySymbol}`);
    }
  }, [isLoading, isLoaded, balance]);

  return (
    <Typography variant="body1" sx={{ fontWeight: 'bold', py: 2 }}>
      {text}
    </Typography>
  )
}