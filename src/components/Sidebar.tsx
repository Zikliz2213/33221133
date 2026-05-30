import { useState } from 'react';
import { ApiService } from '../services/api';

interface SidebarProps {
  currentUser: any;
  chats: any[];
  selectedChat: any;
  onChatSelect: (chat: any) => void;
  onCreateChat: (userId: string) => void;
  onCreateChannel: (name: string, description: string) => void;
  onShowProfile: () => void;
  onToggleTheme: () => void;
  theme: 'light' | 'dark';
}

export function Sidebar({
  currentUser,
  chats,
  selectedChat,
  onChatSelect,
  onCreateChat,
  onCreateChannel,
  onShowProfile,
  onToggleTheme,
  theme,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<'all' | 'chats' | 'channels'>('all');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const results = await ApiService.get(`/search?q=${encodeURIComponent(query)}`);
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const filteredChats = chats.filter((chat) => {
    if (activeFolder === 'chats') return chat.type === 'chat';
    if (activeFolder === 'channels') return chat.type === 'channel';
    return true;
  });

  const displayChats = searchQuery ? searchResults : filteredChats;

  return (
    <div className="w-full md:w-96 bg-white dark:bg-tg-dark-secondary border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onShowProfile}
            className="flex items-center space-x-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition"
          >
            <div className="w-10 h-10 bg-tg-primary rounded-full flex items-center justify-center text-white font-semibold">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentUser?.displayName?.[0]?.toUpperCase() || 'U'
              )}
            </div>
            <span className="font-semibold text-gray-800 dark:text-white hidden md:block">
              {currentUser?.displayName || 'User'}
            </span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
            >
              <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} text-gray-600 dark:text-gray-400`}></i>
            </button>
            <button
              onClick={() => setShowNewChannel(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              title="Создать канал"
            >
              <i className="fas fa-bullhorn text-gray-600 dark:text-gray-400"></i>
            </button>
            <button
              onClick={() => setShowNewChat(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              title="Новый чат"
            >
              <i className="fas fa-edit text-gray-600 dark:text-gray-400"></i>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tg-primary"
          />
        </div>
      </div>

      {/* Folders */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        {(['all', 'chats', 'channels'] as const).map((folder) => (
          <button
            key={folder}
            onClick={() => setActiveFolder(folder)}
            className={`flex-1 py-3 text-sm font-medium transition ${
              activeFolder === folder
                ? 'text-tg-primary border-b-2 border-tg-primary'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            {folder === 'all' ? 'Все' : folder === 'chats' ? 'Чаты' : 'Каналы'}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {displayChats.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <i className="fas fa-comments text-4xl mb-2"></i>
            <p>Нет чатов</p>
          </div>
        ) : (
          displayChats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={selectedChat?.id === chat.id}
              onClick={() => onChatSelect(chat)}
            />
          ))
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <NewChatModal
          onClose={() => setShowNewChat(false)}
          onCreateChat={onCreateChat}
        />
      )}

      {/* New Channel Modal */}
      {showNewChannel && (
        <NewChannelModal
          onClose={() => setShowNewChannel(false)}
          onCreateChannel={onCreateChannel}
        />
      )}
    </div>
  );
}

function ChatItem({ chat, isActive, onClick }: any) {
  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div
      onClick={onClick}
      className={`chat-item flex items-center p-4 cursor-pointer border-b border-gray-100 dark:border-gray-800 transition ${
        isActive ? 'active' : ''
      }`}
    >
      <div className="w-12 h-12 bg-tg-primary rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
        {chat.avatar ? (
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : chat.type === 'channel' ? (
          <i className="fas fa-bullhorn"></i>
        ) : (
          chat.name?.[0]?.toUpperCase() || 'C'
        )}
      </div>

      <div className="flex-1 ml-3 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-800 dark:text-white truncate">
            {chat.name}
          </h3>
          {chat.lastMessage && (
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {formatTime(chat.lastMessage.createdAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {chat.lastMessage?.content || 'Нет сообщений'}
          </p>
          {chat.unreadCount > 0 && (
            <span className="ml-2 bg-tg-primary text-white text-xs font-semibold px-2 py-1 rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function NewChatModal({ onClose, onCreateChat }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const results = await ApiService.get(`/users/search?q=${encodeURIComponent(query)}`);
        setUsers(results);
      } catch (error) {
        console.error('User search failed:', error);
      }
    } else {
      setUsers([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-tg-dark-secondary rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Новый чат</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder="Поиск пользователей..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tg-primary"
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onCreateChat(user.id);
                onClose();
              }}
              className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
            >
              <div className="w-10 h-10 bg-tg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.displayName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.displayName?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">{user.displayName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewChannelModal({ onClose, onCreateChannel }: any) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateChannel(name, description);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-tg-dark-secondary rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Создать канал</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Название канала
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-tg-primary"
              placeholder="Мой канал"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-tg-primary resize-none"
              placeholder="О чём этот канал..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-tg-primary text-white rounded-lg hover:bg-blue-600 transition"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
