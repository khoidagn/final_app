import React, { useState } from 'react';
import UserProfileFormFields from '../forms/UserProfileFormFields';
import PasswordField from '../ui/PasswordField';
import AvatarUploader from '../ui/AvatarUploader';
import { cn } from '../../utils/cn';
import { useUserProfileAction } from '../../pages/Profile/hooks/useUserProfileAction';

interface AccountSettingLayoutProps {
  title: string;
  actionButtonSlot: React.ReactNode;
  dangerZoneSlot?: React.ReactNode;
  profileActionHook: ReturnType<typeof useUserProfileAction>;
}

export default function AccountSettingLayout({
  title,
  actionButtonSlot,
  dangerZoneSlot,
  profileActionHook,
}: AccountSettingLayoutProps) {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    form,
    setForm,
    passwordForm,
    errors,
    isLoading,
    handleInfoSubmit,
    handlePasswordChange,
    handleFileChange,
  } = profileActionHook;

  return (
    <div
      className={cn(
        'w-full flex flex-col p-6 bg-surface border border-border-default rounded-sm shadow-2xs mx-auto'
      )}
    >
      <div
        className={cn(
          'w-full flex items-center justify-between pb-3 mb-8 border-b border-border-default'
        )}
      >
        <h2 className={cn('text-base font-bold text-text-primary')}>{title}</h2>
        {actionButtonSlot}
      </div>

      <form
        onSubmit={(e) => handleInfoSubmit(e, isChangingPassword)}
        className={cn('w-full flex flex-col items-center')}
      >
        <AvatarUploader
          avatarUrl={form.avatarUrl}
          onFileChange={handleFileChange}
          hintText="Accept: JPEG, PNG (Max 2MB)"
          className="mb-8"
        />

        <div className="w-full max-w-xl mb-4 text-left sm:pl-32">
          <h3 className="text-xs font-bold text-brand uppercase tracking-wider">
            Basic Information
          </h3>
        </div>

        <div className="w-full max-w-xl">
          <UserProfileFormFields
            formData={form}
            setFormData={setForm}
            isLoading={isLoading}
          />
        </div>

        <div className="w-full max-w-xl border-t border-border-muted my-6 pt-4" />

        <div
          className={cn(
            'w-full max-w-xl flex items-center gap-2 mb-6 sm:pl-32'
          )}
        >
          <h3
            className={cn(
              'text-xs font-bold text-brand uppercase tracking-wider text-left'
            )}
          >
            Change Password
          </h3>
          <button
            type="button"
            onClick={() => {
              setIsChangingPassword((prev) => !prev);
              handlePasswordChange('currentPassword', '');
              handlePasswordChange('newPassword', '');
              handlePasswordChange('confirmPassword', '');
            }}
            className={cn(
              'text-text-secondary hover:text-brand p-1 rounded-sm transition-all cursor-pointer bg-secondary/20 hover:bg-brand/10',
              isChangingPassword && 'text-brand bg-brand/10 rotate-45 transform'
            )}
            title="Toggle password fields"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>

        <div
          className={cn(
            'flex flex-col gap-4 w-full max-w-xl overflow-hidden transition-all duration-300 ease-in-out',
            isChangingPassword
              ? 'max-h-[380px] opacity-100 visible mb-6'
              : 'max-h-0 opacity-0 invisible mb-0'
          )}
        >
          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4">
              <label className="text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right">
                Current Password
              </label>
              <div className="flex-1">
                <PasswordField
                  label=""
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    handlePasswordChange('currentPassword', e.target.value)
                  }
                />
              </div>
            </div>
            {errors.currentPassword && (
              <p className="text-[10px] font-bold text-danger text-left sm:pl-36 mt-0.5 animate-pulse">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4">
              <label className="text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right">
                New Password
              </label>
              <div className="flex-1">
                <PasswordField
                  label=""
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordChange('newPassword', e.target.value)
                  }
                />
              </div>
            </div>
            {errors.newPassword && (
              <p className="text-[10px] font-bold text-danger text-left sm:pl-36 mt-0.5 animate-pulse">
                {errors.newPassword}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4">
              <label className="text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right">
                Confirm Password
              </label>
              <div className="flex-1">
                <PasswordField
                  label=""
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    handlePasswordChange('confirmPassword', e.target.value)
                  }
                />
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] font-bold text-danger text-left sm:pl-36 mt-0.5 animate-pulse">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            'flex w-full max-w-xl mt-4 sm:pl-32 pb-6',
            dangerZoneSlot && 'border-b border-border-muted'
          )}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'text-white text-xs font-semibold px-6 py-2 rounded-sm shadow-2xs bg-success hover:bg-success-hover active:scale-95 transform transition-transform cursor-pointer disabled:opacity-60 w-full sm:w-auto'
            )}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {dangerZoneSlot}
    </div>
  );
}
