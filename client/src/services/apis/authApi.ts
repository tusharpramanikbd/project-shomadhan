import { ISignUpUserReq } from '@/types/authTypes';
import { axiosClient } from '../clients/axiosClient';
import { useMutation } from '@tanstack/react-query';

interface ITokenRes {
  status: boolean;
  message: string;
  token: string;
  data: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    division: string | null;
    district: string | null;
    upazila: string | null;
    isVerified: boolean;
  };
}

interface IVerifyOTPReq {
  email: string;
  otp: string;
}

type RegisterUserResponse = {
  status: boolean;
  message: string;
  data: {
    email: string;
  };
};

const registerUser = async (
  signUpPayload: ISignUpUserReq
): Promise<RegisterUserResponse> => {
  const response = await axiosClient.post(`/auth/register`, signUpPayload);
  return response.data;
};

const verifyOTP = async ({ email, otp }: IVerifyOTPReq): Promise<ITokenRes> => {
  const response = await axiosClient.post(`/auth/otp/verify`, {
    email,
    otp,
  });
  return response.data;
};

export const useRegisterUserApi = () => {
  return useMutation({
    mutationFn: registerUser,
    mutationKey: ['registerUser'],
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
    mutationKey: ['verifyOTP'],
  });
};
