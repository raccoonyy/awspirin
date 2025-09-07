import React, { useState, useMemo } from 'react';
import { ARNItem } from '../types';
import { validateARNFormat, generateARNSuggestions } from '../utils/arn';

export interface ARNInputProps {
  value?: string;
  onChange: (arn: string) => void;
  onSelect?: (arn: string) => void;
  service: string;
  arnList?: ARNItem[];
  mode?: 'input' | 'dropdown' | 'both' | 'auto';
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ARNInput({
  value = '',
  onChange,
  onSelect,
  service,
  arnList = [],
  mode = 'auto',
  placeholder,
  className = '',
  disabled = false,
}: ARNInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredARNs = useMemo(() => arnList
    .filter((item) => item.service === service)
    .filter((item) => searchTerm === ''
        || item.arn.toLowerCase().includes(searchTerm.toLowerCase())
        || item.displayName?.toLowerCase().includes(searchTerm.toLowerCase())), [arnList, service, searchTerm]);

  const actualMode = useMemo(() => {
    if (mode === 'auto') {
      return filteredARNs.length > 0 ? 'dropdown' : 'input';
    }
    return mode;
  }, [mode, filteredARNs.length]);

  const showInput = actualMode === 'input' || actualMode === 'both';
  const showDropdown = (actualMode === 'dropdown' || actualMode === 'both') && filteredARNs.length > 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (showDropdown) {
      setSearchTerm(newValue);
      setIsOpen(true);
    }
  };

  const handleSelectARN = (arn: string) => {
    onChange(arn);
    onSelect?.(arn);
    setIsOpen(false);
    setSearchTerm('');
  };

  const isValidARN = value ? validateARNFormat(value) : true;
  const suggestions = useMemo(() => generateARNSuggestions(service), [service]);

  return (
    <div className={`arn-input ${className}`}>
      {showInput && (
        <div className="input-wrapper">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => showDropdown && setIsOpen(true)}
            placeholder={placeholder || `arn:aws:${service}:region:account:resource`}
            disabled={disabled}
            className={`arn-text-input ${!isValidARN ? 'invalid' : ''}`}
            aria-label="AWS ARN input"
          />
          {!isValidARN && (
            <div className="error-message">
              Invalid ARN format
            </div>
          )}
          {!value && suggestions.length > 0 && (
            <div className="suggestions">
              <small>Examples:</small>
              {suggestions.slice(0, 2).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="suggestion-item"
                  onClick={() => handleSelectARN(suggestion)}
                  disabled={disabled}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showDropdown && (
        <div className="dropdown-wrapper">
          {actualMode === 'dropdown' && (
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search ARNs..."
              disabled={disabled}
              className="arn-search-input"
              aria-label="Search ARNs"
            />
          )}

          {isOpen && filteredARNs.length > 0 && (
            <div className="arn-dropdown">
              {filteredARNs.map((item) => (
                <button
                  key={item.arn}
                  type="button"
                  className={`arn-option ${value === item.arn ? 'selected' : ''}`}
                  onClick={() => handleSelectARN(item.arn)}
                  disabled={disabled}
                >
                  <div className="arn-option-main">
                    <span className="arn-text">{item.arn}</span>
                    {item.displayName && (
                      <span className="arn-display-name">{item.displayName}</span>
                    )}
                  </div>
                  {item.description && (
                    <div className="arn-description">{item.description}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {isOpen && filteredARNs.length === 0 && searchTerm && (
            <div className="no-results">
              No ARNs found for "
              {searchTerm}
              "
            </div>
          )}
        </div>
      )}

      {showDropdown && isOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
