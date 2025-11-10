import useGeoLocation from '@/hooks/useGeoLocation';
import { useRegisterUser } from '@/services/apis/authApi';
import { ISignUpUserReq } from '@/types/authTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const passwordRegex = new RegExp(
  '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
);

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .object({
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long.')
        .regex(
          passwordRegex,
          'Password must contain at least one uppercase, one lowercase, one number, and one special character.'
        ),
      confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
  division: z.string().min(1, 'Division is required'),
  district: z.string().min(1, 'District is required'),
  upazila: z.string().min(1, 'Upazila is required'),
  address: z.string().min(1, 'Address is required'),
});

type FormFields = z.infer<typeof schema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: { password: '', confirmPassword: '' },
      division: '',
      district: '',
      upazila: '',
      address: '',
    },
    resolver: zodResolver(schema),
  });

  const {
    divisions,
    districts,
    upazilas,
    isDistrictLoading,
    isUpazilaLoading,
  } = useGeoLocation({
    watch,
    resetField,
  });

  const { mutate: registerUser, isPending: isRegisterPending } =
    useRegisterUser();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const selectedDivisionObj = divisions.find(
      (div) => div.id === data.division
    );
    const selectedDistrictObj = districts?.find(
      (dis) => dis.id === data.district
    );
    const selectedUpazilaObj = upazilas?.find((upa) => upa.id === data.upazila);

    const transformedData: ISignUpUserReq = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      password: data.password.password,
      address: data.address,
      division: {
        id: selectedDivisionObj?.id,
        name: selectedDivisionObj?.name,
        bnName: selectedDivisionObj?.bn_name,
      },
      district: {
        id: selectedDistrictObj?.id,
        name: selectedDistrictObj?.name,
        bnName: selectedDistrictObj?.bn_name,
      },
      upazila: {
        id: selectedUpazilaObj?.id,
        name: selectedUpazilaObj?.name,
        bnName: selectedUpazilaObj?.bn_name,
      },
    };

    console.log(transformedData);

    registerUser(transformedData, {
      onSuccess: async (response) => {
        console.log('Registration Successfull', response);
      },
      onError: (err) => {
        console.error('Registration error:', err);
      },
    });
  };

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
              disabled={isSubmitting || isRegisterPending}
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
