import { useRef } from 'react';
import UserProfileFormFields from '../../components/forms/UserProfileFormFields';
import { useAdminEditUser } from './hooks/useAdminEditUser';
import BackButton from '../../components/ui/BackButton';
import AvatarUploader from '../../components/ui/AvatarUploader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { ADMIN_CONSTANTS } from '../../constants/admin.constant';
import { cn } from '../../utils/cn';

export default function AdminEditUser() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    form,
    setForm,
    password,
    setPassword,
    isActive,
    setIsActive,
    isLoading,
    isSubmitting,
    isDeleting,
    isConfirmOpen,
    setIsConfirmOpen,
    handleAdminSubmit,
    handleFileChange,
    handleOpenDeleteModal,
    handleConfirmDelete,
  } = useAdminEditUser();

  if (isLoading) {
    return (
      <div
        className={cn(
          'w-full min-h-[400px] flex items-center justify-center p-6 bg-surface border border-border-default rounded-sm'
        )}
      >
        <div
          className={cn(
            'w-8 h-8 border-4 rounded-full animate-spin border-border-default border-t-brand'
          )}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'w-full flex flex-col p-6 bg-surface border border-border-default rounded-sm shadow-2xs'
        )}
      >
        <div
          className={cn(
            'w-full flex items-center justify-between pb-3 mb-8 border-b border-border-default'
          )}
        >
          <h2 className={cn('text-base font-bold text-text-primary')}>
            Edit User Profile - Admin
          </h2>
          <BackButton to="/admin/users" />
        </div>

        <form
          onSubmit={handleAdminSubmit}
          className={cn(
            'flex flex-col items-center w-full max-w-xl mx-auto pb-6'
          )}
        >
          <AvatarUploader
            avatarUrl={form.avatarUrl}
            onFileChange={handleFileChange}
            hintText="Accept: JPEG, PNG (Max 2MB)"
            className="mb-6"
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png"
            className="hidden"
          />

          <h3
            className={cn(
              'text-xs font-bold mb-6 w-full text-center text-brand sm:text-left sm:pl-36'
            )}
          >
            Basic Information
          </h3>

          <UserProfileFormFields formData={form} setFormData={setForm} />

          <div className={cn('flex flex-col gap-4 w-full mt-4')}>
            <div
              className={cn(
                'flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4'
              )}
            >
              <label
                className={cn(
                  'text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right'
                )}
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'flex-1 bg-surface border border-border-default rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-brand text-text-primary'
                )}
              />
            </div>

            <div
              className={cn('flex flex-row items-center gap-2 w-full sm:pl-36')}
            >
              <input
                type="checkbox"
                id="isActiveCheck"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className={cn(
                  'w-4 h-4 rounded border-border-default text-brand focus:ring-brand cursor-pointer'
                )}
              />
              <label
                htmlFor="isActiveCheck"
                className={cn(
                  'text-xs font-bold text-text-secondary cursor-pointer select-none'
                )}
              >
                Active?
              </label>
            </div>

            <div
              className={cn('flex items-center justify-between mt-4 sm:pl-36')}
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs bg-success hover:bg-success-hover active:scale-95 transform transition-transform cursor-pointer disabled:opacity-50'
                )}
              >
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>

              {handleOpenDeleteModal && (
                <button
                  type="button"
                  onClick={handleOpenDeleteModal}
                  className={cn(
                    'text-xs font-bold text-danger hover:underline cursor-pointer'
                  )}
                >
                  Delete User
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Delete User (Admin)?"
        description={ADMIN_CONSTANTS.CONFIRM.DELETE_USER(
          form.email || 'this user'
        )}
        confirmText="Delete User"
        cancelText="Cancel"
        isDanger={true}
        isLoading={isDeleting}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
