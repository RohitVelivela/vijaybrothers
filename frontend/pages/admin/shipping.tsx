import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Settings, 
  Save, 
  ToggleLeft, 
  ToggleRight,
  Truck,
  IndianRupee,
  AlertCircle,
  Check,
  X
} from 'lucide-react';
import Sidebar from '../../components/ui/Sidebar';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { toast } from '../../hooks/use-toast';
import Image from 'next/image';

interface ShippingConfig {
  configId?: number;
  globalFreeShipping: boolean;
  defaultShippingCharge: number;
  minOrderForFreeShipping: number;
}

interface ProductShipping {
  shippingId?: number;
  productId: number;
  productName: string;
  productCode: string;
  productImage?: string;
  productPrice: number;
  hasFreeShipping: boolean;
  shippingCharge: number;
  isHeavyItem: boolean;
  additionalCharge: number;
}

const ShippingManagement: React.FC = () => {
  const [globalConfig, setGlobalConfig] = useState<ShippingConfig>({
    globalFreeShipping: false,
    defaultShippingCharge: 50,
    minOrderForFreeShipping: 500
  });
  
  const [products, setProducts] = useState<ProductShipping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editedProducts, setEditedProducts] = useState<Set<number>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleMenuToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    fetchShippingData();
  }, []);

  const fetchShippingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      console.log('Fetching shipping data...');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in as admin to access shipping settings.",
          variant: "destructive",
        });
        setProducts([]);
        return;
      }
      
      // Try to fetch global config
      try {
        const configResponse = await fetch('/api/admin/shipping/config', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (configResponse.ok) {
          const configData = await configResponse.json();
          console.log('Config data:', configData);
          setGlobalConfig(configData);
        } else {
          console.warn('Config response not ok:', configResponse.status);
        }
      } catch (configError) {
        console.warn('Failed to fetch config:', configError);
        // Use default config if API fails
      }
      
      // Try to fetch product shipping settings, fallback to regular products API
      try {
        const productsResponse = await fetch('/api/admin/shipping/products', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log('Products data from shipping API:', productsData);
          setProducts(productsData);
        } else {
          console.warn('Shipping products API failed, trying products API...');
          // Fallback to regular products API
          await fetchProductsFallback(token);
        }
      } catch (productsError) {
        console.warn('Shipping products API error, trying products API...', productsError);
        // Fallback to regular products API
        await fetchProductsFallback(token);
      }
      
    } catch (error) {
      console.error('Error fetching shipping data:', error);
      toast({
        title: "Error",
        description: "Failed to load shipping settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch products from regular products API and add default shipping settings
  const fetchProductsFallback = async (token: string) => {
    try {
      const response = await fetch('/api/admin/products?size=1000', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Products API response:', data);
        
        // Transform regular products to shipping products format
        const productsList = data.content || data || [];
        const products = productsList.map((product: any) => ({
          productId: product.productId,
          productName: product.name,
          productCode: product.productCode,
          productPrice: product.price,
          productImage: product.images && product.images.length > 0 
            ? product.images.find((img: any) => img.isMain)?.imageUrl || product.images[0]?.imageUrl 
            : null,
          hasFreeShipping: false, // Default to false
          shippingCharge: globalConfig.defaultShippingCharge || 50, // Use global default
          isHeavyItem: false, // Default to false
          additionalCharge: 0 // Default to 0
        }));
        
        console.log('Transformed products for shipping:', products);
        setProducts(products);
        
        if (products.length === 0) {
          toast({
            title: "No Products Found",
            description: "Please add some products first to configure shipping settings.",
            variant: "default",
          });
        }
      } else {
        console.error('Products API failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        toast({
          title: "Error Loading Products",
          description: `Failed to fetch products: ${response.status}`,
          variant: "destructive",
        });
        
        setProducts([]); // Set empty array instead of mock data
      }
    } catch (fallbackError) {
      console.error('Products fetch failed:', fallbackError);
      toast({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check if the backend is running.",
        variant: "destructive",
      });
      setProducts([]); // Set empty array instead of mock data
    }
  };


  const saveGlobalConfig = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch('/api/admin/shipping/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(globalConfig)
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: "Global shipping settings updated successfully",
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving global config:', error);
      toast({
        title: "Error",
        description: "Failed to save global settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateProductShipping = (productId: number, field: keyof ProductShipping, value: any) => {
    setProducts(prev => prev.map(p => 
      p.productId === productId ? { ...p, [field]: value } : p
    ));
    setEditedProducts(prev => new Set(prev).add(productId));
  };

  const saveProductChanges = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('adminToken');
      const updates = products.filter(p => editedProducts.has(p.productId));
      
      const response = await fetch('/api/admin/shipping/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        toast({
          title: "Success",
          description: `Updated shipping settings for ${updates.length} products`,
        });
        setEditedProducts(new Set());
      } else {
        throw new Error('Failed to update products');
      }
    } catch (error) {
      console.error('Error saving product changes:', error);
      toast({
        title: "Error",
        description: "Failed to save product shipping settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show all products - no filtering needed

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} activeLink="Shipping" toggleCollapse={handleMenuToggle} />
      <div className={`flex-1 p-6 lg:p-8 overflow-x-hidden transition-all duration-300 
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Truck className="w-7 h-7 text-purple-600" />
              Shipping Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm lg:text-base">Configure shipping charges and free shipping rules</p>
          </div>

          {/* Simple Shipping Options */}
          <Card className="mb-6">
            <CardHeader className="border-b bg-purple-50">
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Truck className="w-6 h-6" />
                Choose Your Shipping Option
              </CardTitle>
              <CardDescription className="mt-1 text-purple-600">
                Pick one option that will apply to your store
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Option 1: Free Shipping for All */}
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  globalConfig.globalFreeShipping 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setGlobalConfig(prev => ({ 
                  ...prev, 
                  globalFreeShipping: true 
                }))}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      globalConfig.globalFreeShipping 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {globalConfig.globalFreeShipping && (
                        <Check className="w-2.5 h-2.5 text-white mx-auto mt-0.5" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">FREE SHIPPING for All Products</h3>
                      <p className="text-sm text-gray-600">Customers don't pay any shipping charges</p>
                    </div>
                  </div>
                </div>

                {/* Option 2: Charge Shipping */}
                <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  !globalConfig.globalFreeShipping 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
                onClick={() => setGlobalConfig(prev => ({ 
                  ...prev, 
                  globalFreeShipping: false 
                }))}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      !globalConfig.globalFreeShipping 
                        ? 'border-orange-500 bg-orange-500' 
                        : 'border-gray-300'
                    }`}>
                      {!globalConfig.globalFreeShipping && (
                        <Check className="w-2.5 h-2.5 text-white mx-auto mt-0.5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">CHARGE SHIPPING</h3>
                      <p className="text-sm text-gray-600 mb-3">Set shipping charges for your products</p>
                      
                      {!globalConfig.globalFreeShipping && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Default Shipping Cost</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                              <Input
                                type="number"
                                value={globalConfig.defaultShippingCharge}
                                onChange={(e) => 
                                  setGlobalConfig(prev => ({ 
                                    ...prev, 
                                    defaultShippingCharge: parseFloat(e.target.value) || 0 
                                  }))
                                }
                                className="pl-8"
                                placeholder="50"
                                min="0"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Free Shipping Above</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                              <Input
                                type="number"
                                value={globalConfig.minOrderForFreeShipping || ''}
                                onChange={(e) => 
                                  setGlobalConfig(prev => ({ 
                                    ...prev, 
                                    minOrderForFreeShipping: parseFloat(e.target.value) || 0 
                                  }))
                                }
                                className="pl-8"
                                placeholder="500 (optional)"
                                min="0"
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Leave empty if no free shipping threshold</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t">
                <Button 
                  onClick={saveGlobalConfig} 
                  disabled={saving}
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Shipping Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* All Products Table */}
          <Card>
            <CardHeader className="border-b">
              <div className="flex flex-col space-y-3 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Package className="w-5 h-5" />
                    All Products - Shipping Settings
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {globalConfig.globalFreeShipping 
                      ? "✅ Free shipping is enabled for all products" 
                      : "Set individual shipping charges or make products free shipping"}
                  </CardDescription>
                </div>
                {editedProducts.size > 0 && (
                  <Button 
                    onClick={saveProductChanges}
                    disabled={saving}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes ({editedProducts.size})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-gray-500 mb-4">Add some products first to configure shipping settings.</p>
                  <div className="text-sm text-gray-400">
                    <p>Debug: Loading={loading.toString()}, Products array length={products.length}</p>
                    <Button 
                      onClick={fetchShippingData} 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                    >
                      Retry Loading Products
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Total Products:</strong> {products.length} • 
                      <strong> Free Shipping:</strong> {products.filter(p => p.hasFreeShipping).length} • 
                      <strong> Paid Shipping:</strong> {products.filter(p => !p.hasFreeShipping).length}
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <Table className="min-w-full">
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="w-16 lg:w-20">Image</TableHead>
                          <TableHead className="min-w-[200px]">Product Name</TableHead>
                          <TableHead className="min-w-[100px] text-center">Shipping Type</TableHead>
                          <TableHead className="min-w-[120px] text-center">Shipping Cost</TableHead>
                          <TableHead className="min-w-[100px] text-center">Extra Charges</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow 
                            key={product.productId}
                            className={`${editedProducts.has(product.productId) ? 'bg-yellow-50' : ''} 
                                       ${globalConfig.globalFreeShipping ? 'opacity-60' : ''}`}
                          >
                            <TableCell className="py-4">
                              {product.productImage ? (
                                <div className="relative w-12 h-12">
                                  <Image
                                    src={product.productImage}
                                    alt={product.productName}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            
                            <TableCell>
                              <div>
                                <div className="font-medium text-gray-800">{product.productName}</div>
                                <div className="text-sm text-gray-500">
                                  SKU: {product.productCode} • ₹{product.productPrice?.toLocaleString()}
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-center">
                              {globalConfig.globalFreeShipping ? (
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  FREE (Global)
                                </span>
                              ) : (
                                <div className="flex flex-col items-center space-y-2">
                                  <Switch
                                    checked={product.hasFreeShipping}
                                    onCheckedChange={(checked) => 
                                      updateProductShipping(product.productId, 'hasFreeShipping', checked)
                                    }
                                  />
                                  <span className="text-xs text-gray-600">
                                    {product.hasFreeShipping ? 'FREE' : 'PAID'}
                                  </span>
                                </div>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center">
                              {globalConfig.globalFreeShipping || product.hasFreeShipping ? (
                                <span className="text-green-600 font-medium">FREE</span>
                              ) : (
                                <div className="flex flex-col items-center space-y-1">
                                  <div className="relative">
                                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                                    <Input
                                      type="number"
                                      value={product.shippingCharge}
                                      onChange={(e) => 
                                        updateProductShipping(product.productId, 'shippingCharge', parseFloat(e.target.value) || 0)
                                      }
                                      className="w-20 text-center pl-6 text-sm"
                                      min="0"
                                      placeholder="0"
                                    />
                                  </div>
                                </div>
                              )}
                            </TableCell>
                            
                            <TableCell className="text-center">
                              {globalConfig.globalFreeShipping || product.hasFreeShipping ? (
                                <span className="text-gray-400 text-sm">N/A</span>
                              ) : (
                                <div className="flex flex-col items-center space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={product.isHeavyItem}
                                      onCheckedChange={(checked) => 
                                        updateProductShipping(product.productId, 'isHeavyItem', checked)
                                      }
                                      className="scale-75"
                                    />
                                    <span className="text-xs text-gray-600">Heavy</span>
                                  </div>
                                  {product.isHeavyItem && (
                                    <div className="relative">
                                      <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                                      <Input
                                        type="number"
                                        value={product.additionalCharge}
                                        onChange={(e) => 
                                          updateProductShipping(product.productId, 'additionalCharge', parseFloat(e.target.value) || 0)
                                        }
                                        className="w-20 text-center pl-6 text-sm"
                                        min="0"
                                        placeholder="0"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingManagement;