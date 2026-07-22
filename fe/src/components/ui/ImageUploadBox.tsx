import { cn } from '../../utils/cn';

interface ImageUploadBoxProps {
  imageSrc?: string;
  onRemove?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageUploadBox({
  imageSrc,
  onRemove,
  onChange,
}: ImageUploadBoxProps) {
  return (
    <div className={cn('w-32 h-32 relative shrink-0')}>
      {imageSrc ? (
        <div
          className={cn(
            'w-full h-full rounded-sm border overflow-hidden relative shadow-2xs',
            'border-border-default'
          )}
        >
          <img
            src={imageSrc}
            alt="Preview"
            className={cn('w-full h-full object-cover')}
          />
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              'absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] focus:outline-none cursor-pointer transition-colors',
              'hover:bg-black/80',
              'active:scale-90 transform transition-transform'
            )}
          >
            ✕
          </button>
        </div>
      ) : (
        <label
          className={cn(
            'w-full h-full rounded-sm border-2 border-dashed flex flex-col items-center justify-center transition-colors cursor-pointer group',
            'border-border-default bg-background/50 hover:bg-background'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={onChange}
            className={cn('hidden')}
          />
          <span
            className={cn(
              'text-3xl font-light transition-colors',
              'text-text-muted group-hover:text-text-secondary'
            )}
          >
            +
          </span>
        </label>
      )}
    </div>
  );
}
