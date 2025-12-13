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

export type TRegisterResponse =
  | { status: 'user_created'; email: string }
  | { status: 'pending_verification'; email: string };

export type TVerifyOtpResponse = {
  token: string;
  userData: {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    division: string | null;
    district: string | null;
    upazila: string | null;
    isVerified: boolean;
  };
};

export type TResendOtpResponse = {
  blocked: boolean;
  message: string;
  cooldownUntil?: number;
};

export type TLoginResponse =
  | { status: 'pending_verification'; email: string }
  | { status: 'logged_in'; token: string; userData: any };
