import React from 'react';
import { Bell, ChevronDown, LogOut, Menu } from 'lucide-react';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
  adminEmail: string;
  currentLanguage: 'en' | 'hi';
  setCurrentLanguage: React.Dispatch<React.SetStateAction<'en' | 'hi'>>;
}


const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onMenuToggle, adminEmail }) => {
  const router = useRouter();

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-white shadow-sm transition-all duration-300 ease-smooth
      ${isSidebarOpen ? 'lg:pl-60' : 'lg:pl-16'}
    `}>

      <div className="flex items-center justify-between h-16 px-6">
        {/* Left section: Menu toggle (visible on small screens) */}
        <div className="flex items-center space-x-4 lg:hidden">
          <button onClick={onMenuToggle} className="text-gray-600 hover:text-gray-900">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        

        {/* Right section: Notifications, User Menu */}
        <div className="flex items-center space-x-4 ml-auto">


          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 focus:outline-none">
                <Image
                  src="/images/logo.png"
                  alt="Profile Image"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="font-medium text-sm text-gray-800">Admin User</span>
                  <span className="text-xs text-gray-500">{adminEmail}</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem onClick={() => router.push('/admin/profile')}>Profile</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
