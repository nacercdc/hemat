export interface LoginResponse {
  token: string;
  refreshToken: string;
  expires: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
  expires: string;
}
