import { useState, useRef } from 'react';
import { ApiService } from '../services/api';

interface ProfileModalProps {
  user: any;
  onClose: () => void;
  onLogout: () => void;
}

export function ProfileModal({ user, onClose, onLogout }: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload avatar if changed
      let avatarUrl = user.avatar;
      if (avatarFile) {
        const result = await ApiService.uploadFile('/upload/avatar', avatarFile) as any;
        avatarUrl = result.url;
      }

      // Update profile
      await ApiService.put('/users/me', {
        ...formData,
        avatar: avatarUrl,
      });

      setIsEditing(false);
      // Refresh user data
      window.location.reload();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Не удалось обновить профиль');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-tg-dark-secondary rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-tg-dark-secondary border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {isEditing ? 'Редактировать профиль' : 'Профиль'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-tg-primary rounded-full flex items-center justify-center text-white text-4xl font-semibold overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={formData.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  formData.displayName?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              {isEditing && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-tg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition"
                  >
                    <i className="fas fa-camera"></i>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Имя
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-tg-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Имя пользователя
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-tg-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  О себе
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-tg-primary resize-none"
                  placeholder="Напишите о себе..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-tg-primary text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Сохранение...
                    </span>
                  ) : (
                    'Сохранить'
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {user?.displayName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">@{user?.username}</p>
              </div>

              {user?.bio && (
                <div className="bg-gray-50 dark:bg-tg-dark-bg rounded-lg p-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{user.bio}</p>
                </div>
              )}

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full px-4 py-3 bg-tg-primary text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Редактировать профиль
                </button>

                <button className="w-full px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition flex items-center justify-center">
                  <i className="fas fa-cog mr-2"></i>
                  Настройки
                </button>

                <button
                  onClick={onLogout}
                  className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
