const BASE_URL = 'http://localhost:5000';

export interface AuthUser {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: 'guest' | 'user' | 'admin';
}

export interface AuthSessionResponse {
  isLoggedIn: boolean;
  user: AuthUser | null;
}

export const authService = {
  getCurrentSession: async (): Promise<AuthSessionResponse> => {
    const response = await fetch(`${BASE_URL}/auth_session`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin phiên đăng nhập');
    }
    return response.json();
  }
};