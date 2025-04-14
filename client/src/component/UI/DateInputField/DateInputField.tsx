"use client";

import React, { forwardRef } from "react";
import { Box, Input, Typography, Tooltip, InputAdornment, InputProps as MUIInputProps } from "@mui/material";
import { Info } from "@mui/icons-material";

type DateInputFieldProps = {
  label: string;
  required?: boolean;
  errorMessage?: string;
  infoText?: string | string[];
  disabledDates?: boolean;  // Pass true to disable the date input
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  name?: string;
  icon?: React.ReactNode;
} & MUIInputProps;

const DateInputField = forwardRef<HTMLInputElement, DateInputFieldProps>((props, ref) => {
  const {
    label,
    required,
    errorMessage,
    infoText,
    disabledDates,
    onChange,
    value,
    name,
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
      sx={{
        backgroundColor: "#fff",
        boxShadow: "0px 4px 8px rgba(70, 95, 241, 0.10)",
        borderRadius: 2,
        padding: 2,
        marginBottom: 3,
        width: "100%",
      }}
    >
      {/* Label Section */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </Typography>
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

      {/* Date Input Field */}
      <Box
        sx={{
          padding: "10px",
          borderRadius: "8px",
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Input
          ref={ref}
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          disableUnderline
          disabled={disabledDates}
          fullWidth
          sx={{
            "&:before, &:after": { display: "none" },
            fontSize: "1rem",
            fontWeight: 500,
            color: "#222",
            width: "100%",
            // Ensure the label shrinks appropriately in date inputs
            "& .MuiInputBase-input": { padding: 0 },
          }}
  
          {...inputProps}
          endAdornment={
            icon && <InputAdornment position="end">{icon}</InputAdornment>
          }
        />
      </Box>

      {/* Error Message */}
      {errorMessage && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: "block" }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});

DateInputField.displayName = "DateInputField";
export default DateInputField;
