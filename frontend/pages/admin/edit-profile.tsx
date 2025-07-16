import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useToast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/ui/Sidebar';
import { Camera } from 'lucide-react';

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [name, setName] = useState('Vijay Admin');
  const [email, setEmail] = useState('admin@vijaybrothers.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>('/images/logo.png');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New password and confirm password do not match.',
        variant: 'destructive',
      });
      return;
    }
    // Handle profile update logic here
    toast({
      title: 'Success',
      description: 'Profile updated successfully!',
    });
  };

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(prevState => !prevState);
    } else {
      setIsSidebarOpen(prevState => !prevState);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        activeLink="/admin/edit-profile"
        toggleCollapse={handleMenuToggle}
      />
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'}`}>
        <AdminHeader adminEmail={email} />
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div class="flex items-center justify-between">
              <Image src="/VB logo white back.png" alt="Vijay Brothers Logo" width={150} height={150} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Username</Label>
                    <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="currentPassword">Old Password</Label>
                    <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Save Changes
                  </Button>
                </form>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg">
                  <Image src={profileImage || '/images/default-avatar.png'} alt="Profile" layout="fill" objectFit="cover" />
                  <label htmlFor="profileImage" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={32} />
                  </label>
                  <Input id="profileImage" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
                <Button variant="outline" onClick={() => document.getElementById('profileImage')?.click()}>
                  Change Picture
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditProfilePage;