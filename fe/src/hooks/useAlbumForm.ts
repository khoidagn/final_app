import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function useAlbumForm(isEdit: boolean) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [sharingMode, setSharingMode] = useState('public');
  const [description, setDescription] = useState('');
  const [albumImages, setAlbumImages] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit && id) {
      const timer = setTimeout(() => {
        setTitle('My Summer Album Collection');
        setSharingMode('public');
        setDescription('Beautiful collection of summer trip memories.');
        setAlbumImages(['/dog.jpg', '/placeholder.jpg']);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEdit, id]);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setAlbumImages((prev) => [...prev, ...filesArray]);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setAlbumImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic gọi API: New hoặc Update Album
    navigate('/my-profile');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this album?')) {
      navigate('/my-profile');
    }
  };

  return {
    title,
    setTitle,
    sharingMode,
    setSharingMode,
    description,
    setDescription,
    albumImages,
    handleAddImages,
    handleRemoveImage,
    handleSubmit,
    handleDelete,
  };
}
