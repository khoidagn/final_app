import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import { usePhotoForm } from '../../hooks/usePhotoForm';
import { cn } from '../../utils/cn';

export default function UserEditPhoto() {
  const { id, formData, setFormData, isLoading, handleSubmit, navigate } =
    usePhotoForm(true);

  const handleUpdateSubmit = async () => {
    console.log('Gọi API USER cập nhật ảnh với ID:', id, formData);
    // await photoService.updatePhoto(id, formData);
    navigate('/my-profile');
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa bức ảnh này không?')) {
      console.log('Gọi API USER xóa ảnh:', id);
      // await photoService.deletePhoto(id);
      navigate('/my-profile');
    }
  };

  if (isLoading) {
    return (
      <div className={cn('p-6 text-center text-xs text-text-muted')}>
        Loading photo content...
      </div>
    );
  }

  return (
    <BaseFormLayout
      title="Edit Photo"
      isEdit={true}
      onSubmit={(e) => handleSubmit(e, handleUpdateSubmit)}
      onDelete={handleDelete}
      backTo="/my-profile?tab=photos"
    >
      <PhotoFormFields formData={formData} setFormData={setFormData} />
    </BaseFormLayout>
  );
}
