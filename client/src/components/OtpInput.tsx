import { useRef, useState } from 'react';

const OTP_LENGTH = 6;

interface OTPInputProps {
  onChange: (otp: string) => void;
  disabled: boolean;
}

const OtpInput = ({ onChange, disabled }: OTPInputProps) => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/\D/g, '');

    const inputEvent = e.nativeEvent as InputEvent;
    const isPasted = inputEvent.inputType?.startsWith('insertFromPaste');
    const cursorPosition = e.target.selectionStart || 0;

    // Handling pase event
    if (isPasted) {
      const newOtp = [...otp];
      const isCurrentCellEmpty = !newOtp[index];

      const pasteVal = isCurrentCellEmpty
        ? value
        : cursorPosition < value.length
          ? value.substring(0, value.length - 1)
          : value.substring(1, value.length);

      const digits = pasteVal.split('');

      // Filling the OTP array with the pasted digits
      for (let i = 0; i < digits.length && index + i < OTP_LENGTH; i++) {
        newOtp[index + i] = digits[i].substring(0, 1);
      }

      setOtp(newOtp);
      onChange(newOtp.join(''));

      // Moving focus to the next input after pasting
      if (index + digits.length < OTP_LENGTH) {
        inputRefs.current[index + digits.length]?.focus();
      } else {
        inputRefs.current[OTP_LENGTH - 1]?.focus(); // Focus last input if pasted length exceeds
      }
      return;
    }

    // Handling input one char
    const isInputBefore = value.length > 1 && cursorPosition === 1;
    const newVal = isInputBefore
      ? value.substring(value.length - 2, value.length - 1)
      : value.substring(value.length - 1);

    if (isNaN(Number(newVal))) return;

    const newOtp = [...otp];
    newOtp[index] = newVal;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Moveing focus to the next input if a number is entered
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-1 justify-between max-w-87">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="flex rounded-sm text-center border shadow-xs field-input w-10 h-10 "
          value={value}
          ref={(el) => {
            inputRefs.current[index] = el!;
          }}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  );
};

export default OtpInput;
