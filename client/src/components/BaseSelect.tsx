import { SelectHTMLAttributes } from 'react';

type TOption = {
  value: string | number;
  label: string;
};

type TBaseSelect = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  helperText?: string;
  isError?: boolean;
  options: TOption[];
  firstOptionLabel?: string;
};

const BaseSelect = ({
  label,
  helperText,
  isError,
  options,
  className,
  firstOptionLabel,
  ...rest
}: TBaseSelect) => {
  return (
    <fieldset className="fieldset w-full">
      {label && <legend className="fieldset-legend">{label}</legend>}

      <select
        className={`select ${isError ? 'border-red-500' : ''} ${className}`}
        {...rest}
      >
        {firstOptionLabel && (
          <option disabled value="">
            {firstOptionLabel}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {(isError || helperText) && (
        <p className={`label ${isError ? 'text-red-500' : ''}`}>{helperText}</p>
      )}
    </fieldset>
  );
};

export default BaseSelect;
