// src/components/ButtonInput.tsx
import { Button, Typography } from '@mui/material';
import React from 'react';
import { ClipLoader } from 'react-spinners';

type Props = {
  text: string;
  active?: boolean; // Determines active/inactive style
  // Colors for active state:
  buttonActiveBackgroundColor?: string;
  buttonActiveFontColor?: string;
  // Colors for inactive state:
  buttonInactiveBackgroundColor?: string;
  buttonInactiveFontColor?: string;
  disabled?: boolean;
  type: 'button' | 'submit' | 'reset';
  styles?: object;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  fontSize?: number;
  fontWeight?: number;
  loading?: boolean;
  borderColor?: string;
  icon?: React.ReactNode;
};

const ButtonInput = (props: Props) => {
  // Destructure props with some default values.
  const {
    text,
    active,
    buttonActiveBackgroundColor = 'rgb(95,51,225)', // default active blue
    buttonActiveFontColor = '#fff',
    buttonInactiveBackgroundColor = '#ede8ff', // light gray
    buttonInactiveFontColor = '#7752e6',
    disabled,
    type,
    styles,
    onClick,
    fontSize,
    fontWeight = 700,
    loading,
    borderColor,
    icon,
  } = props;

  // Choose colors based on active flag.
  const backgroundColor = active ? buttonActiveBackgroundColor : buttonInactiveBackgroundColor;
  const fontColor = active ? buttonActiveFontColor : buttonInactiveFontColor;

  return (
    <Button
      sx={{
        backgroundColor: backgroundColor,
        color: fontColor,
        width: '100%',
        border: borderColor ? `2px solid ${borderColor}` : 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer!important',
        '@media(max-width:768px)': {
          padding: '5px 10px',
        },
        ':hover': {
          backgroundColor: active ? buttonActiveBackgroundColor : buttonInactiveBackgroundColor,
        },
        textTransform: 'unset',
        ...styles,
      }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      startIcon={icon}
    >
      {!loading ? (
        <Typography
          variant="body1"
          fontWeight={fontWeight}
          fontSize={fontSize}
        >
          {text}
        </Typography>
      ) : (
        <ClipLoader
          color={fontColor}
          loading={loading}
          size={25}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      )}
    </Button>
  );
};

export default ButtonInput;
