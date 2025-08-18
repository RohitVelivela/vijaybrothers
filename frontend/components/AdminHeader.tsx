import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BellIcon from './BellIcon';
import NotificationPopup from './NotificationPopup';
import { ContactMessage, fetchContactMessages, markMessageAsRead } from '@/lib/api';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const unread = await fetchContactMessages(true);
        setUnreadCount(unread.length);
      } catch (error) {

      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    try {
      const allMessages = await fetchContactMessages(false);
      setMessages(allMessages);
      setShowPopup(true);
    } catch (error) {

    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isRead: true } : msg));
      setUnreadCount(prev => prev - 1);
    } catch (error) {

    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
      <div className="ml-auto flex items-center space-x-3">
        <BellIcon count={unreadCount} onClick={handleBellClick} />
        <Link href="/admin/edit-profile" className="cursor-pointer hover:text-blue-600 transition-colors">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="User Profile" className="w-[30px] h-[30px] rounded-full object-cover" />
          ) : (
            <UserCircle className="w-[30px] h-[30px] text-gray-600" />
          )}
        </Link>
      </div>
      {showPopup && (
        <NotificationPopup 
          messages={messages} 
          onMarkRead={handleMarkRead} 
          onClose={handleClosePopup} 
        />
      )}
    </div>
  );
};

export default AdminHeader;
