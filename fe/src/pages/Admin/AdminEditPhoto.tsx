import MediaFormLayout from '../../components/layouts/MediaFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { usePhotoForm } from '../Photos/hooks/usePhotoForm';
import { ADMIN_CONSTANTS } from '../../constants/admin.constant';

export default function AdminEditPhoto() {
  const {
    formData,
    fieldErrors,
    setFormData,
    isLoading,
    isSubmitting,
    isDeleting,
    isConfirmOpen,
    setIsConfirmOpen,
    handleFieldChange,
    handleFileChange,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
  } = usePhotoForm(true, true);

  if (isLoading) {
    return (
      <LoadingSpinner
        text="Loading photo content for Admin..."
        minHeight="min-h-[300px]"
      />
    );
  }

  return (
    <>
      <MediaFormLayout
        title="Edit Photo - Admin Mode"
        isEdit={true}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        backTo="/admin/photos"
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
        title="Delete Photo (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_PHOTO}
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
