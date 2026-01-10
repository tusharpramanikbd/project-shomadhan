import BaseInput from '@/components/BaseInput';
import useLogin from '@/hooks/useLogin';

const LoginPage = () => {
  const { register, errors, isSubmitting, handleSubmit, onSubmit } = useLogin();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card glass w-128 shadow-lg">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Address */}
          <BaseInput
            label="Email Address"
            type="text"
            placeholder="example@email.com"
            isError={!!errors.email}
            helperText={errors.email ? errors.email.message : undefined}
            disabled={isSubmitting}
            {...register('email')}
          />

          {/* Password */}
          <BaseInput
            label="Password"
            type="password"
            placeholder="Password"
            isError={!!errors.password}
            helperText={errors.password ? errors.password.message : undefined}
            disabled={isSubmitting}
            {...register('password')}
          />

          <div className="mt-6">
            <button
              disabled={isSubmitting}
              className="btn btn-primary btn-block"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
