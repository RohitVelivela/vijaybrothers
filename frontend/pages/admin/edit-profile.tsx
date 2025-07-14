import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminHeader from '../../components/AdminHeader';
import Sidebar from '../../components/ui/Sidebar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { useToast } from '../../components/ui/use-toast';

interface AdminProfile {
  id: number;
  email: string;
  name: string;
  // Add other profile fields as needed
}

const EditProfilePage: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dummy admin email for AdminHeader
  const adminEmail = "admin@vijaybrothers.com";

  useEffect(() => {
    // Simulate fetching admin profile data from backend
    const fetchAdminProfile = async () => {
      setLoading(true);
      try {
        // In a real application, you would make an API call here:
        // const response = await fetch('/api/admin/profile');
        // const data = await response.json();
        // setProfile(data);

        // Using dummy data for now
        setProfile({
          id: 1,
          email: adminEmail,
          name: "Vijay Admin",
        });
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (profile) {
      setProfile({
        ...profile,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      // Simulate updating admin profile data on backend
      // In a real application, you would make an API call here:
      // const response = await fetch('/api/admin/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update profile');
      // }

      toast("Profile updated successfully!");
      // Optionally redirect or refresh data
    } catch (error) {
      console.error("Failed to update admin profile:", error);
      toast.error("Failed to update profile.");
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
    <div className="min-h-screen bg-gray-50">
      
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        activeLink="/admin/dashboard" // Or a specific link for profile if exists
        toggleCollapse={handleMenuToggle}
      />

      <main className={`
        pt-16 transition-all duration-300 ease-smooth
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-6">Edit Profile</h1>

          {loading ? (
            <p>Loading profile...</p>
          ) : profile ? (
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {/* Add more fields as needed, e.g., password change, etc. */}
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
              </form>
            </div>
          ) : (
            <p>Profile data not found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;
