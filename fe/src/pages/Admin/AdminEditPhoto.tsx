import React from 'react';
import BaseFormLayout from '../../components/layouts/BaseFormLayout';
import PhotoFormFields from '../../components/forms/PhotoFormFields';
import { usePhotoForm } from '../../hooks/usePhotoForm';
import { cn } from '../../utils/cn';

export default function AdminEditPhoto() {
  const { id, formData, setFormData, isLoading, handleSubmit, navigate } = usePhotoForm(true);

  const handleAdminUpdateSubmit = async () => {
    console.log('Gọi API ADMIN cưỡng chế cập nhật ảnh:', id, formData);
    // await adminService.updateUserPhoto(id, formData);
    navigate('/admin/photos');
  };

  const handleAdminDelete = async () => {
    if (window.confirm('Admin có chắc chắn muốn gỡ bỏ bức ảnh này của User khỏi hệ thống?')) {
      console.log('Gợi API ADMIN gỡ ảnh:', id);
      // await adminService.deleteUserPhoto(id);
      navigate('/admin/photos');
    }
  };

  if (isLoading) {
    return <div className={cn("p-6 text-center text-xs text-text-muted")}>Loading photo content for Admin...</div>;
  }

  return (
    <BaseFormLayout
      title="Edit Photo - Admin Mode"
      isEdit={true}
      onSubmit={(e) => handleSubmit(e, handleAdminUpdateSubmit)}
      onDelete={handleAdminDelete}
    >
      <PhotoFormFields formData={formData} setFormData={setFormData} />
    </BaseFormLayout>
  );
}