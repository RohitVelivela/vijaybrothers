'use client';



import Sidebar from '../../components/ui/Sidebar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ChevronDown, Search, PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

import React, { useState, useEffect, useMemo, ChangeEvent } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, Category } from '../../lib/api';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

import AdminHeader from '../../components/AdminHeader';

export default function CategoriesPage() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  // ─── State ─────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]       = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortColumn, setSortColumn] = useState<keyof Category>('name');

  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categoriesPerPage] = useState(5);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [isModalOpen, setIsModalOpen]     = useState<boolean>(false);
  const [newName, setNewName]             = useState<string>('');
  const [newSlug, setNewSlug]             = useState<string>('');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newParentId, setNewParentId] = useState<number | undefined>(undefined);
  const [newIsActive, setNewIsActive] = useState<boolean>(true);
  const [newPosition, setNewPosition] = useState<number>(0);
  const [newDisplayOrder, setNewDisplayOrder] = useState<number>(0);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImageUrl, setNewImageUrl] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      console.log("Fetched categories data:", data); // Add this line for debugging
      setCategories(data);
    } catch (err) {
      setCategories([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);


  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(cat => cat.name === filterCategory);
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } 
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
  }, [categories, searchTerm, filterCategory, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);

  const paginate = (pageNumber: number | string) => {
    let pageNum: number;
    if (typeof pageNumber === 'string') {
      pageNum = parseInt(pageNumber, 10);
    } else {
      pageNum = pageNumber;
    }
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleSort = (column: keyof Category) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const uniqueCategoryNames = useMemo(() => {
    const names = categories.map(cat => cat.name);
    return ['All', ...Array.from(new Set(names))];
  }, [categories]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setNewName('');
    setNewSlug('');
    setNewDescription('');
    setNewParentId(undefined);
    setNewIsActive(true);
    setNewPosition(0);
    setNewDisplayOrder(0);
    setNewImageFile(null);
    setNewImageUrl(null);
    openModal();
  };

  const handleEditCategory = (id: number) => {
    const categoryToEdit = categories.find(cat => cat.categoryId === id);
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      setNewName(categoryToEdit.name);
      setNewSlug(categoryToEdit.slug);
      setNewDescription(categoryToEdit.description);
      setNewParentId(categoryToEdit.parentId);
      setNewIsActive(categoryToEdit.isActive);
      setNewPosition(categoryToEdit.position);
      setNewImageUrl(categoryToEdit.categoryImage || null);
      setNewImageFile(null);
      setIsModalOpen(true);
    }
  };

  const handleDeleteCategory = async (id: number) => {
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
        await deleteCategory(id);
        loadCategories();
        Swal.fire(
          'Deleted!',
          'Your category has been deleted.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'Error!',
          (err as Error).message,
          'error'
        );
      }
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const openModal = () => {
    setNewName('');
    setNewSlug('');
    setNewDescription('');
    setNewParentId(undefined);
    setNewIsActive(true);
    setNewPosition(0);
    setNewDisplayOrder(0);
    setNewImageFile(null);
    setNewImageUrl(null);
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const saveCategory = async () => {
    try {
      if (!newName || !newSlug) {
        alert('Name and slug are required.');
        return;
      }

      const formData = new FormData();
      formData.append('name', newName.trim());
      formData.append('slug', newSlug.trim());
      formData.append('description', newDescription);
      if (newParentId) formData.append('parentId', newParentId.toString());
      formData.append('isActive', newIsActive.toString());
      formData.append('position', newPosition.toString());
      formData.append('displayOrder', newDisplayOrder.toString());
      if (newImageFile) {
        console.log("newImageFile before FormData append:", newImageFile);
        formData.append('image', newImageFile);
      } else if (editingCategory && newImageUrl === null) {
        formData.append('clearImage', 'true');
      }

      console.log("Sending FormData:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, formData);
      } else {
        await createCategory(formData);
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewImageFile(file);
      setNewImageUrl(URL.createObjectURL(file)); // Create a preview URL
    }
  };


  const menuItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', link: '/admin/dashboard-overview' },
    { name: 'Orders', icon: 'ShoppingCart', link: '/admin/orders' },
    { name: 'Products', icon: 'Package', link: '/admin/product-management' },
    { name: 'Categories', icon: 'ListFilter', link: '/admin/categories' },
    { name: 'Banners', icon: 'Settings', link: '/admin/banners' },
  ];

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <Sidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} activeLink="Categories" toggleCollapse={handleMenuToggle} />

      <main className={`
        pt-16 transition-all duration-300 ease-smooth
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-800">Categories</h1>
              <p className="text-gray-600 mt-1">
                Manage your categories, add new categories, and update existing ones.
              </p>
            </div>
            <Button onClick={handleAddCategory} className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-4 py-2 flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Category
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-between md:justify-start">
                  Category: {filterCategory}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {uniqueCategoryNames.map(name => (
                  <DropdownMenuItem key={name} onClick={() => setFilterCategory(name)}>
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </div>

          {/* Categories Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('categoryId')}>Category ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>Name</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('slug')}>Slug</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('parentName')}>Parent Category</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('isActive')}>Active</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('position')}>Position</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentCategories.map((category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell className="font-medium">{category.categoryId}</TableCell>
                    <td className="py-2 pl-1 border-b text-left">
                {category.categoryImage && (
                  <img 
                    src={`http://localhost:8080${category.categoryImage}`} 
                    alt={category.name} 
                    className="w-32 h-32 object-cover rounded block mr-auto" 
                  />
                )}
              </td>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>{category.parentName || '-'}</TableCell>
                    <TableCell>{category.isActive ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{category.position}</TableCell>
                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditCategory(category.categoryId)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteCategory(category.categoryId)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {currentCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 p-4">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-gray-600 text-sm">
              Showing {indexOfFirstCategory + 1} - {Math.min(indexOfLastCategory, filteredCategories.length)} of {filteredCategories.length} categories
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    onClick={() => paginate(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Edit the details for this category.' : 'Fill in the details for the new category. Slug should be unique.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <Input
                  id="categoryName"
                  placeholder="e.g., Banarasi Sarees (e.g., Party Wear Sarees)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="categorySlug" className="block text-sm font-medium text-gray-700 mb-1">Category Slug</label>
                <Input
                  id="categorySlug"
                  placeholder="e.g., banarasi-sarees (unique, lowercase, no spaces)"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  id="categoryDescription"
                  placeholder="A brief description of the category (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
              </div>
              <div>
                <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-1">Category Image</label>
                <Input
                  id="categoryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                />
                {newImageUrl && (
                  <div className="mt-2">
                    <img src={newImageUrl} alt="Category Preview" className="w-32 h-32 object-cover rounded-md" />
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="parentCategory" className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select
                  id="parentCategory"
                  value={newParentId === undefined ? '' : newParentId}
                  onChange={(e) => setNewParentId(e.target.value === '' ? undefined : Number(e.target.value))}
                  className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white text-gray-800"
                >
                  <option value="">-- Select Parent Category (Leave blank for main category) --</option>
                  {categories.filter(cat => cat.categoryId !== editingCategory?.categoryId).map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                  className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
              </div>
              {newIsActive && (
                <>
                  <div>
                    <label htmlFor="categoryPosition" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <Input
                      id="categoryPosition"
                      type="number"
                      value={newPosition}
                      onChange={(e) => setNewPosition(Number(e.target.value))}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="categoryDisplayOrder" className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <Input
                      id="categoryDisplayOrder"
                      type="number"
                      value={newDisplayOrder}
                      onChange={(e) => setNewDisplayOrder(Number(e.target.value))}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                </>
              )}
            </div>
              
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={saveCategory}>{editingCategory ? 'Update Category' : 'Save Category'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
