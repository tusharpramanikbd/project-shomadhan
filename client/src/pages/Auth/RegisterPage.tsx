import BaseButton from '@/components/BaseButton';
import BaseInput from '@/components/BaseInput';
import BaseSelect from '@/components/BaseSelect';
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
            <BaseSelect
              label="Division"
              options={divisions?.map((div) => ({
                value: div.id,
                label: div.name,
              }))}
              isError={!!errors.division}
              helperText={
                errors.division ? errors.division?.message : undefined
              }
              firstOptionLabel="Select Division"
              {...register('division')}
            />

            {/* District */}
            <BaseSelect
              label="District"
              options={districts?.map((dist) => ({
                value: dist.id,
                label: dist.name,
              }))}
              isError={!!errors.district}
              helperText={
                errors.district ? errors.district?.message : undefined
              }
              firstOptionLabel={
                isDistrictLoading ? 'Loading...' : 'Select District'
              }
              {...register('district')}
            />

            {/* Upazila */}
            <BaseSelect
              label="Upazila"
              options={upazilas?.map((upa) => ({
                value: upa.id,
                label: upa.name,
              }))}
              isError={!!errors.upazila}
              helperText={errors.upazila ? errors.upazila?.message : undefined}
              firstOptionLabel={
                isUpazilaLoading ? 'Loading...' : 'Select Upazila'
              }
              {...register('upazila')}
            />
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
            <BaseButton
              label="Register"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
