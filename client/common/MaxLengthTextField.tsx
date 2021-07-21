import { InputAdornment, TextField, TextFieldProps } from '@material-ui/core';
import React, { useState } from 'react';

type PropTypes = { readonly maxLength: number } & TextFieldProps;

export const MaxLengthTextField = React.forwardRef<HTMLDivElement, PropTypes>(function MaxLengthTextField(
  props: PropTypes,
  ref,
) {
  const { maxLength, onChange } = props;
  const [suffix, updateSuffix] = useState(`0 / ${maxLength}`);
  const [error, updateError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const curLength = event.target.value.length;
    updateSuffix(`${curLength} / ${maxLength}`);
    updateError(curLength > maxLength);
    onChange && onChange(event);
  };

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
