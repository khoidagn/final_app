import React from 'react';
import { Link } from 'react-router-dom';
import ImageUploadBox from '../components/ImageUploadBox';

interface PhotoFormProps {
  isEdit?: boolean;
}

export default function PhotoForm({ isEdit = false }: PhotoFormProps) {
  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6 w-full flex flex-col">
      
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
        <h2 className="text-base font-bold text-gray-900">
          {isEdit ? 'Edit Photo' : 'New Photo'}
        </h2>
        {isEdit && (
          <Link 
            to="/my-profile" 
            className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs text-decoration-none transition-colors"
          >
            Back
          </Link>
        )}
      </div>

      {/* Cấu trúc Form chia làm 2 cột Trái - Phải chuẩn Mockup */}
      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 w-full">
        
        {/* CỘT TRÁI: Title, Sharing Mode, và Image */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Title</label>
            <input 
              type="text" 
              placeholder="Photo Title"
              defaultValue={isEdit ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' : ''}
              className="w-full bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Sharing mode</label>
            <select className="w-36 bg-white border border-gray-300 rounded-sm px-3 py-1.5 text-xs focus:outline-none focus:border-blue-900 text-gray-800 cursor-pointer">
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Ô tải ảnh lên (New Photo chỉ cần 1 ô) */}
          <div className="mt-2">
            <ImageUploadBox imageSrc={isEdit ? '/dog.jpg' : undefined} />
          </div>
        </div>

        {/* CỘT PHẢI: Description */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1.5">Description</label>
          <textarea 
            rows={6}
            placeholder="Photo Description"
            defaultValue={isEdit ? 'Aliquam dictum nec massa ac consequat. Etiam dignissim tincidunt tellus sed vestibulum. Sed vitae vestibulum purus. Curabitur malesuada libero in nibh pretium, sed malesuada nisi feugiat' : ''}
            className="w-full bg-white border border-gray-300 rounded-sm px-3 py-2 text-xs focus:outline-none focus:border-blue-900 placeholder-gray-300 text-gray-800 resize-none leading-relaxed"
          />
        </div>

        {/* CỤM NÚT SUBMIT / DELETE DƯỚI ĐÁY FORM */}
        <div className="md:col-span-2 flex items-center gap-3 pt-4 border-t border-gray-50 mt-4">
          <button 
            type="submit" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer focus:outline-none"
          >
            Save
          </button>

          {/* Nút Delete đỏ rực chỉ xuất hiện ở chế độ Edit kèm icon thùng rác nhỏ */}
          {isEdit && (
            <button 
              type="button" 
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-sm shadow-2xs transition-colors cursor-pointer focus:outline-none flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          )}
        </div>

      </form>
    </div>
  );
}