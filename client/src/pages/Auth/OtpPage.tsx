import BaseButton from '@/components/BaseButton';
import OtpInput from '@/components/OtpInput';
import useCountDownTimer from '@/hooks/useCountDownTimer';
import useOtp from '@/hooks/useOTP';

const OtpPage = () => {
  const { email, otp, isLoading, handleSubmit, handleResend, onOTPChange } =
    useOtp();
  const { remaining, isCooldownActive } = useCountDownTimer();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card glass w-128 shadow-lg p-8">
        <div className="flex flex-col w-full gap-2">
          <h3 className="text-3xl">Check Your Inbox</h3>
          <h6 className="text-lg">
            A verification code has been sent to{' '}
            <span className="text-lg text-blue-400">{email}</span>, please
            insert the code here.
          </h6>
        </div>
        <div className="flex items-center justify-center mt-6">
          <OtpInput onChange={onOTPChange} disabled={isLoading} />
        </div>
        <div className="flex items-center justify-end mt-4">
          {isCooldownActive ? (
            <span className="text-gray-500 mr-4">
              Resend available in {remaining}s
            </span>
          ) : null}
          <button
            onClick={() => handleResend(email)}
            disabled={isLoading || isCooldownActive}
            className="btn btn-link"
          >
            Resend OTP
          </button>
        </div>

        <div className="mt-8">
          <BaseButton
            label="Submit"
            isDisabled={isLoading}
            isLoading={isLoading}
            onClick={() => handleSubmit({ email, otp })}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
