import { useState, useEffect, useRef } from 'react';
import { WebSocketService } from '../services/websocket';
import { ApiService } from '../services/api';
import { EmojiPicker } from './EmojiPicker';

interface ChatWindowProps {
  chat: any;
  messages: any[];
  currentUser: any;
  onSendMessage: (content: string, attachments?: File[]) => void;
  onCall: (type: 'audio' | 'video') => void;
  wsService: WebSocketService | null;
}

export function ChatWindow({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onCall,
  wsService,
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!wsService || !chat) return;

    const handleTyping = (msg: any) => {
      if (msg.data.chatId === chat.id && msg.data.userId !== currentUser.id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000);
      }
    };

    wsService.on('typing', handleTyping);
    return () => wsService.off('typing', handleTyping);
  }, [wsService, chat, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (messageText.trim() || attachments.length > 0) {
      onSendMessage(messageText, attachments);
      setMessageText('');
      setAttachments([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = () => {
    if (wsService && chat) {
      wsService.send('typing', { chatId: chat.id });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = window.setTimeout(() => {
        // Stop typing
      }, 3000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments([...attachments, ...files]);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(messageText + emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await ApiService.post(`/messages/${messageId}/reactions`, { emoji });
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-tg-light-bg dark:bg-tg-dark-bg">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <i className="fas fa-comments text-6xl mb-4"></i>
          <p className="text-xl">Выберите чат для начала общения</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-tg-light-chat dark:bg-tg-dark-chat">
      {/* Header */}
      <div className="bg-white dark:bg-tg-dark-secondary border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-tg-primary rounded-full flex items-center justify-center text-white font-semibold relative">
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
            {chat.isOnline && chat.type !== 'channel' && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-tg-dark-secondary"></span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white">{chat.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isTyping ? (
                <span className="typing-indicator">
                  печатает<span>.</span><span>.</span><span>.</span>
                </span>
              ) : chat.isOnline && chat.type !== 'channel' ? (
                'в сети'
              ) : chat.type === 'channel' ? (
                `${chat.subscribersCount || 0} подписчиков`
              ) : (
                'не в сети'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onCall('audio')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Аудиозвонок"
          >
            <i className="fas fa-phone text-gray-600 dark:text-gray-400"></i>
          </button>
          <button
            onClick={() => onCall('video')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Видеозвонок"
          >
            <i className="fas fa-video text-gray-600 dark:text-gray-400"></i>
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
            <i className="fas fa-search text-gray-600 dark:text-gray-400"></i>
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
            <i className="fas fa-ellipsis-v text-gray-600 dark:text-gray-400"></i>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.map((message, index) => (
          <Message
            key={message.id || index}
            message={message}
            isOwn={message.userId === currentUser.id}
            onReaction={handleReaction}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="bg-white dark:bg-tg-dark-secondary border-t border-gray-200 dark:border-gray-800 p-3">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="relative bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex items-center space-x-2"
              >
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded">
                    <i className="fas fa-file text-2xl text-gray-500 dark:text-gray-400"></i>
                  </div>
                )}
                <span className="text-sm text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                  {file.name}
                </span>
                <button
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white dark:bg-tg-dark-secondary border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-end space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Прикрепить файл"
          >
            <i className="fas fa-paperclip text-gray-600 dark:text-gray-400"></i>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Написать сообщение..."
              rows={1}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-tg-dark-bg rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tg-primary resize-none"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
            title="Эмодзи"
          >
            <i className="fas fa-smile text-gray-600 dark:text-gray-400"></i>
          </button>

          {messageText.trim() || attachments.length > 0 ? (
            <button
              onClick={handleSend}
              className="p-2 bg-tg-primary hover:bg-blue-600 rounded-full transition text-white w-10 h-10 flex items-center justify-center"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          ) : (
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition">
              <i className="fas fa-microphone text-gray-600 dark:text-gray-400"></i>
            </button>
          )}
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <EmojiPicker
            onSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}
      </div>
    </div>
  );
}

function Message({ message, isOwn, onReaction }: any) {
  const [showReactions, setShowReactions] = useState(false);
  const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} slide-in`}>
      <div className="max-w-[70%]">
        <div
          className={`message-bubble rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-tg-primary text-white rounded-br-sm'
              : 'bg-white dark:bg-tg-dark-secondary text-gray-800 dark:text-white rounded-bl-sm'
          }`}
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mb-2 space-y-2">
              {message.attachments.map((attachment: any, index: number) => (
                <div key={index}>
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt="attachment"
                      className="rounded-lg max-w-full cursor-pointer hover:opacity-90 transition"
                    />
                  ) : (
                    <a
                      href={attachment.url}
                      download
                      className="flex items-center space-x-2 p-2 bg-black bg-opacity-10 rounded-lg hover:bg-opacity-20 transition"
                    >
                      <i className="fas fa-file text-xl"></i>
                      <span className="text-sm">{attachment.name}</span>
                      <i className="fas fa-download text-xs ml-auto"></i>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message text */}
          {message.content && <p className="whitespace-pre-wrap break-words">{message.content}</p>}

          {/* Time */}
          <p className={`text-xs mt-1 ${isOwn ? 'text-white text-opacity-70' : 'text-gray-500'}`}>
            {formatTime(message.createdAt)}
            {isOwn && (
              <i className="fas fa-check-double ml-1" title="Прочитано"></i>
            )}
          </p>
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((reaction: any, index: number) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {reaction.emoji} {reaction.count}
              </span>
            ))}
          </div>
        )}

        {/* Quick Reactions */}
        {showReactions && (
          <div className="flex gap-1 mt-1">
            {quickReactions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onReaction(message.id, emoji)}
                className="bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition transform hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
