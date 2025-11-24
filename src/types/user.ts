export enum UserRole {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
  ADMIN = "ADMIN",
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  userType: UserRole;
}

export interface AuthResponse {
  username: string;
  email: string;
  userType: string;
  token: string;
}
