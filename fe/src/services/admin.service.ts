const BASE_URL = 'http://localhost:5000';

export interface PaginatedResponse<T> {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];   
}

export const adminService = {
  /**
   * Lấy danh sách dữ liệu phân trang theo endpoint quản trị
   * @param endpoint - Tên tài nguyên (admin_photos, admin_albums, admin_users)
   * @param page - Trang hiện tại cần lấy
   * @param perPage - Số lượng bản ghi trên mỗi trang 
   */
  getPaginatedData: async <T>(
    endpoint: string,
    page: number,
    perPage: number
  ): Promise<PaginatedResponse<T> | T[]> => {
    const response = await fetch(
      `${BASE_URL}/${endpoint}?_page=${page}&_per_page=${perPage}`
    );

    if (!response.ok) {
      throw new Error(`Không thể kết nối đến tài nguyên: ${endpoint}`);
    }

    return response.json();
  },
  
  // deleteUser: async (id: number) => { ... },
  // toggleUserStatus: async (id: number, active: boolean) => { ... }
};