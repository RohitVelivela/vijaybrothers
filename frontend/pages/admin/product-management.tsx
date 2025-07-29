'use client';


import Sidebar from '../../components/ui/Sidebar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ChevronDown, Search, PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

import React, { useState, useEffect, useMemo, ChangeEvent, useCallback, useRef } from 'react';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  fetchCategories,
  Product,
  Category,
  Page
} from '../../lib/api';


import AdminHeader from '../../components/AdminHeader';

export default function ProductsPage() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'hi'>('en');
  // ─── State ─────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortColumn, setSortColumn] = useState<keyof Product>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showDeleted, setShowDeleted] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // 1-indexed for UI
  const [productsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form state
  const [newName, setNewName] = useState('');
  const [newProductCode, setNewProductCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newStockQuantity, setNewStockQuantity] = useState(0);
  const [newYoutubeLink, setNewYoutubeLink] = useState('');
  const [newImages, setNewImages] = useState<(File | { id: number; imageUrl: string; isMain: boolean })[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [newColor, setNewColor] = useState(''); // New state for color
  const [newFabric, setNewFabric] = useState(''); // New state for fabric
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryId, setNewCategoryId] = useState<number | undefined>(undefined);

  const loadProducts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const categoryId = filterCategory === 'All' ? undefined : categories.find(cat => cat.name === filterCategory)?.categoryId;
      const sortString = `${sortColumn},${sortDirection}`;
      
      console.log('loadProducts: Calling fetchProducts with:', {
        page: page - 1,
        productsPerPage,
        categoryId,
        searchTerm,
        sortString,
        showDeleted
      });

      const data: Page<Product> = await fetchProducts(page - 1, productsPerPage, categoryId, searchTerm, sortString, showDeleted);
      console.log('loadProducts: Received data from fetchProducts:', data);

      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      
      Swal.fire('Error!', 'Failed to load products.', 'error');
      setProducts([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [productsPerPage, showDeleted, filterCategory, searchTerm, sortColumn, sortDirection, categories]);

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage, showDeleted, loadProducts]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setCategories([]);
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

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(prod =>
        prod.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'All') {
      filtered = filtered.filter(prod => prod.category?.name === filterCategory);
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
  }, [products, searchTerm, filterCategory, sortColumn, sortDirection]);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSort = (column: keyof Product) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const uniqueCategoryNames = useMemo(() => {
    const names = products.map(prod => prod.category?.name).filter(Boolean) as string[];
    return ['All', ...Array.from(new Set(names))];
  }, [products]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    openModal();
  };

  const handleEditProduct = (id: number) => {
    const productToEdit = products.find(prod => prod.productId === id);
    if (!productToEdit) {
      return;
    }
    setEditingProduct(productToEdit);
    setNewName(productToEdit.name);
    setNewProductCode(productToEdit.productCode);
    setNewPrice(productToEdit.price);
    setNewStockQuantity(productToEdit.stockQuantity);
    setNewCategoryId(productToEdit.category?.categoryId || undefined);
    setNewDescription(productToEdit.description || '');
    setNewYoutubeLink(productToEdit.youtubeLink || '');
    setNewImages(productToEdit.images || []); // Populate newImages with existing image URLs
    setDeletedImageIds([]); // Clear deleted image IDs when opening for edit
    setNewColor(productToEdit.color || ''); // Populate newColor
    setNewFabric(productToEdit.fabric || ''); // Populate newFabric
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
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
        await deleteProduct(id);
        loadProducts(currentPage); // Reload current page
        Swal.fire(
          'Deleted!',
          'Your product has been marked as deleted.',
          'success'
        );
      } catch (err) {
        Swal.fire(
          'Error!',
          `Failed to delete product: ${(err as Error).message}`,
          'error'
        );
      }
    }
  };

  const handleRestoreProduct = async (id: number) => {
    try {
      await restoreProduct(id);
      loadProducts(currentPage); // Reload current page
      Swal.fire(
        'Restored!',
        'Your product has been restored.',
        'success'
      );
    } catch (err) {
      Swal.fire(
        'Error!',
        `Failed to restore product: ${(err as Error).message}`,
        'error'
      );
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRemoveImage = (index: number, isExisting: boolean, imageId?: number) => {
    setNewImages(prevImages => {
      const updatedImages = prevImages.filter((_, i) => i !== index);
      if (isExisting && imageId) {
        setDeletedImageIds(prev => [...prev, imageId]);
      }
      // If the removed image was the main image, and there are other images, set the first one as main
      if (prevImages[index] && (prevImages[index] as any).isMain && updatedImages.length > 0) {
        updatedImages[0] = { ...updatedImages[0] as any, isMain: true };
      }
      return updatedImages;
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const img = new Image();
        img.onload = () => {
          if (img.width === 1500 && img.height === 2250) {
            setNewImages(prevImages => [...prevImages, file]);
          } else {
            Swal.fire(
              'Error!',
              `Image ${file.name} has dimensions ${img.width}x${img.height}. Required: 1500x2250.`, 
              'error'
            );
          }
        };
        img.src = URL.createObjectURL(file);
      });
    }
  };

  const openModal = () => {
    setNewName('');
    setNewProductCode('');
    setNewPrice(0);
    setNewStockQuantity(0);
    setNewCategoryId(undefined);
    setNewDescription('');
    setNewYoutubeLink('');
    setNewImages([]); // Clear images
    setDeletedImageIds([]); // Clear deleted image IDs
    setNewColor(''); // Clear color
    setNewFabric(''); // Clear fabric
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (!newName || !newProductCode || !newCategoryId) {
        Swal.fire('Error!', 'Name, SKU, and Category are required.', 'error');
        return;
      }
      const formData = new FormData();
      formData.append('productCode', newProductCode);
      formData.append('name', newName);
      formData.append('description', newDescription);
      formData.append('price', newPrice.toString());
      formData.append('categoryId', (newCategoryId as number).toString());
      formData.append('stockQuantity', newStockQuantity.toString());
      formData.append('inStock', (newStockQuantity > 0).toString());
      formData.append('youtubeLink', newYoutubeLink);
      formData.append('color', newColor);
      formData.append('fabric', newFabric);

      let mainImageIdToSend: number | undefined = undefined;

      newImages.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`productImages`, image);
        } else {
          if (image.isMain) {
            mainImageIdToSend = image.id;
          }
        }
      });

      if (mainImageIdToSend !== undefined) {
        formData.append('mainImageId', mainImageIdToSend.toString());
      }

      if (editingProduct) {
        deletedImageIds.forEach(id => {
          formData.append(`deletedImageIds`, id.toString());
        });
        await updateProduct(editingProduct.productId, formData);
        Swal.fire('Updated!', 'Product has been updated.', 'success');
      } else {
        await createProduct(formData);
        Swal.fire('Created!', 'New product has been created.', 'success');
      }

      setIsModalOpen(false);
      loadProducts(editingProduct ? currentPage : 1);
    } catch (err) {
      Swal.fire('Error!', (err as Error).message, 'error');
    }
  };


  const menuItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', link: '/admin/dashboard' },
    { name: 'Orders', icon: 'ShoppingCart', link: '/admin/orders' },
    { name: 'Products', icon: 'Package', link: '/admin/product-management' },
    { name: 'Categories', icon: 'ListFilter', link: '/admin/categories' },
    { name: 'Banners', icon: 'Settings', link: '/admin/banners' },
  ];

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />
      <Sidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} activeLink="Products" toggleCollapse={handleMenuToggle} />

      <main className={`
        pt-9 transition-all duration-300 ease-smooth
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-800">Products</h1>
              <p className="text-gray-600 mt-1">
                Manage your products, add new products, and update existing ones.
              </p>
            </div>
            <Button onClick={handleAddProduct} className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-md px-4 py-2 flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-1/4 justify-between px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800">
                  Category: {filterCategory}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {uniqueCategoryNames.map(name => (
                  <DropdownMenuItem key={name} onClick={() => setFilterCategory(name)}>
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center space-x-2">
              <label htmlFor="show-deleted" className="text-sm font-medium text-gray-900">Show Deleted</label>
              <button
                id="show-deleted"
                role="switch"
                aria-checked={showDeleted}
                onClick={() => setShowDeleted(!showDeleted)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${showDeleted ? 'bg-yellow-500' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${showDeleted ? 'translate-x-7' : 'translate-x-1'}`}
                />
              </button>
            </div>

          </div>

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('productId')}>Product ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>Name</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('productCode')}>SKU</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>Price</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('stockQuantity')}>Stock</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>Category</TableHead>
                  <TableHead>Main Image</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('createdAt')}>Created Date</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('deleted')}>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={10} className="text-center text-gray-500 p-4">Loading products...</TableCell></TableRow>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell className="font-medium">{product.productId}</TableCell>
                      <TableCell className="min-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">{product.name}</TableCell>
                      <TableCell>{product.productCode}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell className="min-w-[100px] whitespace-nowrap overflow-hidden text-ellipsis">
                          {product.stockQuantity ?? 0}
                          {(product.stockQuantity ?? 0) < 10 && (
                              <span className="ml-2 bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Low Stock</span>
                          )}
                      </TableCell>
                      <TableCell className="min-w-[150px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {product.category?.name || categories.find(cat => cat.categoryId === product.categoryId)?.name || 'N/A'}
                      </TableCell>
                      <TableCell className="align-top">
                        {product.images && product.images.length > 0 ? (() => {
                          const mainImage = product.images.find(img => img.isMain) || product.images[0];
                          return (
                            <div className="w-20 h-20 flex-none cursor-pointer">
                              <img
                                src={mainImage.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-md"
                                onClick={() => setLightboxUrl(mainImage.imageUrl)}
                              />
                            </div>
                          );
                        })() : 'N/A'}
                      </TableCell>
                      <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {product.deleted ? (
                          <span className="bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Deleted</span>
                        ) : (
                          <span className="bg-green-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Active</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {product.deleted ? (
                            <Button variant="outline" size="icon" onClick={() => handleRestoreProduct(product.productId)}>
                              <RotateCcw className="h-4 w-4 text-green-500" />
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="icon" onClick={() => handleEditProduct(product.productId)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.productId)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={10} className="text-center text-gray-500 p-4">No products found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-gray-600 text-sm">
              Showing {Math.min((currentPage - 1) * productsPerPage + 1, totalElements)} - {Math.min(currentPage * productsPerPage, totalElements)} of {totalElements} products
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                const showPage = Math.abs(pageNum - currentPage) < 2 || pageNum === 1 || pageNum === totalPages;
                const showEllipsis = Math.abs(pageNum - currentPage) === 2 && pageNum > 1 && pageNum < totalPages;

                if (showEllipsis) {
                  return <span key={`ellipsis-${pageNum}`} className="px-4 py-2">...</span>;
                }

                if (showPage) {
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      onClick={() => paginate(pageNum)}
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  );
                }
                return null;
              })}
              <Button
                variant="outline"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                Next
              </Button>
            </div>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                  <DialogDescription>
                    {editingProduct ? 'Edit the details for this product.' : 'Fill in the details for the new product. All fields are required unless specified.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <Input
                      id="productName"
                      placeholder="e.g., Banarasi Silk Saree"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="productCode" className="block text-sm font-medium text-gray-700 mb-1">Product SKU</label>
                    <Input
                      id="productCode"
                      placeholder="e.g., VB-BS-001 (unique identifier)"
                      value={newProductCode}
                      onChange={(e) => setNewProductCode(e.target.value)}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <Input
                      id="productPrice"
                      placeholder="e.g., 1200.00"
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <Input
                      id="stockQuantity"
                      placeholder="e.g., 50 (number of items in stock)"
                      type="number"
                      value={newStockQuantity}
                      onChange={(e) => setNewStockQuantity(Number(e.target.value))}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Input
                      id="productDescription"
                      placeholder="Detailed description of the product (optional)"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 mb-1">YouTube Link</label>
                    <Input
                      id="youtubeLink"
                      placeholder="Link to product video (optional)"
                      value={newYoutubeLink}
                      onChange={(e) => setNewYoutubeLink(e.target.value)}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="productColor" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <Input
                      id="productColor"
                      placeholder="e.g., Red, Blue, Multi"
                      value={newColor}
                      onChange={(e) => setNewColor(e.target.value)}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="productFabric" className="block text-sm font-medium text-gray-700 mb-1">Fabric</label>
                    <Input
                      id="productFabric"
                      placeholder="e.g., Silk, Cotton, Georgette"
                      value={newFabric}
                      onChange={(e) => setNewFabric(e.target.value)}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="productImages" className="block text-sm font-medium text-gray-700 mb-1">Product Images <span className="text-gray-500 text-xs">(Required: 1500px width x 2250px height)</span></label>
                    <Input
                      id="productImages"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newImages.map((image, index) => (
                        <div key={index} className="relative w-24 h-24 group">
                          <img
                            src={typeof image === 'object' && 'id' in image ? image.imageUrl : URL.createObjectURL(image as File)}
                            alt={`Product Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index, typeof image === 'object' && 'id' in image, typeof image === 'object' && 'id' in image ? (image as { id: number; imageUrl: string }).id : undefined)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800">
                          {newCategoryId ? categories.find(c => c.categoryId === newCategoryId)?.name : 'Select Category'}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {categories.map(category => (
                          <DropdownMenuItem key={category.categoryId} onClick={() => setNewCategoryId(category.categoryId)}>
                            {category.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button onClick={handleSaveProduct}>{editingProduct ? 'Update Product' : 'Save Product'}</Button>
                </DialogFooter>
              </DialogContent>
          </Dialog>

          
        </div>
      </main>

      {lightboxUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Full Size"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}