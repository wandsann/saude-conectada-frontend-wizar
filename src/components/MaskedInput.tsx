import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface MaskedInputProps {
  mask: 'cpf' | 'phone';
  value?: string;
  onValueChange: (value: string, isValid: boolean) => void;
  validator?: (value: string) => boolean;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
}

export default function MaskedInput({
  mask,
  value: externalValue,
  onValueChange,
  validator,
  errorMessage,
  placeholder,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: MaskedInputProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (externalValue !== undefined) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const applyMask = (text: string): string => {
    const digits = text.replace(/\D/g, '');

    switch (mask) {
      case 'cpf':
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
        if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
        return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;

      case 'phone':
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;

      default:
        return text;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = applyMask(e.target.value);
    setValue(newValue);

    if (validator) {
      const isValid = validator(newValue);
      setError(isValid ? '' : errorMessage || 'Valor inválido');
      onValueChange(newValue, isValid);
    } else {
      onValueChange(newValue, true);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          error ? 'border-red-500 focus-visible:ring-red-500' : '',
          className
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || !!error}
        {...props}
      />
      {error && (
        <p
          className="text-red-500 text-sm mt-1"
          id={ariaDescribedBy}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
