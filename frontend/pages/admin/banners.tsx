// ✅ Updated Banners Page: Matches Product Page layout exactly
'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';


import { Input } from '../../components/ui/input';
import Header from '../../components/ui/Header';
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

interface Banner {
  id: number;
  imageUrl: string;
  linkTo: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

const dummyBanners: Banner[] = [
  {
    id: 1,
    imageUrl: 'https://cdn.vijaybrothers.com/banners/pattu.jpg',
    linkTo: '/collections/pattu',
    status: 'ACTIVE',
    createdAt: '2025-07-05T10:00:00Z',
    updatedAt: '2025-07-05T12:00:00Z',
  },
  {
    id: 2,
    imageUrl: 'https://cdn.vijaybrothers.com/banners/bridal.jpg',
    linkTo: '/collections/bridal',
    status: 'INACTIVE',
    createdAt: '2025-06-29T08:00:00Z',
    updatedAt: '2025-07-01T09:00:00Z',
  },
];

const BannersPage = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en'); // Add state for currentLanguage

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(prevState => !prevState);
    } else {
      setIsSidebarOpen(prevState => !prevState);
    }
  };
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(dummyBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [linkTo, setLinkTo] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const filteredBanners = useMemo(() => {
    let data = banners;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(b => b.imageUrl.toLowerCase().includes(term) || b.linkTo.toLowerCase().includes(term));
    }
    if (filterStatus !== 'ALL') {
      data = data.filter(b => b.status === filterStatus);
    }
    return data;
  }, [banners, searchTerm, filterStatus]);

  const handleToggleStatus = (id: number) => {
    setBanners(prev =>
      prev.map(b => b.id === id ? { ...b, status: b.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : b)
    );
  };

  const handleDeleteBanner = (id: number) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      setBanners(prev => prev.filter(b => b.id !== id));
      toast('Deleted', { description: 'Banner removed successfully' });
    }
  };

  const handleSaveBanner = () => {
    if (!imageUrl || !linkTo) return alert('All fields required');
    const newBanner: Banner = {
      id: editingBanner ? editingBanner.id : Math.max(0, ...banners.map(b => b.id)) + 1,
      imageUrl,
      linkTo,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBanners(prev => editingBanner ? prev.map(b => (b.id === newBanner.id ? newBanner : b)) : [...prev, newBanner]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        onMenuToggle={handleMenuToggle}
        isSidebarOpen={isSidebarOpen}
        adminEmail="admin@vijaybrothers.com"
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />
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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 flex items-center" onClick={() => {
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
                  <TableHead className="w-[160px]">Image URL</TableHead>
                  <TableHead className="w-[400px]">Target Page</TableHead>
                  <TableHead className="w-[140px]">Status</TableHead>
                  <TableHead className="text-right w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBanners.map(b => (
                  <TableRow key={b.id}>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{b.imageUrl}</TableCell>
                    <TableCell className="truncate max-w-[320px]">{b.linkTo}</TableCell>
                    <TableCell>
                      <span onClick={() => handleToggleStatus(b.id)} className={`cursor-pointer px-2 py-1 text-xs font-medium rounded-full ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                        {b.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingBanner(b);
                          setImageUrl(b.imageUrl);
                          setLinkTo(b.linkTo);
                          setStatus(b.status);
                          setIsModalOpen(true);
                        }}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteBanner(b.id)}>
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingBanner ? 'Edit Banner' : 'New Banner'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">Image</Label>
                  <Input id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="linkTo" className="text-right">Target Page</Label>
                  <Input id="linkTo" value={linkTo} onChange={e => setLinkTo(e.target.value)} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as 'ACTIVE' | 'INACTIVE')}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Status" />
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