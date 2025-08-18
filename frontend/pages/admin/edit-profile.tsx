import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'sonner';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import Sidebar from '../../components/ui/Sidebar';
import { Camera, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Edit3 } from 'lucide-react';
import { useAuth, getCookie } from '@/context/AuthContext';
import imageCompression from 'browser-image-compression';
import { useForm } from 'react-hook-form';

// Define the type first, based on the expected shape
interface EditProfileFormInputs {
  username: string;
  email: string;
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Simple validation function
const validateForm = (data: EditProfileFormInputs, showPasswordForm: boolean) => {
  const errors: Partial<Record<keyof EditProfileFormInputs, string>> = {};
  
  if (!data.username || data.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.email = 'Please enter a valid email address';
  }
  
  if (showPasswordForm) {
    if (!data.oldPassword) {
      errors.oldPassword = 'Old password is required';
    }
    if (!data.newPassword || data.newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    if (data.newPassword !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return errors;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const EditProfilePage = () => {
  const router = useRouter();
  // toast imported directly from sonner
  const { user, logout, setUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [imageError, setImageError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm<EditProfileFormInputs>({
    mode: 'onSubmit',
    defaultValues: {
      username: user?.name || '',
      email: user?.email || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedUsername = watch('username');
  const { oldPassword, newPassword, confirmPassword } = watch();

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [removeProfileImage, setRemoveProfileImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isChanged, setIsChanged] = useState(false);

  // Populate form fields when user data is available
  useEffect(() => {
    if (user) {
      setValue('username', user.name);
      if (user.profileImageUrl) {
        setProfileImagePreview(user.profileImageUrl);
        setRemoveProfileImage(false);
      } else {
        setProfileImagePreview('/images/default-avatar.png'); // Default placeholder if no image
        setRemoveProfileImage(true);
      }
      // Reset form with user data when user object changes
      reset({
        username: user.name,
        email: user.email,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChanged(false); // Reset changed status
    }
  }, [user, reset, setValue]);

  // Watch for changes in form fields to enable/disable save button
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // Check if any relevant field has changed from its initial value
      const usernameChanged = value.username !== user?.name;
      const emailChanged = value.email !== user?.email;
      const passwordChanged = !!(value.oldPassword || value.newPassword || value.confirmPassword);
      const imageChanged = profileImageFile !== null || removeProfileImage;

      setIsChanged(usernameChanged || emailChanged || passwordChanged || imageChanged);
    });
    return () => subscription.unsubscribe();
  }, [watch, user, profileImageFile, removeProfileImage]);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError('');
    if (!e.target.files || e.target.files.length === 0) {
      setProfileImageFile(null);
      setProfileImagePreview(user?.profileImageUrl || '/images/default-avatar.png'); // Revert to original or default
      setRemoveProfileImage(user?.profileImageUrl ? false : true);
      setIsChanged(true); // Mark as changed if image is cleared
      return;
    }

    const imageFile = e.target.files[0];

    if (!imageFile.type.startsWith('image/')) {
      setImageError('Only image files are allowed.');
      setProfileImageFile(null);
      setProfileImagePreview(user?.profileImageUrl || '/images/default-avatar.png');
      return;
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      setImageError('Image must be under 5MB.');
      setProfileImageFile(null);
      setProfileImagePreview(user?.profileImageUrl || '/images/default-avatar.png');
      return;
    }

    const options = {
      maxSizeMB: 0.5, // (max file size in MB)
      maxWidthOrHeight: 1024, // (max width or height in pixels)
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(imageFile, options);
      setProfileImageFile(compressedFile); // Store the File object
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target?.result as string); // Store base64 for preview
      };
      reader.readAsDataURL(compressedFile);
      setIsChanged(true); // Mark as changed
    } catch (error) {
      toast.error('Failed to compress image.', {
        description: (error as Error).message || 'An unexpected error occurred during image compression.',
      });
      setImageError('Failed to process image.');
      setProfileImageFile(null);
      setProfileImagePreview(user?.profileImageUrl || '/images/default-avatar.png');
    }
  };

  const handleRemovePicture = () => {
    setProfileImageFile(null);
    setProfileImagePreview('/images/default-avatar.png');
    setRemoveProfileImage(true);
    setIsChanged(true);
  };

  const onSubmit = async (data: EditProfileFormInputs) => {
    try {
      console.log('=== onSubmit function called ===');
      console.log('Form submitted with data:', data);
      console.log('Current location:', window.location.href);
      setPasswordError(''); // Clear previous password errors
      clearErrors(); // Clear previous form errors

      // Validate form
      const validationErrors = validateForm(data, showPasswordForm);
      
      // Set errors if any
      if (Object.keys(validationErrors).length > 0) {
        console.log('Validation errors found:', validationErrors);
        Object.entries(validationErrors).forEach(([field, message]) => {
          setError(field as keyof EditProfileFormInputs, { message });
        });
        return;
      }

      console.log('Building FormData...');
      const formData = new FormData();
      formData.append('userName', data.username);
      formData.append('email', data.email);

      if (profileImageFile) {
        formData.append('profileImage', profileImageFile);
      } else if (removeProfileImage) {
        formData.append('removeProfileImage', String(removeProfileImage));
      }

      if (showPasswordForm) {
        if (data.oldPassword) formData.append('oldPassword', data.oldPassword);
        if (data.newPassword) formData.append('newPassword', data.newPassword);
      }
      
      console.log('Calling sendUpdate...');
      await sendUpdate(formData, data);
      console.log('sendUpdate completed without error');
    } catch (error) {
      console.error('Error in onSubmit:', error);
      toast.error('An error occurred: ' + (error as Error).message);
    }
  };

  const sendUpdate = async (formData: FormData, data: EditProfileFormInputs) => {
    try {
      console.log('sendUpdate called, preparing API request...');
      const token = getCookie('token');

      if (!token) {
        console.error('No token found');
        toast.error('Authentication token not found. Please log in again.');
        router.push('/admin/login');
        return;
      }

      console.log('Token found, making API request...');
      
      // First test if backend is reachable
      try {
        const testResponse = await fetch('http://localhost:8080/api/admin/profile', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Backend test - GET /api/admin/profile status:', testResponse.status);
      } catch (error) {
        console.log('Backend test failed:', error instanceof Error ? error.message : String(error));
      }

      // Note: We don't need user.id for the profile endpoint since it uses current admin from token
      console.log('Current user:', user);

      console.log('Making fetch request to /api/admin/profile...');
      console.log('Request body FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value);
      }
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('API request timed out after 10 seconds');
        controller.abort();
      }, 10000); // 10 second timeout
      
      let response;
      try {
        response = await fetch(`http://localhost:8080/api/admin/profile`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('Response received:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
          throw new Error(errorData.message || 'Failed to update profile');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out - please check if the backend server is running');
        }
        throw error;
      }

      const responseData = await response.json();
      console.log('Success response data:', responseData);
      console.log('Response contains:');
      console.log('- token:', !!responseData.token);
      console.log('- message:', responseData.message);
      console.log('- profileImageUrl:', responseData.profileImageUrl);
      
      // If a new token is provided, update it
      if (responseData.token) {
        console.log('New token received, updating cookie...');
        document.cookie = `token=${responseData.token}; path=/; max-age=3600`;
      } else {
        console.log('No token in response!');
      }
      
      // Show success message
      console.log('Showing success toast...');
      const successMessage = responseData.message || 'Profile updated successfully!';
      toast.success(successMessage);
      
      // Show beautiful success modal
      setShowSuccessModal(true);

      // Update AuthContext user state with new profile information
      console.log('Updating user context...');
      if (user) {
        setUser({
          ...user,
          name: data.username,
          email: data.email,
          profileImageUrl: responseData.profileImageUrl !== undefined ? responseData.profileImageUrl : user.profileImageUrl,
        });
      }
      setIsEditing(false);
      setIsChanged(false);
      setProfileImageFile(null); // Clear file input after successful upload
      clearErrors(); // Clear form errors
      reset({ // Reset form fields, especially passwords
        username: data.username,
        email: data.email,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordError(''); // Clear password error
      console.log('Profile update completed successfully!');
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile: ' + (error.message || 'An unexpected error occurred.'));
      if (showPasswordForm) {
        setPasswordError(error.message || 'An unexpected error occurred.');
      }
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit)(e);
                }} className="space-y-6">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" {...register('username')} disabled={!isEditing} />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      {...register('email')}
                      disabled={!isEditing}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="removeProfileImage"
                      checked={removeProfileImage}
                      onChange={(e) => handleRemovePicture()}
                      className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                    />
                    <Label htmlFor="removeProfileImage">Remove Profile Image</Label>
                  </div>

                  <details
                    open={showPasswordForm}
                    onToggle={(e) => setShowPasswordForm((e.target as HTMLDetailsElement).open)}
                    className="shadow-sm rounded-md p-4 bg-gray-50 border border-gray-200"
                  >
                    <summary className="cursor-pointer font-medium text-gray-700 flex items-center">
                      <Lock className="w-5 h-5 text-gray-500 mr-2" />
                      {showPasswordForm ? 'Hide Password Change' : 'Change Password'}
                    </summary>

                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="oldPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword.old ? 'text' : 'password'}
                            id="oldPassword"
                            {...register('oldPassword')}
                            disabled={!isEditing}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, old: !prev.old }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword.new ? 'text' : 'password'}
                            id="newPassword"
                            {...register('newPassword')}
                            disabled={!isEditing}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <div className="relative">
                          <Input
                            type={showPassword.confirm ? 'text' : 'password'}
                            id="confirmPassword"
                            {...register('confirmPassword')}
                            disabled={!isEditing}
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                      </div>
                      {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                    </div>
                  </details>

                  <div className="flex justify-end space-x-3 mt-6">
                    {!isEditing && (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    )}
                    {isEditing && (
                      <>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setIsChanged(false);
                            setProfileImageFile(null);
                            setProfileImagePreview(user?.profileImageUrl || '/images/default-avatar.png');
                            setRemoveProfileImage(user?.profileImageUrl ? false : true);
                            clearErrors();
                            reset({
                              username: user?.name || '',
                              email: user?.email || '',
                              oldPassword: '',
                              newPassword: '',
                              confirmPassword: '',
                            });
                            setShowPasswordForm(false);
                            setPasswordError('');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="button"
                          onClick={(e) => {
                            console.log('Save Changes button clicked!');
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('About to call handleSubmit...');
                            handleSubmit(onSubmit)();
                          }}
                          disabled={!isEditing || !isChanged || !!imageError || (showPasswordForm && (!!errors.oldPassword || !!errors.newPassword || !!errors.confirmPassword || !!passwordError))}
                        >
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                </form>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-40 h-40 rounded-full overflow-hidden shadow-lg">
                  <Image src={profileImagePreview || '/images/default-avatar.png'} alt="Profile" fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  <label htmlFor="profileImage" className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                    <Camera size={32} />
                  </label>
                  <Input id="profileImage" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </div>
                {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Profile Updated Successfully!
            </h3>
            
            {/* Message */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Your profile information has been updated successfully. All changes have been saved to your account.
            </p>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setIsEditing(false);
                }}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Continue
              </button>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-t-2xl"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;