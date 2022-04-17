import { useEffect, useState, useMemo } from 'react';
import { TextField, TextFieldProps } from '@mui/material';

type NumberInputProps = Omit<TextFieldProps, 'value'> & {
  value: number;
  onChangeValidState: (value: boolean) => void;
  onValidChange: (value: number) => void;
}

export const NumberInput = ({
  value,
  onValidChange,
  onChangeValidState,
  sx,
  ...props
}: NumberInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const [isValid, setValid] = useState(value.toString() === inputValue);

  useEffect(() => {
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      onValidChange(num);
    }
    onChangeValidState(inputValue === num.toString());
    setValid(inputValue === num.toString());
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
        ...sx,
      }}
      {...props}
    />
  );
};
