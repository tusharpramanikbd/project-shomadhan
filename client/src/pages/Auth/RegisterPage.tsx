import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const divisions: TDivision[] = [
  {
    id: '1',
    name: 'Chattagram',
    bn_name: 'চট্টগ্রাম',
  },
  {
    id: '2',
    name: 'Rajshahi',
    bn_name: 'রাজশাহী',
  },
  {
    id: '3',
    name: 'Khulna',
    bn_name: 'খুলনা',
  },
  {
    id: '4',
    name: 'Barisal',
    bn_name: 'বরিশাল',
  },
  {
    id: '5',
    name: 'Sylhet',
    bn_name: 'সিলেট',
  },
  {
    id: '6',
    name: 'Dhaka',
    bn_name: 'ঢাকা',
  },
  {
    id: '7',
    name: 'Rangpur',
    bn_name: 'রংপুর',
  },
  {
    id: '8',
    name: 'Mymensingh',
    bn_name: 'ময়মনসিংহ',
  },
];

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

type TDivision = {
  id: string;
  name: string;
  bn_name: string;
};

type TDistrict = {
  id: string;
  name: string;
  bn_name: string;
};

type TUpazila = {
  id: string;
  name: string;
  bn_name: string;
};

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

  const [districts, setDistricts] = useState<TDistrict[]>([]);
  const [upazilas, setUpazilas] = useState<TUpazila[]>([]);
  const [isDistrictLoading, setDistrictLoading] = useState(false);
  const [isUpazilaLoading, setUpazilaLoading] = useState(false);

  const selectedDivision = watch('division');
  const selectedDistrict = watch('district');

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    const selectedDivisionObj = divisions.find((d) => d.id === data.division);
    const selectedDistrictObj = districts.find((d) => d.id === data.district);
    const selectedUpazilaObj = upazilas.find((u) => u.id === data.upazila);

    const transformedData = {
      ...data,
      division: {
        id: selectedDivisionObj?.id,
        name: selectedDivisionObj?.name,
        bn_name: selectedDivisionObj?.bn_name,
      },
      district: {
        id: selectedDistrictObj?.id,
        name: selectedDistrictObj?.name,
        bn_name: selectedDistrictObj?.bn_name,
      },
      upazila: {
        id: selectedUpazilaObj?.id,
        name: selectedUpazilaObj?.name,
        bn_name: selectedUpazilaObj?.bn_name,
      },
    };

    console.log(transformedData);
  };

  // When division changes → fetch districts
  useEffect(() => {
    if (!selectedDivision) {
      setDistricts([]);
      setUpazilas([]);
      resetField('district');
      resetField('upazila');
      return;
    }

    setDistrictLoading(true);
    setUpazilas([]);
    resetField('district');
    resetField('upazila');

    axios
      .get(`https://bdapis.vercel.app/geo/v2.0/districts/${selectedDivision}`)
      .then((res) => setDistricts(res.data.data))
      .catch(() => setDistricts([]))
      .finally(() => setDistrictLoading(false));
  }, [selectedDivision, resetField]);

  // When district changes → fetch upazilas
  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      resetField('upazila');
      return;
    }

    setUpazilaLoading(true);
    resetField('upazila');

    axios
      .get(`https://bdapis.vercel.app/geo/v2.0/upazilas/${selectedDistrict}`)
      .then((res) => setUpazilas(res.data.data))
      .catch(() => setUpazilas([]))
      .finally(() => setUpazilaLoading(false));
  }, [selectedDistrict, resetField]);

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
              <select
                defaultValue="Select Division"
                className="select"
                {...register('division')}
              >
                <option disabled={true}>Select Division</option>
                {divisions?.map((div) => (
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
                defaultValue="Select District"
                className="select"
                {...register('district')}
                disabled={!districts?.length || isDistrictLoading}
              >
                <option disabled={true}>
                  {isDistrictLoading ? 'Loading...' : 'Select District'}
                </option>
                {districts?.map((dist) => (
                  <option key={dist.id} value={dist.id}>
                    {dist.name}
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
                defaultValue="Select Upazila"
                className="select"
                {...register('upazila')}
                disabled={!upazilas?.length || isUpazilaLoading}
              >
                <option disabled={true}>
                  {isUpazilaLoading ? 'Loading...' : 'Select Upazila'}
                </option>
                {upazilas?.map((upa) => (
                  <option key={upa.id} value={upa.id}>
                    {upa.name}
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
