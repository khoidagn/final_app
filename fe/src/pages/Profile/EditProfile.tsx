import React, { useState, useEffect } from 'react';
import { profileService } from '../../services/profile.service';

export default function EditProfile() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '' });
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    profileService.getMyProfile()
      .then(data => setForm({ first_name: data.first_name, last_name: data.last_name, email: data.email }))
      .catch(err => console.error(err));
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    try {
      await profileService.updateBasicInfo(form);
      setStatusMsg({ type: 'success', text: 'Cập nhật thông tin cơ bản thành công!' });
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Có lỗi xảy ra' });
    }
  };

  return (
    <div className="bg-white rounded-sm border border-gray-100 p-6 w-full flex flex-col">
      <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-8">Edit User Profile</h2>

      {statusMsg && (
        <div className={`max-w-xl mx-auto w-full p-2.5 mb-4 text-xs font-semibold rounded text-center ${
          statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleInfoSubmit} className="flex flex-col items-center w-full max-w-xl mx-auto mb-10 pb-10 border-b border-gray-100">
        <div className="w-24 h-24 rounded-md overflow-hidden relative border border-gray-200 shadow-2xs mb-6 group cursor-pointer">
          <img src="/dog.jpg" alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] text-white text-center py-1 font-medium select-none uppercase tracking-wide">Change</div>
        </div>

        <h3 className="text-xs font-bold text-blue-900 mb-6 w-full text-center sm:text-left sm:pl-36">Basic Information</h3>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <label className="text-xs font-bold text-gray-700 sm:w-32 text-left sm:text-right shrink-0">First Name</label>
            <input 
              type="text" 
              value={form.first_name}
              onChange={e => setForm(prev => ({ ...prev, first_name: e.target.value }))}
              className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <label className="text-xs font-bold text-gray-700 sm:w-32 text-left sm:text-right shrink-0">Last Name</label>
            <input 
              type="text" 
              value={form.last_name}
              onChange={e => setForm(prev => ({ ...prev, last_name: e.target.value }))}
              className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 text-gray-800"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <label className="text-xs font-bold text-gray-700 sm:w-32 text-left sm:text-right shrink-0">Email</label>
            <input 
              type="email" 
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 text-gray-800"
              required
            />
          </div>

          <div className="flex sm:pl-36 mt-2">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs transition-colors focus:outline-none cursor-pointer">Save</button>
          </div>
        </div>
      </form>

      {/* Khối đổi mật khẩu giữ nguyên trạng thái UI tĩnh */}
      <form className="flex flex-col items-center w-full max-w-xl mx-auto pb-6" onSubmit={e => e.preventDefault()}>
        <h3 className="text-xs font-bold text-blue-900 mb-6 w-full text-center sm:text-left sm:pl-36">Password</h3>
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <label className="text-xs font-bold text-gray-700 sm:w-32 text-left sm:text-right shrink-0">Current Password</label>
            <input type="password" placeholder="******" className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <label className="text-xs font-bold text-gray-700 sm:w-32 text-left sm:text-right shrink-0">New Password</label>
            <input type="password" placeholder="******" className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full">
            <label className="text-xs font-bold text-gray-700 sm:w-32 text-left sm:text-right shrink-0">Password Confirmation</label>
            <input type="password" placeholder="******" className="flex-1 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800" />
          </div>
          <div className="flex sm:pl-36 mt-2">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs transition-colors focus:outline-none cursor-pointer">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
}