import MediaFormLayout from '../../components/layouts/MediaFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import { usePhotoForm } from './hooks/usePhotoForm';

export default function NewPhoto() {
  const {
    formData,
    setFormData,
    handleFileChange,
    handleSubmit,
    isSubmitting,
  } = usePhotoForm(false);

  return (
    <MediaFormLayout
      title="New Photo"
      isEdit={false}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      backTo="/my-profile?tab=photos"
    >
      <PhotoFormFields
        formData={formData}
        setFormData={setFormData}
        onFileChange={handleFileChange}
      />
    </MediaFormLayout>
  );
}
