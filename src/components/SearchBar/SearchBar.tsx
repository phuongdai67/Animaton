"use client";

import React, { useState, useCallback } from "react";
import { TextField, InputAdornment, IconButton, Box } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import "./SearchBar.css";

// Props interface
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChange?: (query: string) => void;
  value?: string;
  className?: string;
  variant?: "outlined" | "filled" | "standard";
  disabled?: boolean;
  fullWidth?: boolean;
  showClearButton?: boolean;
  autoFocus?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Tìm kiếm...",
  onSearch,
  onChange,
  value: controlledValue,
  className,
  variant = "outlined",
  disabled = false,
  fullWidth = true,
  showClearButton = true,
  autoFocus = false,
}) => {
  const [internalValue, setInternalValue] = useState("");

  // Use controlled or uncontrolled value
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;

      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }

      onChange?.(newValue);
    },
    [controlledValue, onChange]
  );

  const handleSearch = useCallback(() => {
    onSearch?.(value);
  }, [onSearch, value]);

  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue("");
    }
    onChange?.("");
  }, [controlledValue, onChange]);

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  return (
    <Box className={`search-bar-container ${className || ""}`}>
      <TextField
        variant={variant}
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        disabled={disabled}
        fullWidth={fullWidth}
        autoFocus={autoFocus}
        className={`search-bar-input ${
          variant === "filled" ? "search-bar-filled" : ""
        }`}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton
                onClick={handleSearch}
                edge="start"
                disabled={disabled}
                className="search-icon-button"
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: showClearButton && value && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                disabled={disabled}
                className="clear-icon-button"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
