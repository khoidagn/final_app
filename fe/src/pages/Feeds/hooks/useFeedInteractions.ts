import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/auth.context';
import type { PhotoData } from '../../../types/photo.type';
import type { AlbumData } from '../../../types/album.type';
import { interactionService } from '../../../services/interaction.service';
import type {
  LikeResponse,
  FollowResponse,
} from '../../../types/interaction.type';
import { FEED_CONSTANTS } from '../../../constants/feed.constant';
import { getBackendMessage } from '../../../utils/error';

interface UseFeedInteractionsProps {
  setPhotos: React.Dispatch<React.SetStateAction<PhotoData[]>>;
  setAlbums: React.Dispatch<React.SetStateAction<AlbumData[]>>;
  onFollowAlert?: (authorId: number, nextStatus: boolean) => void;
}

export function useFeedInteractions({
  setPhotos,
  setAlbums,
  onFollowAlert,
}: UseFeedInteractionsProps) {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleFollowToggle = useCallback(
    async (authorId: number, currentStatus: boolean) => {
      if (!isLoggedIn) {
        toast.warning(FEED_CONSTANTS.API_RESPONSE.FOLLOW_AUTH_REQUIRED);
        navigate('/login');
        return;
      }

      try {
        const responseData: FollowResponse =
          await interactionService.toggleFollowUser(authorId);

        const nextStatus =
          responseData && typeof responseData.data?.followed === 'boolean'
            ? responseData.data.followed
            : !currentStatus;

        setPhotos((prev) =>
          prev.map((photo) =>
            photo.user?.id === authorId
              ? { ...photo, user: { ...photo.user, isFollowing: nextStatus } }
              : photo
          )
        );

        setAlbums((prev) =>
          prev.map((album) =>
            album.user?.id === authorId
              ? { ...album, user: { ...album.user, isFollowing: nextStatus } }
              : album
          )
        );

        if (onFollowAlert) {
          onFollowAlert(authorId, nextStatus);
        }
      } catch (error: unknown) {
        const errorMessage = getBackendMessage(
          error,
          FEED_CONSTANTS.API_RESPONSE.FOLLOW_FAILED
        );
        toast.error(errorMessage);
      }
    },
    [isLoggedIn, navigate, setPhotos, setAlbums, onFollowAlert]
  );

  const handleLikeToggle = useCallback(
    async (type: 'photo' | 'album', id: number) => {
      if (!isLoggedIn) {
        toast.warning(FEED_CONSTANTS.API_RESPONSE.LIKE_AUTH_REQUIRED);
        navigate('/login');
        return;
      }

      try {
        let responseData: LikeResponse;
        if (type === 'photo') {
          responseData = await interactionService.toggleLikePhoto(id);
          setPhotos((prev) =>
            prev.map((photo) => {
              if (photo.id !== id) return photo;
              const isLiked = responseData.data.liked;
              const currentLikes = photo.likesCount || 0;
              return {
                ...photo,
                isLiked,
                likesCount: isLiked
                  ? currentLikes + 1
                  : Math.max(0, currentLikes - 1),
              };
            })
          );
        } else {
          responseData = await interactionService.toggleLikeAlbum(id);
          setAlbums((prev) =>
            prev.map((album) => {
              if (album.id !== id) return album;
              const isLiked = responseData.data.liked;
              const currentLikes = album.likesCount || 0;
              return {
                ...album,
                isLiked,
                likesCount: isLiked
                  ? currentLikes + 1
                  : Math.max(0, currentLikes - 1),
              };
            })
          );
        }
      } catch (error: unknown) {
        const errorMessage = getBackendMessage(
          error,
          FEED_CONSTANTS.API_RESPONSE.LIKE_FAILED(type)
        );
        toast.error(errorMessage);
      }
    },
    [isLoggedIn, navigate, setPhotos, setAlbums]
  );

  return {
    handleFollowToggle,
    handleLikeToggle,
  };
}
