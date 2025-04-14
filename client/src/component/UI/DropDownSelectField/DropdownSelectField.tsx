// src/component/UI/DropDownSelectField/DropdownSelectField.tsx
"use client";

import React, { forwardRef } from "react";
import { Info } from "@mui/icons-material";
import {
  Box,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  SelectProps,
} from "@mui/material";

type Option = {
  value: string | number;
  label: string;
};

type Props = {
  label: string;
  required?: boolean;
  errorMessage?: string;
  infoText?: string | string[];
  disabled?: boolean;
  icon?: React.ReactNode;
  options: Option[];
} & SelectProps;

const DropDownSelectField = forwardRef<HTMLDivElement, Props>((props, ref) => {
  // Destructure value and onChange explicitly so they can be passed to the Select component.
  const {
    label,
    required,
    errorMessage,
    infoText,
    disabled,
    icon,
    options,
    value,
    onChange,
    ...selectProps
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

      {/* Select Field Section */}
      <Box
        sx={{
          padding: "10px",
          borderRadius: "8px",
          bgcolor: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Select
          ref={ref}
          disabled={disabled}
          value={value}            // Pass the controlled value
          onChange={onChange}      // Pass the controlled onChange
          {...selectProps}
          fullWidth
          variant="standard"
          sx={{
            "&:before, &:after": { display: "none" },
            fontSize: "1.125rem",
            color: "#222",
            width: "100%",
          }}
          IconComponent={icon ? () => icon : undefined}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Error Message */}
      {errorMessage && (
        <Typography color="error" variant="body2" sx={{ marginTop: "8px" }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
});

DropDownSelectField.displayName = "DropDownSelectField";
export default DropDownSelectField;
