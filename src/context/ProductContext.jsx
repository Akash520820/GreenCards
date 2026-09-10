import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as productsApi from '../api/products.api';
import * as categoriesApi from '../api/categories.api';

const ProductContext = createContext();

// Flattens the real Product doc (colorVariants/discountPrice/populated category)
// into the simpler { image, offerPrice, category, inStock } shape the existing
// UI (ProductCard, Home, FlashSale, AddProduct table, etc.) was built around.
const normalizeProduct = (p) => {
  const totalVariantStock = (p.colorVariants || []).reduce(
    (sum, cv) => sum + (cv.sizes || []).reduce((s, sz) => s + (sz.stock || 0), 0),
    0
  );
  const stock = (p.colorVariants && p.colorVariants.length > 0) ? totalVariantStock : (p.stock || 0);

  return {
    ...p,
    _id: p._id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    image: p.images || [],
    price: p.price,
    offerPrice: p.discountPrice > 0 ? p.discountPrice : undefined,
    category: typeof p.category === 'object' && p.category !== null ? p.category.name : p.category,
    categoryId: typeof p.category === 'object' && p.category !== null ? p.category._id : p.category,
    stock,
    inStock: stock > 0,
    colorVariants: p.colorVariants || [],
    sku: p.sku,
    brand: p.brand,
    ratings: p.ratings,
  };
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  const fetchProducts = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      // pull a generously large page by default so client-side lookups/filtering
      // (getProductById, getProductsByCategory, search) behave like the original app
      const res = await productsApi.getAllProducts({ limit: 100, ...params });
      setProducts(res.data.products.map(normalizeProduct));
      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoriesApi.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // productData: FormData with name, description, category, price, discountPrice,
  // stock, sku, brand, colorVariants (JSON string), images (files)
  const addProduct = async (productData) => {
    const res = await productsApi.createProduct(productData);
    const normalized = normalizeProduct(res.data);
    setProducts((prev) => [normalized, ...prev]);
    return normalized;
  };

  const updateProduct = async (productId, productData) => {
    const res = await productsApi.updateProduct(productId, productData);
    const normalized = normalizeProduct(res.data);
    setProducts((prev) => prev.map((p) => (p._id === productId ? normalized : p)));
    return normalized;
  };

  const deleteProduct = async (productId) => {
    await productsApi.deleteProduct(productId);
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const updateStock = async (productId, payload) => {
    const res = await productsApi.updateStock(productId, payload);
    const normalized = normalizeProduct(res.data);
    setProducts((prev) => prev.map((p) => (p._id === productId ? normalized : p)));
    return normalized;
  };

  const getAvailableProducts = () => products.filter((p) => p.inStock);

  const getProductsByCategory = (category) => {
    if (!category || category === 'All') return products.filter((p) => p.inStock);
    const catLower = category.toLowerCase().trim();
    return products.filter((p) => {
      if (!p.inStock) return false;
      const pCatLower = (p.category || '').toLowerCase().trim();
      const pCatId = (p.categoryId || '').toString();
      return (
        pCatLower === catLower ||
        pCatId === category ||
        pCatLower.includes(catLower) ||
        catLower.includes(pCatLower)
      );
    });
  };

  const getProductById = (productId) => products.find((p) => p._id === productId);

  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products.filter((p) => p.inStock);
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.inStock &&
        (p.name?.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term))
    );
  };

  const getAllCategories = () => ['All', ...categories.map((c) => c.name)];

  const getSellerStats = () => ({
    totalProducts: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
  });

  const value = {
    products,
    categories,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchCategories,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getAvailableProducts,
    getProductsByCategory,
    getProductById,
    searchProducts,
    getAllCategories,
    getSellerStats,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export default ProductContext;
