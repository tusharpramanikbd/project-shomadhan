import {
  toastError,
  toastInfo,
  toastSuccess,
} from '@/components/Toast/CustomToast';
import { ILoginReq, useLoginUserApi } from '@/services/apis/authApi';
import { useAuthStore } from '@/stores/auth.store';
import { parseJWT } from '@/utils/jwt.utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long.'),
});

type FormFields = z.infer<typeof schema>;

const useLogin = () => {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const { mutate: loginUser, isPending: isLoginPending } = useLoginUserApi();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const transformedData: ILoginReq = {
      email: data.email.toLowerCase(),
      password: data.password,
    };

    loginUser(transformedData, {
      onSuccess: async (response) => {
        reset();

        const { token, data: user, message } = response || {};

        const { isVerified } = parseJWT(token);
        if (!isVerified) {
          console.error('Something went wrong on parsing jwt');
          toastError('Something went wrong. Please try again.');
          return;
        }

        console.log('Login successful:', response);

        toastSuccess(message);
        setToken(token);
        setUser(user);

        navigate('/feed', { state: { email: user.email } });
      },
      onError: (err) => {
        if (err?.message && err?.message.includes('OTP')) {
          toastInfo(err?.message);
          navigate('/otp', { state: { email: data.email } });
          return;
        }
        toastError(err?.message || 'Login failed. Please try again.');
      },
    });
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isSubmitting || isLoginPending,
  };
};

export default useLogin;
