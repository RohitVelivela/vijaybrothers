'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Camera, Save, ArrowLeft, Edit3, Lock, Eye, EyeOff } from 'lucide-react';
import { getCookie } from '@/context/AuthContext';

interface ProfileData {
  user_name: string;
  user_email: string;
  user_image: string;
  is_password_changed: boolean;
  old_password?: string;
  new_password?: string;
}

const EditProfile: React.FC = () => {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    user_name: '',
    user_email: '',
    user_image: '',
    is_password_changed: false,
    old_password: '',
    new_password: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = getCookie('token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:8080/api/admin/account', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({
            ...prev,
            user_name: data.user_name,
            user_email: data.user_email,
            user_image: data.user_image || '',
          }));
        } else {
        }
      } catch (error) {
      }
    };

    fetchProfileData();
  }, [router]);

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileData(prev => ({
            ...prev,
            user_image: reader.result as string // Store the full data URL for preview
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a JPG or PNG image.');
        event.target.value = '';
      }
    }
  };

  const handleSave = async () => {
    const token = getCookie('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const payload: any = {
      user_name: profileData.user_name,
      user_email: profileData.user_email,
    };

    if (profileData.user_image && profileData.user_image.startsWith('data:')) {
      payload.user_image = profileData.user_image.split(',')[1];
    } else if (profileData.user_image) {
      payload.user_image = profileData.user_image;
    }

    if (profileData.is_password_changed) {
      payload.old_password = profileData.old_password;
      payload.new_password = profileData.new_password;
    }

    try {
      const response = await fetch('http://localhost:8080/api/admin/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Profile updated successfully:', result);
        setProfileData(prev => ({ ...prev, user_image: result.user_image || prev.user_image }));
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        console.error('Failed to update profile:', result);
        alert(`Failed to update profile: ${result.message || 'An unknown error occurred.'}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving the profile.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => router.push('/admin/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-500">Manage your account information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isEditing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Edit3 className="w-4 h-4 inline mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* Profile Picture Section */}
            <div className="flex items-center justify-center mb-8 pb-6 border-b">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                  {profileData.user_image ? (
                    <img 
                      src={profileData.user_image.startsWith('data:') ? profileData.user_image : `data:image/jpeg;base64,${profileData.user_image}`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12" />
                  )}
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="profileImageUpload"
                      accept=".jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <label
                      htmlFor="profileImageUpload"
                      className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-2.5 shadow-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </label>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-2" />
                  Basic Information
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profileData.user_name}
                    onChange={(e) => handleInputChange('user_name', e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                      isEditing 
                        ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={profileData.user_email}
                      onChange={(e) => handleInputChange('user_email', e.target.value)}
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-colors ${
                        isEditing 
                          ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-2" />
                  Security
                </h3>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="changePassword"
                    checked={profileData.is_password_changed}
                    onChange={(e) => handleInputChange('is_password_changed', e.target.checked)}
                    disabled={!isEditing}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                    Change Password
                  </label>
                </div>

                {profileData.is_password_changed && (
                  <div className="space-y-4 pl-7">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          value={profileData.old_password}
                          onChange={(e) => handleInputChange('old_password', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={profileData.new_password}
                          onChange={(e) => handleInputChange('new_password', e.target.value)}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 pr-10 border rounded-lg transition-colors ${
                            isEditing 
                              ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                              : 'border-gray-200 bg-gray-50'
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
