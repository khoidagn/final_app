import MediaFormLayout from '../../components/layouts/MediaFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { usePhotoForm } from '../Photos/hooks/usePhotoForm';
import { ADMIN_CONSTANTS } from '../../constants/admin.constant';
import { cn } from '../../utils/cn';

export default function AdminEditPhoto() {
  const {
    formData,
    setFormData,
    isLoading,
    isSubmitting,
    isDeleting,
    isConfirmOpen,
    setIsConfirmOpen,
    handleFileChange,
    handleSubmit,
    handleDelete,
    handleConfirmDelete,
  } = usePhotoForm(true, true);

  if (isLoading) {
    return (
      <div className={cn('p-6 text-center text-xs text-text-muted')}>
        Loading photo content for Admin...
      </div>
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
      >
        <PhotoFormFields
          formData={formData}
          setFormData={setFormData}
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
