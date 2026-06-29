import React from 'react';
import AlbumCard from './AlbumCard';
import type { AlbumData } from '../../../types/feeds';
import { cn } from '../../../utils/cn';

interface AlbumGridProps {
  albums: AlbumData[];
  onSelectAlbum: (id: number) => void;
  onFollowToggle?: (authorId: number, currentStatus: boolean) => void;
}

export default function AlbumGrid({
  albums,
  onSelectAlbum,
  onFollowToggle,
}: AlbumGridProps) {
  return (
    <div
      className={cn('w-full mb-10 grid grid-cols-1 gap-6', 'lg:grid-cols-2')}
    >
      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          data={album}
          onFollowToggle={onFollowToggle}
          onCardClick={() => onSelectAlbum(album.id)}
        />
      ))}
    </div>
  );
}
