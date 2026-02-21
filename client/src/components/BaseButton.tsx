import { ButtonHTMLAttributes } from 'react';

type TBaseButton = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  isDisabled?: boolean;
  isLoading?: boolean;
};

const BaseButton = ({ label, isDisabled, isLoading, ...rest }: TBaseButton) => {
  return (
    <button
      disabled={isDisabled}
      className="btn btn-primary btn-block"
      {...rest}
    >
      {isLoading ? <span className="loading loading-spinner"></span> : null}
      {label}
    </button>
  );
};

export default BaseButton;
