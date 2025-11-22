export enum UserRole {
  EMPLOYEE = 'employee',
  ADMIN = 'admin'
}

export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active?: boolean;
}

export interface UsersResponse {
  success: boolean;
  users?: User[];
  user?: User;
  error?: string;
  message?: string;
}

