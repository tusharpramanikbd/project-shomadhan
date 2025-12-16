type TUserData = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  division: string | null;
  district: string | null;
  upazila: string | null;
  isVerified?: boolean;
};

export type TRegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  division?: { id?: string; name?: string; bnName?: string };
  district?: { id?: string; name?: string; bnName?: string };
  upazila?: { id?: string; name?: string; bnName?: string };
  address?: string;
};

export type TRegisterResponse = {
  status: 'user_created' | 'pending_verification';
  email: string;
};

export type TVerifyOtpResponse = {
  token: string;
  userData: TUserData;
};

export type TResendOtpResponse = {
  blocked: boolean;
  code: string;
  message: string;
  cooldownUntil?: number;
};

export type TLoginResponse = {
  status: 'pending_verification' | 'logged_in';
  token?: string;
  userData?: TUserData;
};
