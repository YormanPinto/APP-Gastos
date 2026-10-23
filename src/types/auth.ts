export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider: 'email' | 'google';
  createdAt: number;
}

export type AuthMode = 'login' | 'register';
