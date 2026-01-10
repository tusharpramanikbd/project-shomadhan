import { InputHTMLAttributes } from 'react';

type TBaseInput = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
  isError?: boolean;
};

const BaseInput = ({
  label,
  type,
  placeholder,
  disabled,
  helperText,
  isError,
  ...props
}: TBaseInput) => {
  return (
    <fieldset className="fieldset">
      {label && <legend className="fieldset-legend">{label}</legend>}
      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`input w-full ${isError && 'border-red-500'}`}
        {...props}
      />
      {helperText && (
        <p className={`label ${isError && 'text-red-500'}`}>{helperText}</p>
      )}
    </fieldset>
  );
};

export default BaseInput;
