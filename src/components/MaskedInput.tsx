
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: 'cpf' | 'phone' | 'none';
  formatter?: (value: string) => string;
  validator?: (value: string) => boolean;
  onValueChange?: (value: string, isValid: boolean) => void;
  errorMessage?: string;
}

export default function MaskedInput({
  mask = 'none',
  formatter,
  validator,
  onValueChange,
  errorMessage,
  ...props
}: MaskedInputProps) {
  const [value, setValue] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasBlurred, setHasBlurred] = useState<boolean>(false);

  // Default formatters
  const formatCPF = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const getFormatter = () => {
    if (formatter) return formatter;
    if (mask === 'cpf') return formatCPF;
    if (mask === 'phone') return formatPhone;
    return (val: string) => val;
  };

  // Default validators
  const validateCPF = (input: string) => {
    const digits = input.replace(/\D/g, '');
    return digits.length === 11;
  };

  const validatePhone = (input: string) => {
    const digits = input.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  };

  const getValidator = () => {
    if (validator) return validator;
    if (mask === 'cpf') return validateCPF;
    if (mask === 'phone') return validatePhone;
    return () => true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = getFormatter()(rawValue);
    const isValueValid = getValidator()(formattedValue);
    
    setValue(formattedValue);
    setIsValid(isValueValid);

    if (onValueChange) {
      onValueChange(formattedValue, isValueValid);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setHasBlurred(true);
  };

  return (
    <div className="space-y-2">
      <Input 
        {...props} 
        value={value} 
        onChange={handleChange} 
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`${!isValid && hasBlurred ? 'border-red-500 focus:ring-red-200' : ''}`}
      />
      {!isValid && hasBlurred && errorMessage && (
        <p className="text-red-500 text-sm" id={props.id ? `${props.id}-error` : undefined}>
          {errorMessage}
        </p>
      )}
    </div>
  );
}
