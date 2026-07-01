import { useState } from 'react';

export function useAlbumCarousel(images: string[]) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isSuperVertical, setIsSuperVertical] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsSuperVertical(naturalHeight / naturalWidth > 1.2);
  };

  return {
    currentIndex,
    isSuperVertical,
    handlePrev,
    handleNext,
    handleImageLoad,
  };
}
