import OtpInput from '@/components/OtpInput';
import useOtp from '@/hooks/useOTP';

const OtpPage = () => {
  const { email, otp, isLoading, onSubmit, onOTPChange } = useOtp();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card glass w-128 shadow-lg">
        <div className="flex flex-col w-full gap-2">
          <h3 className="h3-regular text-light-text-primary dark:text-dark-text-primary">
            Check your inbox
          </h3>
          <h6 className="h6-regular text-light-text-secondary dark:text-dark-text-secondary">
            A verification code has been sent to{' '}
            <span className="h6-regular text-light-text-primary dark:text-dark-text-primary">
              {email}
            </span>
            , please insert the code here.
          </h6>
        </div>

        <OtpInput onChange={onOTPChange} disabled={isLoading} />

        <div className="card-body">
          <div className="flex justify-between items-center gap-4"></div>
          <div className="mt-6">
            <button
              onClick={() => onSubmit({ email, otp })}
              disabled={isLoading}
              className="btn btn-primary btn-block"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
