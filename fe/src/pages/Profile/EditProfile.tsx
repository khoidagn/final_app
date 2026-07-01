import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/profile.service';
import UserProfileFormFields from '../../components/forms/UserProfileFormFields';
import { cn } from '../../utils/cn';

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [statusMsg, setStatusMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    profileService
      .getMyProfile()
      .then((data) =>
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
        })
      )
      .catch((err) => console.error(err));
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      await profileService.updateBasicInfo(form);
      setStatusMsg({
        type: 'success',
        text: 'Cập nhật thông tin cơ bản thành công!',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setStatusMsg({
        type: 'error',
        text: errorMessage,
      });
    }
  };

  return (
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
          Edit User Profile
        </h2>
        <button
          type="button"
          onClick={() => navigate('/my-profile')}
          className={cn(
            'text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer border border-transparent',
            'text-white bg-brand hover:bg-brand-hover',
            'active:scale-95 transform transition-transform'
          )}
        >
          Back
        </button>
      </div>

      {statusMsg && (
        <div
          className={cn(
            'max-w-xl mx-auto w-full p-2.5 mb-4 text-xs font-semibold rounded text-center border',
            statusMsg.type === 'success'
              ? 'bg-success/5 text-success border-success/20'
              : 'bg-danger/5 text-danger border-danger/20'
          )}
        >
          {statusMsg.text}
        </div>
      )}

      <form
        onSubmit={handleInfoSubmit}
        className={cn(
          'flex flex-col items-center w-full max-w-xl mx-auto mb-10 pb-10 border-b border-border-default'
        )}
      >
        <div
          className={cn(
            'w-24 h-24 rounded-md overflow-hidden relative border border-border-default shadow-2xs mb-6 group cursor-pointer active:scale-95 transform transition-transform'
          )}
        >
          <img
            src="/dog.jpg"
            alt="Avatar"
            className={cn('w-full h-full object-cover')}
          />
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white text-center py-1 font-medium uppercase select-none'
            )}
          >
            Change
          </div>
        </div>

        <h3
          className={cn(
            'text-xs font-bold mb-6 w-full text-center text-brand sm:text-left sm:pl-36'
          )}
        >
          Basic Information
        </h3>

        <UserProfileFormFields formData={form} setFormData={setForm} />

        <div className={cn('flex w-full mt-4 sm:pl-36')}>
          <button
            type="submit"
            className={cn(
              'text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs bg-success hover:bg-success-hover active:scale-95 transform transition-transform cursor-pointer'
            )}
          >
            Save
          </button>
        </div>
      </form>

      <form
        className={cn(
          'flex flex-col items-center w-full max-w-xl mx-auto pb-6'
        )}
        onSubmit={(e) => e.preventDefault()}
      >
        <h3
          className={cn(
            'text-xs font-bold mb-6 w-full text-center text-brand sm:text-left sm:pl-36'
          )}
        >
          Password
        </h3>
        <div className={cn('flex flex-col gap-4 w-full')}>
          {['Current Password', 'New Password', 'Password Confirmation'].map(
            (label) => (
              <div
                key={label}
                className={cn(
                  'flex flex-col gap-2 w-full sm:flex-row sm:items-center sm:gap-4'
                )}
              >
                <label
                  className={cn(
                    'text-xs font-bold text-text-secondary text-left shrink-0 sm:w-32 sm:text-right'
                  )}
                >
                  {label}
                </label>
                <input
                  type="password"
                  placeholder="******"
                  className={cn(
                    'flex-1 bg-surface border border-border-default rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-brand text-text-primary'
                  )}
                />
              </div>
            )
          )}
          <div className={cn('flex mt-2 sm:pl-36')}>
            <button
              type="submit"
              className={cn(
                'text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs bg-success hover:bg-success-hover active:scale-95 transform transition-transform cursor-pointer'
              )}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
