import React, { useState, useRef } from 'react';
import { User, Mail, Camera, Save, ArrowLeft, Edit3, Lock, Eye, EyeOff, UploadCloud } from 'lucide-react';

interface ProfileData {
  user_name: string;
  user_email: string;
  user_image: string;
  is_password_changed: boolean;
  old_password: string;
  new_password: string;
}

const EditProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    user_name: 'Admin User',
    user_email: 'admin@vijaybrothers.com',
    user_image: '',
    is_password_changed: false,
    old_password: '',
    new_password: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        // By default, we don't set the user_image to the base64 string to avoid large state
        // This should be handled by an upload function that returns a URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Map frontend field names to backend field names
      const updateRequest = {
        userName: profileData.user_name,
        email: profileData.user_email,
        oldPassword: profileData.is_password_changed ? profileData.old_password : undefined,
        newPassword: profileData.is_password_changed ? profileData.new_password : undefined
      };

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateRequest)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile: ${errorText}`);
      }
      
      const data = await response.json();
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Edit Profile</h1>
                <p className="text-sm text-gray-500">Update your profile and security settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center justify-center px-4 py-2 rounded-md font-semibold text-sm transition-all duration-200 ${
                  isEditing 
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button 
                  onClick={handleSave}
                  className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md font-semibold text-sm shadow-sm hover:from-green-600 hover:to-green-700 transition-all duration-200"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:space-x-8 mb-10 pb-8 border-b border-gray-200">
              <div className="relative mb-6 md:mb-0">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile Preview" className="w-full h-full object-cover rounded-full" />
                  ) : profileData.user_image ? (
                    <img src={profileData.user_image} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    getInitials(profileData.user_name)
                  )}
                </div>
                {isEditing && (
                  <>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-blue-600" />
                    </button>
                  </>
                )}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800">{profileData.user_name}</h2>
                <p className="text-gray-500 mt-1">{profileData.user_email}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 mt-3">
                  Administrator
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-8">
                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                    <User className="w-6 h-6 text-blue-500 mr-3" />
                    Basic Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.user_name}
                        onChange={(e) => handleInputChange('user_name', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border rounded-lg transition-colors text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.user_email}
                          onChange={(e) => handleInputChange('user_email', e.target.value)}
                          disabled={!isEditing}
                          placeholder="Enter your email address"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg transition-colors text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
                    <Lock className="w-6 h-6 text-blue-500 mr-3" />
                    Security Settings
                  </h3>
                  <div className="flex items-center space-x-3 mb-6">
                    <input
                      type="checkbox"
                      id="changePassword"
                      checked={profileData.is_password_changed}
                      onChange={(e) => handleInputChange('is_password_changed', e.target.checked)}
                      disabled={!isEditing}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 disabled:cursor-not-allowed"
                    />
                    <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                      I want to change my password
                    </label>
                  </div>

                  {profileData.is_password_changed && (
                    <div className="space-y-6 pl-8 border-l-2 border-blue-200">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? "text" : "password"}
                            value={profileData.old_password}
                            onChange={(e) => handleInputChange('old_password', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 pr-10 border rounded-lg transition-colors text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={profileData.new_password}
                            onChange={(e) => handleInputChange('new_password', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-4 py-2 pr-10 border rounded-lg transition-colors text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-3">Profile Completion</h4>
                  <div className="w-full bg-blue-200 rounded-full h-2.5 mb-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <p className="text-sm text-blue-700">Your profile is 85% complete. Add a profile picture to complete it.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;