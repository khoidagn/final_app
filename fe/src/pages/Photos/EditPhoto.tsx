import MediaFormLayout from '../../components/layouts/MediaFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { usePhotoForm } from './hooks/usePhotoForm';
import { PHOTO_CONSTANTS } from '../../constants/photo.constant';

export default function EditPhoto() {
  const {
    formData,
    fieldErrors,
    setFormData,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isSubmitting,
    isDeleting,
  } = usePhotoForm(true);

  return (
    <>
      <MediaFormLayout
        title="Edit Photo"
        isEdit={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        backTo="/my-profile?tab=photos"
      >
        <PhotoFormFields
          formData={formData}
          fieldErrors={fieldErrors}
          setFormData={setFormData}
          onFieldChange={handleFieldChange}
          onFileChange={handleFileChange}
        />
      </MediaFormLayout>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Photo?"
        description={PHOTO_CONSTANTS.CONFIRM.DELETE_USER}
        confirmText="Delete Photo"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
