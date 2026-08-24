import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Brand, Review } from '../types';
import { mockDb } from '../data/mockDb';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  reviews: Review[];
  addProduct: (product: Omit<Product, 'product_id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  addCategory: (cat_title: string) => Category;
  deleteCategory: (cat_id: number) => void;
  addBrand: (brand_title: string) => Brand;
  deleteBrand: (brand_id: number) => void;
  addReview: (review: Omit<Review, 'review_id' | 'datetime'>) => void;
  getProductById: (id: number) => Product | undefined;
  getCategoryById: (id: number) => Category | undefined;
  getBrandById: (id: number) => Brand | undefined;
  getProductReviews: (productId: number) => Review[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => mockDb.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => mockDb.getCategories());
  const [brands, setBrands] = useState<Brand[]>(() => mockDb.getBrands());
  const [reviews, setReviews] = useState<Review[]>(() => mockDb.getReviews());

  useEffect(() => {
    mockDb.saveProducts(products);
  }, [products]);

  useEffect(() => {
    mockDb.saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    mockDb.saveBrands(brands);
  }, [brands]);

  useEffect(() => {
    mockDb.saveReviews(reviews);
  }, [reviews]);

  const addProduct = (productData: Omit<Product, 'product_id'>): Product => {
    const newId = products.length > 0 ? Math.max(...products.map(p => p.product_id)) + 1 : 1;
    const newProduct: Product = {
      ...productData,
      product_id: newId,
      rating: 5.0,
      review_count: 1,
    };
    const updated = [newProduct, ...products];
    setProducts(updated);
    return newProduct;
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.product_id === updatedProduct.product_id ? updatedProduct : p);
    setProducts(updated);
  };

  const deleteProduct = (productId: number) => {
    const updated = products.filter(p => p.product_id !== productId);
    setProducts(updated);
  };

  const addCategory = (cat_title: string): Category => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.cat_id)) + 1 : 1;
    const newCategory: Category = { cat_id: newId, cat_title };
    const updated = [...categories, newCategory];
    setCategories(updated);
    return newCategory;
  };

  const deleteCategory = (cat_id: number) => {
    const updated = categories.filter(c => c.cat_id !== cat_id);
    setCategories(updated);
  };

  const addBrand = (brand_title: string): Brand => {
    const newId = brands.length > 0 ? Math.max(...brands.map(b => b.brand_id)) + 1 : 1;
    const newBrand: Brand = { brand_id: newId, brand_title };
    const updated = [...brands, newBrand];
    setBrands(updated);
    return newBrand;
  };

  const deleteBrand = (brand_id: number) => {
    const updated = brands.filter(b => b.brand_id !== brand_id);
    setBrands(updated);
  };

  const addReview = (reviewData: Omit<Review, 'review_id' | 'datetime'>) => {
    const newReview: Review = {
      ...reviewData,
      review_id: Date.now(),
      datetime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Update product average rating & review count
    const productReviews = updatedReviews.filter(r => r.product_id === reviewData.product_id);
    const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

    setProducts(prev => prev.map(p => {
      if (p.product_id === reviewData.product_id) {
        return {
          ...p,
          rating: Number(avgRating.toFixed(1)),
          review_count: productReviews.length,
        };
      }
      return p;
    }));
  };

  const getProductById = (id: number) => products.find(p => p.product_id === id);
  const getCategoryById = (id: number) => categories.find(c => c.cat_id === id);
  const getBrandById = (id: number) => brands.find(b => b.brand_id === id);
  const getProductReviews = (productId: number) => reviews.filter(r => r.product_id === productId);

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        brands,
        reviews,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        deleteCategory,
        addBrand,
        deleteBrand,
        addReview,
        getProductById,
        getCategoryById,
        getBrandById,
        getProductReviews,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
