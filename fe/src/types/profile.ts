export type ProfileTab = 'photos' | 'albums' | 'followings' | 'followers';

export interface ProfileStats {
  photos: number;
  albums: number;
  followings: number;
  followers: number;
}

export interface ProfileCardData {
  id: number;
  title: string;
  image_url: string;     
  photos_count?: number;
  is_private: boolean;   
}

export interface UserFollowData {
  id: number;
  first_name: string;  
  last_name: string;    
  avatar_url: string;
  photos_count: number;
  albums_count: number;
  is_following: boolean; 
}