import { useState, useEffect } from 'react';
import { WebSocketService } from '../services/websocket';
import { Sidebar } from './Sidebar';
import { ChatWindow } from './ChatWindow';
import { ProfileModal } from './ProfileModal';
import { CallModal } from './CallModal';
import { ApiService } from '../services/api';

interface MainScreenProps {
  currentUser: any;
  onLogout: () => void;
  wsService: WebSocketService | null;
}

export function MainScreen({ currentUser, onLogout, wsService }: MainScreenProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Setup WebSocket listeners
  useEffect(() => {
    if (!wsService) return;

    const handleNewMessage = (msg: any) => {
      if (msg.data.chatId === selectedChat?.id) {
        setMessages((prev) => [...prev, msg.data]);
      }
      // Update chat list
      loadChats();
    };

    const handleTyping = (msg: any) => {
      // Handle typing indicator
      if (msg.data.chatId === selectedChat?.id) {
        // Update typing status
      }
    };

    wsService.on('message', handleNewMessage);
    wsService.on('typing', handleTyping);

    return () => {
      wsService.off('message', handleNewMessage);
      wsService.off('typing', handleTyping);
    };
  }, [wsService, selectedChat]);

  const loadChats = async () => {
    try {
      const data = await ApiService.get('/chats');
      setChats(data);
    } catch (error) {
      console.error('Failed to load chats:', error);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await ApiService.get(`/chats/${chatId}/messages`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleChatSelect = (chat: any) => {
    setSelectedChat(chat);
    loadMessages(chat.id);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedChat) return;

    try {
      // Upload attachments first if any
      const uploadedFiles = [];
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const result = await ApiService.uploadFile(`/upload`, file);
          uploadedFiles.push(result);
        }
      }

      // Send message via WebSocket for real-time delivery
      wsService?.send('message', {
        chatId: selectedChat.id,
        content,
        attachments: uploadedFiles,
      });

      // Also send via API for persistence
      const message = await ApiService.post(`/chats/${selectedChat.id}/messages`, {
        content,
        attachments: uploadedFiles,
      });

      setMessages((prev) => [...prev, message]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleCreateChat = async (userId: string) => {
    try {
      const chat = await ApiService.post('/chats', { userId });
      setChats((prev) => [chat, ...prev]);
      setSelectedChat(chat);
      loadMessages(chat.id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleCreateChannel = async (name: string, description: string) => {
    try {
      const channel = await ApiService.post('/channels', { name, description });
      setChats((prev) => [channel, ...prev]);
      setSelectedChat(channel);
    } catch (error) {
      console.error('Failed to create channel:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const handleCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setShowCall(true);
  };

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar */}
      <Sidebar
        currentUser={currentUser}
        chats={chats}
        selectedChat={selectedChat}
        onChatSelect={handleChatSelect}
        onCreateChat={handleCreateChat}
        onCreateChannel={handleCreateChannel}
        onShowProfile={() => setShowProfile(true)}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      {/* Chat Window */}
      <ChatWindow
        chat={selectedChat}
        messages={messages}
        currentUser={currentUser}
        onSendMessage={handleSendMessage}
        onCall={handleCall}
        wsService={wsService}
      />

      {/* Profile Modal */}
      {showProfile && (
        <ProfileModal
          user={currentUser}
          onClose={() => setShowProfile(false)}
          onLogout={onLogout}
        />
      )}

      {/* Call Modal */}
      {showCall && (
        <CallModal
          chat={selectedChat}
          type={callType}
          onClose={() => setShowCall(false)}
        />
      )}
    </div>
  );
}
