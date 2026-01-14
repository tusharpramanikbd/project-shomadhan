import BaseInput from '@/components/BaseInput';
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
            <BaseInput
              label="First Name"
              type="text"
              placeholder="John"
              isError={!!errors.firstName}
              helperText={
                errors.firstName ? errors.firstName.message : undefined
              }
              disabled={isSubmitting}
              {...register('firstName')}
            />

            {/* Last Name */}
            <BaseInput
              label="Last Name"
              type="text"
              placeholder="Doe"
              isError={!!errors.lastName}
              helperText={errors.lastName ? errors.lastName.message : undefined}
              disabled={isSubmitting}
              {...register('lastName')}
            />
          </div>

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
            isError={!!errors.password?.password}
            helperText={
              errors.password?.password
                ? errors.password.password.message
                : undefined
            }
            disabled={isSubmitting}
            {...register('password.password')}
          />

          {/* Confirm Password */}
          <BaseInput
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            isError={!!errors.password?.confirmPassword}
            helperText={
              errors.password?.confirmPassword
                ? errors.password.confirmPassword.message
                : undefined
            }
            disabled={isSubmitting}
            {...register('password.confirmPassword')}
          />

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
          <BaseInput
            label="Address"
            type="text"
            placeholder="Address"
            isError={!!errors.address}
            helperText={errors.address ? errors.address.message : undefined}
            disabled={isSubmitting}
            {...register('address')}
          />

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
