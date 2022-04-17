import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress
} from '@mui/material';
import { Edit, Check, Close } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { APIError } from '@/api/APIUtils';
import { ExchangeApi } from '@/api/ExchangeAPI';
import { NumberInput } from '@components/NumberInput';
import { Loader } from '@components/Loader';

import { ExchangeState, ExchangeAction } from './exchangeReducer';

interface ExchangeRateCardContentProps {
  exchangeState: ExchangeState;
  dispatch(value: ExchangeAction): void;
  fetchBalance(): void;
}

export const ExchangeRateCardContent = (props: ExchangeRateCardContentProps) => {
  const {
    exchangeState: {
      isLoading,
      isEditing,
      selected
    },
    dispatch,
    fetchBalance,
  } = props

  const [isSubmitting, setSubmitting] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const [validRate, setValidRate] = useState(true);

  const handleCancelRateEdit = () => {
    setValidRate(true);
    dispatch({ type: 'CANCEL_EDIT' });
  };

  const handleStartRateEdit = () => {
    dispatch({ type: 'START_EDIT' });
  };

  const handleSubmitRateEdit = async () => {
    if (selected) {
      setSubmitting(true);
      const result = await ExchangeApi.updateExchange(selected);
      setSubmitting(false)
      if (result instanceof APIError) {
        enqueueSnackbar(result.message, { variant: 'error' });
      } else {
        dispatch({ type: 'SUBMIT_EDIT' });
        enqueueSnackbar(
          `Exchange rate for ${selected.id} updated successfully`,
          { variant: 'success' },
        );
        fetchBalance();
      }
    }
  };

  const Buttons = useMemo(
    () => {
      if (isLoading) return <></>;
      if (isSubmitting) return <CircularProgress size="26px" sx={{ p: '2px' }}/>
      if (isEditing) {
        return (
          <>
            <IconButton
              size="small"
              color="error"
              onClick={handleCancelRateEdit}
              disabled={isSubmitting}
            >
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
            <IconButton
              size="small"
              color="success"
              onClick={handleSubmitRateEdit}
              disabled={!validRate || isSubmitting}
            >
              <Check sx={{ fontSize: 16 }} />
            </IconButton>
          </>
        )
      }

      return (
        <IconButton size="small" onClick={handleStartRateEdit}>
          <Edit sx={{ fontSize: 16, color: '#3a74e1' }} />
        </IconButton>
      )
    },
    [isLoading, isEditing, selected, isSubmitting, validRate] 
  )

  const RateDisplay = useMemo(
    () => {
      if (isLoading) return <></>;
      if (isEditing) {
        return (
          <NumberInput
            value={selected?.rate || 0}
            onValidChange={(value) => {
              dispatch({ type: 'EDIT_RATE', payload: value });
            }}
            onChangeValidState={(value) => {
              setValidRate(value);
            }}
            sx={{ py: 0 }}
            disabled={isSubmitting}
          />
        )
      }

      return (
        <Typography variant="body1" sx={{ fontWeight: 'bold', py: 2 }}>
          {selected?.rate}
        </Typography>
      )
    },
    [isLoading, isEditing, selected, isSubmitting, dispatch]
  )

  if (isLoading) {
    return <Loader />
  }

  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'end', padding: '4px' }}
      >
        {Buttons}
      </Box>
      <Box sx={{ px: 3 }}>
        {RateDisplay}
      </Box>
    </>
  )
}
