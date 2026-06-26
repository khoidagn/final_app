import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export function usePhotoForm(isEdit: boolean) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [sharingMode, setSharingMode] = useState('public');
  const [description, setDescription] = useState('');
  // const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isEdit && id) {
      const timer = setTimeout(() => {
        setTitle('Lorem ipsum dolor sit amet');
        setSharingMode('public');
        setDescription('Aliquam dictum nec massa ac consequat.');
        setPreviewSrc('/dog.jpg');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isEdit, id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 
    navigate('/my-profile');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
    // 
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
    // setImageFile,
    previewSrc,
    handleSubmit,
    handleDelete,
  };
}
