import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserProfileFormFields from '../../components/forms/UserProfileFormFields';
import { cn } from '../../utils/cn';

export default function AdminEditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Giả lập hoặc gọi API lấy thông tin User theo ID của Admin:
    // adminService.getUserDetail(id).then(...)
  }, [id]);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, password, is_active: isActive };
    console.log('Admin cập nhật User:', payload);
    // Thực thi API Admin update: await adminService.updateUser(id, payload)
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
          Edit User Profile - Admin
        </h2>
        <button
          onClick={() => navigate('/admin/users')}
          className={cn(
            'text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs bg-brand hover:bg-brand-hover active:scale-95 transform transition-transform cursor-pointer'
          )}
        >
          Back
        </button>
      </div>

      <form
        onSubmit={handleAdminSubmit}
        className={cn(
          'flex flex-col items-center w-full max-w-xl mx-auto pb-6'
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
              placeholder="******"
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

          {/* Nút bấm Save */}
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
