export type ISignUpUserReq = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  division: {
    id?: string;
    name?: string;
    bnName?: string;
  };
  district: {
    id?: string;
    name?: string;
    bnName?: string;
  };
  upazila: {
    id?: string;
    name?: string;
    bnName?: string;
  };
  address: string;
};
