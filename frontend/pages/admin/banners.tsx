// ✅ Updated Banners Page: Matches Product Page layout exactly
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

import { Input } from '../../components/ui/input';

import Sidebar from '../../components/ui/Sidebar';
import { Button } from '../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useToast } from '../../components/ui/use-toast';
import { fetchBanners, createBanner, updateBanner, deleteBanner, Banner } from '../../lib/api';
import AdminHeader from '../../components/AdminHeader';

const BannersPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerName, setBannerName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [linkTo, setLinkTo] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const handleMenuToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const filteredBanners = useMemo(() => {
    let data = banners;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(b => b.image.toLowerCase().includes(term) || b.linkTo.toLowerCase().includes(term));
    }
    if (filterStatus !== 'ALL') {
      data = data.filter(b => b.status === filterStatus);
    }
    return data;
  }, [banners, searchTerm, filterStatus]);

  const loadBanners = async () => {
    try {
      const data = await fetchBanners();
      setBanners(data);
    } catch (error) {
      console.error("Failed to fetch banners:", error);
      toast.error("Failed to load banners.");
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleToggleStatus = async (id: number) => {
    const bannerToUpdate = banners.find(b => b.bannerId === id);
    if (!bannerToUpdate) return;

    const newStatus = bannerToUpdate.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateBanner({ bannerId: id, status: newStatus });
      setBanners(prev =>
        prev.map(b => b.bannerId === id ? { ...b, status: newStatus } : b)
      );
      toast.success("Banner status updated.");
    } catch (error) {
      console.error("Failed to update banner status:", error);
      toast.error("Failed to update banner status.");
    }
  };

  const handleDeleteBanner = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteBanner(id);
        setBanners(prev => prev.filter(b => b.bannerId !== id));
        Swal.fire(
          'Deleted!',
          'Your banner has been deleted.',
          'success'
        );
      } catch (error) {
        console.error("Failed to delete banner:", error);
        Swal.fire(
          'Error!',
          `Failed to delete banner: ${(error as Error).message}`,
          'error'
        );
      }
    }
  };

  const handleSaveBanner = async () => {
    if (!bannerName || !imageUrl || !linkTo) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner({
          bannerId: editingBanner.bannerId,
          name: bannerName,
          image: imageUrl,
          linkTo,
          status,
        });
        toast.success("Banner updated successfully.");
      } else {
        await createBanner({
          image: imageUrl,
          linkTo: linkTo,
        });
        toast.success("Banner created successfully.");
      }
      setIsModalOpen(false);
      loadBanners(); // Reload banners after save
    } catch (error) {
      console.error("Failed to save banner:", error);
      toast.error(`Failed to save banner: ${(error as Error).message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader adminEmail="admin@vijaybrothers.com" />
      <Sidebar 
        isOpen={isSidebarOpen} 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={handleMenuToggle} 
        activeLink="Banners" 
      />
      
      

      <main className="pt-16 transition-all duration-300 ease-smooth lg:ml-60">
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-800">Banners</h1>
              <p className="text-gray-600 mt-1">Manage your banners, add new banners, and update existing ones.</p>
            </div>
            <Button onClick={() => {
              setEditingBanner(null);
              setImageUrl('');
              setLinkTo('');
              setStatus('ACTIVE');
              setIsModalOpen(true);
            }}>
              <Plus className="h-5 w-5 mr-2" /> Add Banner
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
            <Input
              type="text"
              placeholder="Search banners..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full md:w-1/3"
            />
            <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'ALL' | 'ACTIVE' | 'INACTIVE')}>
              <SelectTrigger className="min-w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead className="w-[200px]">Image</TableHead>
                  <TableHead className="w-[400px]">Target Page</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="text-right w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map(b => (
                  <TableRow key={b.bannerId}>
                    <TableCell>{b.bannerId}</TableCell>
                    <TableCell><img src={b.image} alt="Banner" className="w-24 h-auto object-cover rounded-md" /></TableCell>
                    <TableCell className="truncate max-w-[320px]">{b.linkTo}</TableCell>
                    <TableCell>
                      <span onClick={() => handleToggleStatus(b.bannerId)} className={`cursor-pointer px-2 py-1 text-xs font-medium rounded-full ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                        {b.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingBanner(b);
                          setBannerName(b.name);
                          setImageUrl(b.image);
                          setLinkTo(b.linkTo);
                          setStatus(b.status);
                          setIsModalOpen(true);
                        }}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(b.bannerId)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</DialogTitle>
                <DialogDescription>
                  {editingBanner ? 'Edit the details for this banner.' : 'Fill in the details for the new banner.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="bannerName" className="block text-sm font-medium text-gray-700 mb-1">Banner Name</Label>
                  <Input id="bannerName" value={bannerName} onChange={e => setBannerName(e.target.value)} placeholder="e.g., Summer Sale Banner" className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800" />
                </div>
                <div>
                  <Label htmlFor="bannerFile" className="block text-sm font-medium text-gray-700 mb-1">Image Upload</Label>
                  <Input 
                    id="bannerFile" 
                    type="file" 
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const img = new Image();
                          img.onload = () => {
                            if (img.width === 1915 && img.height >= 480 && img.height <= 500) {
                              setBannerFile(file);
                              setImageUrl(reader.result as string);
                              toast.success("Image dimensions are valid.");
                            } else {
                              setBannerFile(null);
                              setImageUrl('');
                              toast.error(`Invalid image dimensions. Expected: 1915px width, 480-500px height. Got: ${img.width}px width, ${img.height}px height.`);
                            }
                          };
                          img.src = reader.result as string;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                  />
                </div>
                {imageUrl && (
                  <div>
                    <Label className="block text-sm font-medium text-gray-700 mb-1">Preview</Label>
                    <img src={imageUrl} alt="Banner Preview" className="w-32 h-auto object-cover rounded-md" />
                  </div>
                )}
                <div>
                  <Label htmlFor="linkTo" className="block text-sm font-medium text-gray-700 mb-1">Target Page Link</Label>
                  <Input id="linkTo" value={linkTo} onChange={e => setLinkTo(e.target.value)} placeholder="e.g., /collections/new-arrivals" className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800" />
                </div>
                <div>
                  <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as 'ACTIVE' | 'INACTIVE')}>
                    <SelectTrigger className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-800">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveBanner}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default BannersPage;