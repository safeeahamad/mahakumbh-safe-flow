export type UserRole = 'admin' | 'operator' | 'public';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
