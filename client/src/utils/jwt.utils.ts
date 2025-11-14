type JwtPayload = {
  userId: number;
  email: string;
  isVerified: boolean;
  purpose: string;
  exp: number;
  iat: number;
};

// Enums
enum AuthLocalStorageKeys {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  ID_TOKEN = 'id_token',
}

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

/*
 **** JWT Auth helpers
 */
export function setAuthLocalStorage(token: string) {
  localStorage.setItem(AuthLocalStorageKeys.ACCESS_TOKEN, token);
  localStorage.setItem(AuthLocalStorageKeys.REFRESH_TOKEN, token);
  localStorage.setItem(AuthLocalStorageKeys.ID_TOKEN, token);
}

export function clearAuthLocalStorage() {
  localStorage.removeItem(AuthLocalStorageKeys.ACCESS_TOKEN);
  localStorage.removeItem(AuthLocalStorageKeys.REFRESH_TOKEN);
  localStorage.removeItem(AuthLocalStorageKeys.ID_TOKEN);
}

export function getAuthLocalStorage() {
  const accessToken =
    localStorage.getItem(AuthLocalStorageKeys.ACCESS_TOKEN) || '';
  const refreshToken =
    localStorage.getItem(AuthLocalStorageKeys.REFRESH_TOKEN) || '';
  const idToken = localStorage.getItem(AuthLocalStorageKeys.ID_TOKEN) || '';

  return {
    [AuthLocalStorageKeys.ACCESS_TOKEN]: accessToken,
    [AuthLocalStorageKeys.REFRESH_TOKEN]: refreshToken,
    [AuthLocalStorageKeys.ID_TOKEN]: idToken,
  };
}

export const setUserDataInLocalStorage = (data: any) => {
  localStorage.setItem('user', JSON.stringify(data));
};
