import useLogin from '@/hooks/useLogin';

const LoginPage = () => {
  const { register, errors, isSubmitting, handleSubmit, onSubmit } = useLogin();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card glass w-128 shadow-lg">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Address */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email Address</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="example@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="label text-red-500">{errors.email.message}</p>
            )}
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input w-full"
              placeholder="Password"
              {...register('password')}
            />
            {errors.password && (
              <p className="label text-red-500 text-wrap">
                {errors.password.message}
              </p>
            )}
          </fieldset>

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
