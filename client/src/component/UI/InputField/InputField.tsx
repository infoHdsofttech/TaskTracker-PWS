import { Info } from "@mui/icons-material";
import {
  Box,
  Input,
  Typography,
  Tooltip,
  InputProps as MUIInputProps,
  InputAdornment,
} from "@mui/material";
import React, { forwardRef } from "react";

type Props = {
  label: string;
  type?: string;
  required?: boolean;
  errorMessage?: string;
  infoText?: string | string[];
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  value?: string; // so we can show the typed text
} & MUIInputProps;

const InputField = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    label,
    type = "text",
    required,
    errorMessage,
    disabled,
    infoText,
    icon,
    value,
    onChange,
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
    <>
    <Box
      sx={{
        // White rounded container
        backgroundColor: "#fff",
        boxShadow: "0px 4px 8px rgba(70, 95, 241, 0.10)",
        borderRadius: 2,
        padding: 2,
        marginBottom: 3,
        width: "100%",
      }}
    >
      {/* Small, subtle label text at the top */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>

        {/* Optional info icon tooltip */}
        {infoText && (
          <Tooltip title={renderInfoText()} arrow placement="top">
            <Info
              sx={{
                cursor: "pointer",
                ml: 1,
                fontSize: 18,
                color: "#666",
                verticalAlign: "middle",
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* Larger text for the user input */}
      <Input
        ref={ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label}`}
        disableUnderline
        disabled={disabled}
        endAdornment={
          icon && <InputAdornment position="end">{icon}</InputAdornment>
        }
        error={Boolean(errorMessage)}
        sx={{
          width: "100%",
          fontSize: "1rem", // Bigger text
          fontWeight: 500,
          color: "#222",
          // Remove MUI’s default underline
          "::before, ::after": { borderBottom: "none !important" },
          ":hover:not(.Mui-disabled):not(.Mui-error)::before": {
            borderBottom: "none !important",
          },
          // Remove spin buttons if type="number"
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
            {
              display: "none",
            },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
        {...inputProps}
      />

   {/* Error message (if any) */}
   {errorMessage && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
          {errorMessage}
        </Typography>
      )} 
    </Box>

       
      </>
  );
  
});

InputField.displayName = "InputField";
export default InputField;
