import React from 'react';

interface FormInputProps {
  /** Unique ID for the input */
  /** Unique ID for the input */
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  id, 
  name, 
  label, 
  type = "text", 
  value, 
  placeholder, 
  helperText = '',
  onChange, 
  error, 
  required = false 
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <input 
      type={type} 
      id={id} 
      name={name} 
      value={value || ''}
      placeholder={placeholder ?? label} 
      onChange={onChange} 
      required={required}
      className="w-full bg-brand-bg border border-brand-card-bg rounded-lg p-3 focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all text-white placeholder:text-text-secondary" 
    />
    {helperText && !error && <p className="text-text-secondary text-xs mt-1">{helperText}</p>}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);