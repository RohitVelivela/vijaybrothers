import React from 'react';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const AdminHeader: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-end items-center shadow-sm">
      <Link href="/admin/edit-profile" className="flex items-center space-x-3 cursor-pointer hover:text-blue-600 transition-colors">
        <UserCircle className="w-7 h-7 text-gray-600" />
        <span className="font-medium text-gray-700 text-lg">{user ? user.email : ''}</span>
      </Link>
    </div>
  );
};

export default AdminHeader;
