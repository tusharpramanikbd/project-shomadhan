import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import useGeoLocation from './useGeoLocation';
import { useRegisterUserApi } from '@/services/apis/authApi';
import { ISignUpUserReq } from '@/types/authTypes';

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

const useRegister = () => {
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
    useRegisterUserApi();

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

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    isSubmitting: isSubmitting || isRegisterPending,
    divisions,
    districts,
    upazilas,
    isDistrictLoading,
    isUpazilaLoading,
  };
};

export default useRegister;
