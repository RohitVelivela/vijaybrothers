import React from 'react';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-end items-center shadow-sm">
      <Link href="/admin/edit-profile" className="flex items-center space-x-3 cursor-pointer hover:text-blue-600 transition-colors">
        {user?.profileImageUrl ? (
          <img src={user.profileImageUrl} alt="User Profile" className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <UserCircle className="w-7 h-7 text-gray-600" />
        )}
      </Link>
    </div>
  );
};

export default AdminHeader;
