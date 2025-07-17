import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useToast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import Sidebar from '../../components/ui/Sidebar';
import { Camera } from 'lucide-react';
import { useAuth, getCookie } from '@/context/AuthContext';
import imageCompression from 'browser-image-compression';

const EditProfilePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, logout, setUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Populate form fields when user data is available
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.profileImageUrl) {
        setProfileImagePreview(user.profileImageUrl);
      } else {
        setProfileImagePreview('/images/default-avatar.png'); // Default placeholder if no image
      }
    }
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setProfileImage(null);
      setProfileImagePreview(user?.profileImageUrl || '/images/default-avatar.png'); // Revert to current or default
      return;
    }

    const imageFile = e.target.files[0];

    const options = {
      maxSizeMB: 0.5, // (max file size in MB)
      maxWidthOrHeight: 1024, // (max width or height in pixels)
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      setProfileImage(compressedFile); // Store the File object
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target?.result as string); // Store base64 for preview
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast('Failed to compress image.', {
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isPasswordChanged = newPassword.length > 0 || currentPassword.length > 0 || confirmPassword.length > 0;

    if (isPasswordChanged && newPassword !== confirmPassword) {
      toast('New password and confirm password do not match.', {
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('user_name', name);
    formData.append('user_email', email);
    formData.append('is_password_changed', `${isPasswordChanged}`);

    if (isPasswordChanged) {
      formData.append('old_password', currentPassword);
      formData.append('new_password', newPassword);
    }

    // Image handling for FormData
    if (profileImage) { // Case 1: New image selected (profileImage is a File object)
      formData.append('user_image', profileImage);
    } else if (user?.profileImageUrl && (profileImagePreview === null || profileImagePreview === '/images/default-avatar.png')) {
      // Case 2: Image explicitly cleared (user had an image, but now preview is null or default)
      formData.append('clear_image', 'true');
    }
    // Case 3: Image not changed - do nothing, backend retains existing image

    try {
      const token = getCookie('token');

      if (!token) {
        toast('Authentication token not found. Please log in again.', {
          variant: 'destructive',
        });
        router.push('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:8080/api/admin/account', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const responseData = await response.json();
      toast(responseData.message || 'Profile updated successfully!');

      // Update AuthContext user state with new profile image URL
      if (user && responseData.user_image !== undefined) {
        setUser({
          ...user,
          profileImageUrl: responseData.user_image,
        });
      }

    } catch (error: any) {
      toast(error.message || 'Failed to update profile.', {
        variant: 'destructive',
      });
    }
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
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-60'} overflow-y-auto h-screen`}>
        <main className="p-6">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center">
              <Image src="/VB logo white back.png" alt="Vijay Brothers Logo" width={180} height={180} priority />
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
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md" onClick={handleSubmit}>
                    Save Changes
                  </button>
                </form>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg">
                  <Image src={profileImagePreview || '/images/logo.png'} alt="Profile" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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