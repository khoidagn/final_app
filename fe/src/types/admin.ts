export interface AdminPhotoData {
  id: number;
  title: string;
  image_url: string;
  created_at?: string; 
}
export interface AdminAlbumData {
  id: number;
  title: string;
  image_url: string; 
  created_at?: string;
}

export interface AdminUserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  last_login: string;
}