import React, { useRef } from 'react';
import { cn } from '../../utils/cn';

interface AvatarUploaderProps {
  /** Đường dẫn ảnh hiện tại hoặc ảnh preview để hiển thị */
  avatarUrl: string;
  /** Hàm callback xử lý khi người dùng chọn được file ảnh mới */
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Dòng text ghi chú dung lượng bên dưới (ví dụ: "Max 5MB" hoặc "Max 2MB") */
  hintText?: string;
  /** Lớp CSS bổ sung để tùy biến khoảng cách margin bên ngoài */
  className?: string;
}

export default function AvatarUploader({
  avatarUrl,
  onFileChange,
  hintText,
  className,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('flex flex-col items-center gap-2 group', className)}>
      <div
        onClick={triggerFileSelect}
        className={cn(
          'w-32 h-32 rounded-full overflow-hidden relative border border-border-default shadow-2xs cursor-pointer',
          'ring-offset-2 ring-brand/10 hover:ring-4 active:scale-95 transform transition-all select-none'
        )}
      >
        <img
          src={avatarUrl || '/default-avatar.jpg'}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
        <div
          className={cn(
            'absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-medium uppercase',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
          )}
        >
          Change
        </div>
      </div>

      {hintText && (
        <span className="text-[9px] text-text-muted font-medium">
          {hintText}
        </span>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/jpeg, image/png"
        className="hidden"
      />
    </div>
  );
}
