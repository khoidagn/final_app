const BASE_URL = 'http://localhost:5000';

export const profileService = {
  getMyProfile: async () => {
    const res = await fetch(`${BASE_URL}/my_profile`);
    if (!res.ok) throw new Error('Không thể tải profile cá nhân');
    return res.json();
  },

  getPublicProfile: async (userId: string | undefined) => {
    const res = await fetch(`${BASE_URL}/public_profile_user`);
    if (!res.ok) throw new Error('Không thể tải thông tin user công khai');
    return res.json();
  },

  getProfileContent: async (resource: 'photos' | 'albums' | 'followings' | 'followers') => {
    const res = await fetch(`${BASE_URL}/profile_${resource}`);
    if (!res.ok) throw new Error(`Không thể tải tài nguyên profile: ${resource}`);
    return res.json();
  },

  updateBasicInfo: async (data: { first_name: string; last_name: string; email: string }) => {
    const res = await fetch(`${BASE_URL}/my_profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ first_name: data.first_name, last_name: data.last_name, email: data.email })
    });
    if (!res.ok) throw new Error('Cập nhật thông tin thất bại');
    return res.json();
  }
};