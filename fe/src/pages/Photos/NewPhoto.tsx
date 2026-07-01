import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import { usePhotoForm } from '../../hooks/usePhotoForm';

export default function NewPhoto() {
  const { formData, setFormData, handleSubmit, navigate } = usePhotoForm(false);

  const handleCreateSubmit = async () => {
    console.log('Gọi API USER thêm mới ảnh:', formData);
    // await photoService.createPhoto(formData);
    navigate('/my-profile');
  };

  return (
    <BaseFormLayout
      title="New Photo"
      isEdit={false}
      onSubmit={(e) => handleSubmit(e, handleCreateSubmit)}
      backTo="/my-profile?tab=photos"
    >
      <PhotoFormFields formData={formData} setFormData={setFormData} />
    </BaseFormLayout>
  );
}
