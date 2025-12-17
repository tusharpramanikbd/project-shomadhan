import { ISignUpUserReq } from '@/types/authTypes';
import { axiosClient } from '../clients/axiosClient';
import { useMutation } from '@tanstack/react-query';
import { formatAxiosError } from '../clients/clientUtils';
import { AxiosError } from 'axios';

interface ITokenRes {
  status: boolean;
  code: string;
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

export interface ILoginReq {
  email: string;
  password: string;
}

interface IResendOtpRes {
  status: boolean;
  code: string;
  message: string;
  cooldownUntil: number;
}

interface IVerifyOTPReq {
  email: string;
  otp: string;
}

type RegisterUserResponse = {
  status: boolean;
  code: string;
  message: string;
  data: {
    email: string;
  };
};

const registerUser = async (
  signUpPayload: ISignUpUserReq
): Promise<RegisterUserResponse> => {
  try {
    const response = await axiosClient.post(`/auth/register`, signUpPayload);
    return response.data;
  } catch (error) {
    const axiosError = formatAxiosError(error as AxiosError);
    throw axiosError;
  }
};

const loginUser = async ({
  email,
  password,
}: ILoginReq): Promise<ITokenRes> => {
  try {
    const response = await axiosClient.post(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = formatAxiosError(error as AxiosError);
    throw axiosError;
  }
};

const verifyOTP = async ({ email, otp }: IVerifyOTPReq): Promise<ITokenRes> => {
  try {
    const response = await axiosClient.post(`/auth/otp/verify`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    const axiosError = formatAxiosError(error as AxiosError);
    throw axiosError;
  }
};

const resendOtp = async (email: string): Promise<IResendOtpRes> => {
  try {
    const response = await axiosClient.post(`/auth/otp/resend`, { email });
    return response.data;
  } catch (error) {
    const axiosError = formatAxiosError(error as AxiosError);
    throw axiosError;
  }
};

export const useRegisterUserApi = () => {
  return useMutation({
    mutationFn: registerUser,
    mutationKey: ['registerUser'],
  });
};

export const useLoginUserApi = () => {
  return useMutation({
    mutationFn: loginUser,
    mutationKey: ['loginUser'],
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
    mutationKey: ['verifyOTP'],
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: resendOtp,
    mutationKey: ['resendOtp'],
  });
};
