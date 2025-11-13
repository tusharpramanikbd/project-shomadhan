import { useVerifyOTP } from '@/services/apis/authApi';

type TOnSubmit = {
  email: string;
  otp: string;
};

const useAuthOtp = () => {
  const { mutate: verifyOTP, isPending } = useVerifyOTP();

  const onSubmit = ({ email, otp }: TOnSubmit) => {
    verifyOTP(
      { email, otp },
      {
        onSuccess: (response: any) => {
          const token = response.token;
          console.log('Token', token);

          // const { confirmed } = parseJWTV2(token);
          // if (confirmed === undefined) {
          //   showToast({
          //     type: 'Error',
          //     title: ErrorMessages.SOMETHING_WENT_WRONG,
          //     message: ErrorMessages.TRY_AGAIN,
          //   });
          //   return;
          // }

          // setAuthLocalStorage(token);
          // setUserDataInLocalStorage(response.user.Doctor);
          // updateAuthStore(token, confirmed); // TODO: Remove this confirmed, once the backend is fixed
          // removeCountdownFromLS();

          // navigate(routes.MAIN.PATIENTS.ROOT);
        },
        onError: (error: any) => {
          console.log('Error Otp Submit', error);

          // const { name = '', message = '' } = error;
          // const errorData = error.response?.data;
          // const errorDataMsg = errorData?.message ?? '';
          // if (
          //   name === Exceptions.INVALID_CODE ||
          //   errorDataMsg === 'Invalid confirmation code'
          // ) {
          //   handleError(ErrorMessages.OTP_ERROR_INVALID);
          // } else if (name === Exceptions.EXPIRED_CODE) {
          //   handleError(ErrorMessages.OTP_ERROR_EXPIRED);
          // } else {
          //   handleError(message ?? errorDataMsg);
          // }
        },
      }
    );
  };

  return {
    onSubmit,
    isLoading: isPending,
  };
};

export default useAuthOtp;
