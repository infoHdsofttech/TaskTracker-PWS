import { Info } from '@mui/icons-material';
import {
  Box,
  Input,
  Typography,
  Tooltip,
  InputProps as MUIInputProps,
  InputAdornment,
} from '@mui/material';
import React, { forwardRef } from 'react';

type Props = {
  label: string;
  type?: string;
  required?: boolean;
  errorMessage?: string;
  classes?: string;
  infoText?: string | string[];
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
} & MUIInputProps;

const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    label,
    type = 'text',
    required,
    classes,
    errorMessage,
    disabled,
    infoText,
    icon,
    ...inputProps
  } = props;

  const renderInfoText = () => {
    if (Array.isArray(infoText)) {
      return infoText.map((text, index) => (
        <Typography key={index} variant="body2">
          {text}
        </Typography>
      ));
    }
    return <Typography variant="body2">{infoText}</Typography>;
  };

  return (
    <Box
      className={`flex flex-col ${classes}`}
      sx={{
        marginBottom: '27px',
        width: '100%',
        '@media (max-width: 640px)': {
          marginBottom: '10px',
        },

      }}
    >
      {/* LABEL SECTION */}
      <label>
        <Typography
          variant="subtitle2"
          fontWeight={600}
          sx={{ color: '#222' }} // or #555, depending on your preference
        >
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
          {infoText && (
            <Tooltip title={renderInfoText()} arrow placement="top">
              <Info
                sx={{
                  cursor: 'pointer',
                  marginLeft: '8px',
                  verticalAlign: 'middle',
                //   color: lightColors.main,
                }}
              />
            </Tooltip>
          )}
        </Typography>
      </label>

      {/* TEXT INPUT FIELD */}
      <Input
        type={type}
        placeholder={`Enter ${label}`}
        inputRef={ref}
        error={Boolean(errorMessage)}
        disabled={disabled}
        endAdornment={
          icon && <InputAdornment position="end">{icon}</InputAdornment>
        }
        sx={{
          marginTop: '8px',
          padding: '10px',
          borderRadius: '8px',
        //   border: '1px solid rgba(70,95,241,0.40)',
          bgcolor: 'white',
          boxShadow: '0px 4px 8px 0px rgba(70, 95, 241, 0.10)',
          fontSize: '1.125rem', // Larger text size
          '::before, ::after': {
            borderBottom: 'none !important', // remove default MUI underline
          },
          ':hover:not(.Mui-disabled):not(.Mui-error)::before': {
            borderBottom: 'none !important',
          },
          // Remove spin buttons if type="number"
          '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
            {
              display: 'none',
            },
          '& input[type=number]': {
            MozAppearance: 'textfield',
          },
        //   '@media (max-width: 414px)': {
        //     width: '100%',
        //   },
        width: '100%',
        }}
        {...inputProps}
      />

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ marginTop: '8px' }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});

InputField.displayName = 'InputField';

export default InputField;
