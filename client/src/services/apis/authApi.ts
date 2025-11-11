import { ISignUpUserReq } from '@/types/authTypes';
import { axiosClient } from '../clients/axiosClient';
import { useMutation } from '@tanstack/react-query';

const registerUser = async (
  signUpPayload: ISignUpUserReq
): Promise<unknown> => {
  const response = await axiosClient.post(`/register`, signUpPayload);
  return response.data;
};

export const useRegisterUserApi = () => {
  return useMutation({
    mutationFn: registerUser,
    mutationKey: ['registerUser'],
  });
};
