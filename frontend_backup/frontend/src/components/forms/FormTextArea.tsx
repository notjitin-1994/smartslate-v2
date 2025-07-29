import React from 'react';

interface FormTextAreaProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  helperText = '',
  required = false,
  rows = 4,
  placeholder = ''
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-brand-bg border border-brand-card-bg rounded-lg p-3 focus:ring-2 focus:ring-brand-accent focus:outline-none transition-all text-white resize-none"
    />
    {helperText && !error && <p className="text-text-secondary text-xs mt-1">{helperText}</p>}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

export default FormTextArea;
