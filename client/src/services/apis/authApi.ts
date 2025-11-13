import { ISignUpUserReq } from '@/types/authTypes';
import { axiosClient } from '../clients/axiosClient';
import { useMutation } from '@tanstack/react-query';

interface ITokenRes {
  token: string;
}

interface IVerifyOTPReq {
  email: string;
  otp: string;
}

const registerUser = async (
  signUpPayload: ISignUpUserReq
): Promise<unknown> => {
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
