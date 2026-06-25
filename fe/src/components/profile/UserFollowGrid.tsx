import React from 'react';
import type { UserFollowData, ProfileTab } from '../types/profile';

interface UserFollowGridProps {
  users: UserFollowData[];
  context: 'my-profile' | 'public-profile'; 
  currentTab: ProfileTab; 
  onAction: (userId: number, currentStatus: boolean) => void;
}

export default function UserFollowGrid({ users, context, currentTab, onAction }: UserFollowGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
      {users.map((user) => {
        
        let buttonLabel = '';
        let buttonStyle = '';

        if (context === 'my-profile' && currentTab === 'followings') {
          // Ảnh 70f63a: Mình xem danh sách mình đang follow -> Hiện chữ "unfollow" màu cam viền cam
          buttonLabel = 'unfollow';
          buttonStyle = 'text-orange-500 border-orange-400 hover:bg-orange-50';
        } else {
          // Các trường hợp còn lại: Hiện trạng thái mình có follow họ hay chưa (Bấm vào để đảo ngược trạng thái)
          if (user.is_following) {
            buttonLabel = 'following';
            buttonStyle = 'text-white bg-orange-500 border-orange-500';
          } else {
            buttonLabel = 'follow';
            buttonStyle = 'text-orange-500 border-orange-400 hover:bg-orange-50';
          }
        }

        return (
          <div key={user.id} className="bg-gray-50 border border-gray-100 rounded-md p-4 flex flex-col items-center shadow-2xs">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200 mb-2">
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            </div>

            <h4 className="text-xs font-bold text-gray-800 mb-3 truncate max-w-full">{user.name}</h4>

            <div className="flex items-center space-x-4 mb-4 text-center">
              <div>
                <span className="text-xs font-bold text-blue-900 block">{user.photos_count}</span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase">Photos</span>
              </div>
              <div className="border-l border-gray-200 h-6"></div>
              <div>
                <span className="text-xs font-bold text-blue-900 block">{user.albums_count}</span>
                <span className="text-[9px] font-semibold text-gray-400 uppercase">Albums</span>
              </div>
            </div>

            <button
              onClick={() => onAction(user.id, user.is_following)}
              className={`w-20 py-0.5 text-[9px] font-bold rounded-xl transition-colors border cursor-pointer uppercase tracking-wider ${buttonStyle}`}
            >
              {buttonLabel}
            </button>
          </div>
        );
      })}
    </div>
  );
}