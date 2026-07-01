import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface PhotoFormData {
  title: string;
  sharingMode: string;
  description: string;
  previewSrc: string;
}

export function usePhotoForm(isEdit: boolean) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(isEdit); // Nếu là edit thì bật trạng thái loading trước

  const [formData, setFormData] = useState<PhotoFormData>({
    title: '',
    sharingMode: 'public',
    description: '',
    previewSrc: '',
  });

  // Tự động nạp nội dung ảnh cũ vào Form nếu đây là chế độ Chỉnh sửa (Edit)
  useEffect(() => {
    if (!isEdit || !id) return;

    const loadPhotoDetail = async () => {
      try {
        setIsLoading(true);
        // Giả lập gọi API: const data = await photoService.getPhotoDetail(id);
        // Sau đó setFormData với dữ liệu thật từ Backend trả về

        // Demo dữ liệu mẫu được điền vào:
        setFormData({
          title: 'Bức ảnh thiên nhiên mùa thu',
          sharingMode: 'public',
          description:
            'Hình ảnh được chụp tại công viên vào một ngày nắng đẹp.',
          previewSrc: '/preview-image.jpg',
        });
      } catch (error) {
        console.error('Lỗi khi tải chi tiết ảnh:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPhotoDetail();
  }, [id, isEdit]);

  const handleSubmit = async (
    e: React.FormEvent,
    submitCallback: (data: PhotoFormData) => Promise<void>
  ) => {
    e.preventDefault();
    try {
      await submitCallback(formData);
    } catch (error) {
      console.error('Lỗi khi submit form:', error);
    }
  };

  return {
    id,
    formData,
    setFormData,
    isLoading,
    handleSubmit,
    navigate,
  };
}
