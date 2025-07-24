import React, { useState, useEffect } from 'react';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import BellIcon from './BellIcon';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
      <Link href="/admin/edit-profile" className="ml-auto flex items-center space-x-3 cursor-pointer hover:text-blue-600 transition-colors">
        <BellIcon />
        {user?.profileImageUrl ? (
          <img src={user.profileImageUrl} alt="User Profile" className="w-[30px] h-[30px] rounded-full object-cover" />
        ) : (
          <UserCircle className="w-[30px] h-[30px] text-gray-600" />
        )}
      </Link>
    </div>
  );
};

export default AdminHeader;
