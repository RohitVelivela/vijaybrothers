
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed for backend
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  // Form state
  const [newName, setNewName] = useState('');
  const [newProductCode, setNewProductCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState(0);
  const [newStockQuantity, setNewStockQuantity] = useState(0);
  const [newYoutubeLink, setNewYoutubeLink] = useState('');
  const [newMainImageUrl, setNewMainImageUrl] = useState('');
  const [newColor, setNewColor] = useState(''); // New state for color
  const [newFabric, setNewFabric] = useState(''); // New state for fabric
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryId, setNewCategoryId] = useState<number | undefined>(undefined);

  const loadProducts = useCallback(async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    if (reset) {
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
    }
    try {
      const data: Page<Product> = await fetchProducts(reset ? 0 : currentPage, 10, showDeleted); // Fetch 10 products per page
      console.log('Fetched products data:', data.content); // Log fetched data
      setProducts(prevProducts => reset ? data.content : [...prevProducts, ...data.content]);
      setHasMore(data.number < data.totalPages - 1);
      setCurrentPage(prevPage => reset ? 1 : prevPage + 1);
    } catch (err) {
      console.error(err);
      setHasMore(false); // Stop trying to load more on error
    } finally {
      setLoading(false);
    }
  }, [currentPage, loading, hasMore, showDeleted]);

  const lastProductElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadProducts();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadProducts]);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProducts(true);
    loadCategories();
  }, [showDeleted]);

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
  }, [products, searchTerm, filterCategory, sortColumn, sortDirection, showDeleted]);

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
    console.log('Edit icon clicked for product ID:', id);
    const productToEdit = products.find(prod => prod.productId === id);
    if (!productToEdit) {
      console.error('Product not found for editing:', id);
      return;
    }
    console.log('Product to edit:', productToEdit);
        setEditingProduct(productToEdit);
        setNewName(productToEdit.name);
        setNewProductCode(productToEdit.productCode);
        setNewPrice(productToEdit.price);
        setNewStockQuantity(productToEdit.stockQuantity);
        setNewCategoryId(productToEdit.category?.categoryId || undefined);
        setNewDescription(productToEdit.description || '');
        setNewYoutubeLink(productToEdit.youtubeLink || '');
        setNewMainImageUrl(productToEdit.mainImageUrl || '');
        setNewColor(productToEdit.color || ''); // Populate newColor
        setNewFabric(productToEdit.fabric || ''); // Populate newFabric
        setIsModalOpen(true);
        console.log('Form fields populated.');
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
        // Optimistically update the UI
        setProducts(products.map(p => p.productId === id ? { ...p, deleted: true } : p));
        await deleteProduct(id);
        Swal.fire(
          'Deleted!',
          'Your product has been marked as deleted.',
          'success'
        );
      } catch (err) {
        // Revert the change if the API call fails
        setProducts(products.map(p => p.productId === id ? { ...p, deleted: false } : p));
        console.error(err);
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
      // Optimistically update the UI
      setProducts(products.map(p => p.productId === id ? { ...p, deleted: false } : p));
      await restoreProduct(id);
      Swal.fire(
        'Restored!',
        'Your product has been restored.',
        'success'
      );
    } catch (err) {
      // Revert the change if the API call fails
      setProducts(products.map(p => p.productId === id ? { ...p, deleted: true } : p));
      console.error(err);
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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewMainImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    setNewMainImageUrl('');
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
      const productData = {
        productCode: newProductCode,
        name: newName,
        description: newDescription,
        price: newPrice,
        categoryId: newCategoryId,
        stockQuantity: newStockQuantity,
        inStock: newStockQuantity > 0,
        youtubeLink: newYoutubeLink,
        mainImageUrl: newMainImageUrl,
        color: newColor, // Added color
        fabric: newFabric, // Added fabric
      };

      console.log('Payload being sent to backend:', productData);
      console.log('newStockQuantity before API call:', newStockQuantity);

      if (editingProduct) {
        // Update existing product
        await updateProduct({ ...productData, productId: editingProduct.productId });
        Swal.fire('Updated!', 'Product has been updated.', 'success');
      } else {
        // Create new product
        await createProduct(productData);
        Swal.fire('Created!', 'New product has been created.', 'success');
      }

      setIsModalOpen(false);
      // After save, reload products from scratch to ensure correct pagination
      setProducts([]);
      setCurrentPage(0);
      setHasMore(true);
      loadProducts();
    } catch (err) {
      console.error(err);
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
      <AdminHeader adminEmail="admin@vijaybrothers.com" />
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

            <div className="flex items-center space-x-2">
              <label htmlFor="show-deleted" className="text-sm font-medium text-gray-900">Show Deleted</label>
              <button
                id="show-deleted"
                role="switch"
                aria-checked={showDeleted}
                onClick={() => setShowDeleted(!showDeleted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${showDeleted ? 'bg-yellow-500' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showDeleted ? 'translate-x-6' : 'translate-x-1'}`}
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
                {filteredProducts.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">{product.productId}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.productCode}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                        {product.stockQuantity ?? 0}
                        {(product.stockQuantity ?? 0) < 10 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">Low Stock</span>
                        )}
                    </TableCell>
                    <TableCell>
                      {product.category?.name || categories.find(cat => cat.categoryId === product.categoryId)?.name || 'N/A'}
                    </TableCell>
                    <TableCell className="align-top">
                      {product.mainImageUrl ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setCurrentImageUrl(product.mainImageUrl);
                            setIsImageModalOpen(true);
                          }}
                        >
                          <img src={product.mainImageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                        </div>
                      ) : (
                        'N/A'
                      )}
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
                            <Trash2 className="h-4 w-4 text-green-500" />
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
                ))}
                {loading && <TableRow><TableCell colSpan={9} className="text-center text-gray-500">Loading more products...</TableCell></TableRow>}
                {!hasMore && !loading && products.length > 0 && <TableRow><TableCell colSpan={9} className="text-center text-gray-500">No more products to load.</TableCell></TableRow>}
                {products.length === 0 && !loading && <TableRow><TableCell colSpan={9} className="text-center text-gray-500">No products found.</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div ref={lastProductElementRef} style={{ height: '1px' }} /> {/* Invisible element to trigger IntersectionObserver */}

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
                    <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="mainImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="w-full px-4 py-1.5 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                      />
                      {newMainImageUrl && (
                        <img src={newMainImageUrl} alt="Main Product" className="w-16 h-16 object-cover rounded-md" />
                      )}
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

          <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
            <DialogContent className="sm:max-w-[800px]">
              <DialogHeader>
                <DialogTitle>Product Image</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center items-center">
                <img src={currentImageUrl} alt="Product" className="max-w-full h-auto" />
              </div>
              <DialogFooter>
                <Button onClick={() => setIsImageModalOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
