import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

type PropTypes = { readonly value?: string; readonly maxLength: number } & TextFieldProps;

export const MaxLengthTextField = React.forwardRef<HTMLDivElement, PropTypes>(function MaxLengthTextField(
  props: PropTypes,
  ref,
) {
  const { value, maxLength, onChange } = props;
  const [suffix, updateSuffix] = useState('');
  const [error, updateError] = useState(false);

  const calcurateSuffix = (length = 0) => {
    updateSuffix(`${length} / ${maxLength}`);
    updateError(length > maxLength);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    calcurateSuffix(event.target.value.length);
    onChange && onChange(event);
  };

  useEffect(() => {
    calcurateSuffix(value?.length);
  }, [value]);

  return (
    <TextField
      {...props}
      onChange={handleChange}
      ref={ref}
      InputProps={{ endAdornment: <InputAdornment position="end">{suffix}</InputAdornment> }}
      error={error}
    />
  );
});
