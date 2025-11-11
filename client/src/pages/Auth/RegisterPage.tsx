import useRegister from '@/hooks/useRegister';

const RegisterPage = () => {
  const {
    handleSubmit,
    onSubmit,
    register,
    divisions,
    districts,
    upazilas,
    errors,
    isDistrictLoading,
    isUpazilaLoading,
    isSubmitting,
  } = useRegister();

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="card glass w-128 shadow-lg">
        <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center gap-4">
            {/* First Name */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">First Name</legend>
              <input
                type="text"
                className="input"
                placeholder="John"
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="label text-red-500">{errors.firstName.message}</p>
              )}
            </fieldset>

            {/* Last Name */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Last Name</legend>
              <input
                type="text"
                className="input"
                placeholder="Doe"
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className="label text-red-500">{errors.lastName.message}</p>
              )}
            </fieldset>
          </div>

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
              {...register('password.password')}
            />
            {errors.password?.password && (
              <p className="label text-red-500 text-wrap">
                {errors.password?.password.message}
              </p>
            )}
          </fieldset>

          {/* Confirm Password */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Confirm Password</legend>
            <input
              type="password"
              className="input w-full"
              placeholder="Confirm Password"
              {...register('password.confirmPassword')}
            />
            {errors.password?.confirmPassword && (
              <p className="label text-red-500">
                {errors.password?.confirmPassword.message}
              </p>
            )}
          </fieldset>

          <div className="flex justify-between items-center gap-2">
            {/* Division */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Division</legend>
              <select className="select" {...register('division')}>
                <option disabled value="">
                  Select Division
                </option>
                {divisions.map((div) => (
                  <option key={div.id} value={div.id}>
                    {div.name}
                  </option>
                ))}
              </select>
              {errors.division && (
                <p className="label text-red-500">{errors.division.message}</p>
              )}
            </fieldset>

            {/* District */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">District</legend>
              <select
                className="select"
                {...register('district')}
                disabled={!districts?.length || isDistrictLoading}
              >
                <option disabled value="">
                  {isDistrictLoading ? 'Loading...' : 'Select District'}
                </option>
                {districts?.map((dist) => (
                  <option key={dist?.id} value={dist?.id}>
                    {dist?.name}
                  </option>
                ))}
              </select>
              {errors.district && (
                <p className="label text-red-500">{errors.district.message}</p>
              )}
            </fieldset>

            {/* Upazila */}
            <fieldset className="fieldset w-full">
              <legend className="fieldset-legend">Upazila</legend>
              <select
                className="select"
                {...register('upazila')}
                disabled={!upazilas?.length || isUpazilaLoading}
              >
                <option disabled value="">
                  {isUpazilaLoading ? 'Loading...' : 'Select Upazila'}
                </option>
                {upazilas?.map((upa) => (
                  <option key={upa?.id} value={upa?.id}>
                    {upa?.name}
                  </option>
                ))}
              </select>
              {errors.upazila && (
                <p className="label text-red-500">{errors.upazila.message}</p>
              )}
            </fieldset>
          </div>

          {/* Address */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Address</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Address"
              {...register('address')}
            />
            {errors.address && (
              <p className="label text-red-500">{errors.address.message}</p>
            )}
          </fieldset>

          <div className="mt-6">
            <button
              disabled={isSubmitting}
              className="btn btn-primary btn-block"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
