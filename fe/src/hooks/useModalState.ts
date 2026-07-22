import { useState } from 'react';

export function useModalState<T>() {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openModal = (item: T) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  return {
    selectedItem,
    isOpen: selectedItem !== null,
    openModal,
    closeModal,
  };
}
