import React from 'react';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';

interface AdminHeaderProps {
  adminEmail: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ adminEmail }) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4 flex justify-end items-center shadow-sm">
      <Link href="/admin/edit-profile" className="flex items-center space-x-3 cursor-pointer hover:text-blue-600 transition-colors">
        <UserCircle className="w-7 h-7 text-gray-600" />
        <span className="font-medium text-gray-700 text-lg">{adminEmail}</span>
      </Link>
    </div>
  );
};

export default AdminHeader;
