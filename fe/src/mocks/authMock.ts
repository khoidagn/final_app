export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_initials: string;
  avatar_url?: string;
  role: 'guest' | 'user' | 'admin';
}

interface AuthSession {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

export const MOCK_AUTH_SESSION = {
  isLoggedIn: true,
  user: {
    id: 10,
    first_name: "Van",
    last_name: "Voi",
    avatar_url: "", 
    role: "user"
  }
};