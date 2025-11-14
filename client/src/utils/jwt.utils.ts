type JwtPayload = {
  userId: number;
  email: string;
  isVerified: boolean;
  purpose: string;
  exp: number;
  iat: number;
};

export const parseJWT = (token: string): JwtPayload => {
  if (!token || token === 'undefined') {
    return {
      userId: -1,
      email: '',
      isVerified: false,
      purpose: '',
      exp: 0,
      iat: 0,
    };
  } else {
    const base64Url = token.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
};
