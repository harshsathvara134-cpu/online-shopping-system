import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Providers
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileNav } from './components/common/MobileNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { NexusAiAssistant } from './components/chatbot/NexusAiAssistant';

// Storefront Pages
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { ConditionsOfUsePage } from './pages/ConditionsOfUsePage';
import { PrivacyNoticePage } from './pages/PrivacyNoticePage';

// Admin Suite Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminBrands } from './pages/admin/AdminBrands';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminSettings } from './pages/admin/AdminSettings';

// Scroll to top helper on route change
const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
};

// Storefront Layout with Header, Footer, and Chatbot
const StorefrontLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
      <MobileNav />
      <CartDrawer />
      <NexusAiAssistant />
    </div>
  );
};

class GlobalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Unhandled UI Exception caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem', textAlign: 'center', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ maxWidth: '480px', backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f43f5e', marginBottom: '1rem' }}>Something went wrong</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              The application encountered a temporary display issue. Click below to refresh and reset the store state.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = window.location.origin + window.location.pathname;
              }}
              style={{ backgroundColor: '#4f46e5', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
            >
              Reset & Reload Store
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  return (
    <GlobalErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <Router>
                    <ScrollToTop />
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route path="/" element={<StorefrontLayout><HomePage /></StorefrontLayout>} />
                  <Route path="/store" element={<StorefrontLayout><StorePage /></StorefrontLayout>} />
                  <Route path="/product/:id" element={<StorefrontLayout><ProductDetailPage /></StorefrontLayout>} />
                  <Route path="/cart" element={<StorefrontLayout><CartPage /></StorefrontLayout>} />
                  <Route path="/wishlist" element={<StorefrontLayout><WishlistPage /></StorefrontLayout>} />
                  <Route path="/checkout" element={<StorefrontLayout><CheckoutPage /></StorefrontLayout>} />
                  <Route path="/order-success/:orderId" element={<StorefrontLayout><OrderSuccessPage /></StorefrontLayout>} />
                  <Route path="/my-orders" element={<StorefrontLayout><MyOrdersPage /></StorefrontLayout>} />
                  <Route path="/my-profile" element={<StorefrontLayout><MyProfilePage /></StorefrontLayout>} />
                  <Route path="/account" element={<StorefrontLayout><MyProfilePage /></StorefrontLayout>} />
                  <Route path="/account/*" element={<StorefrontLayout><MyProfilePage /></StorefrontLayout>} />
                  <Route path="/login" element={<StorefrontLayout><MyProfilePage /></StorefrontLayout>} />
                  <Route path="/conditions-of-use" element={<StorefrontLayout><ConditionsOfUsePage /></StorefrontLayout>} />
                  <Route path="/terms-of-service" element={<StorefrontLayout><ConditionsOfUsePage /></StorefrontLayout>} />
                  <Route path="/terms" element={<StorefrontLayout><ConditionsOfUsePage /></StorefrontLayout>} />
                  <Route path="/conditions" element={<StorefrontLayout><ConditionsOfUsePage /></StorefrontLayout>} />
                  <Route path="/privacy-notice" element={<StorefrontLayout><PrivacyNoticePage /></StorefrontLayout>} />
                  <Route path="/privacy-policy" element={<StorefrontLayout><PrivacyNoticePage /></StorefrontLayout>} />
                  <Route path="/privacy" element={<StorefrontLayout><PrivacyNoticePage /></StorefrontLayout>} />

                  {/* Admin Portal Routes (Direct Public Access) */}
                  <Route path="/admin/login" element={<StorefrontLayout><AdminDashboard /></StorefrontLayout>} />
                  <Route path="/admin-login" element={<StorefrontLayout><AdminDashboard /></StorefrontLayout>} />
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="brands" element={<AdminBrands />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="reviews" element={<AdminReviews />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>

                  {/* 404 Fallback */}
                  <Route
                    path="*"
                    element={
                      <StorefrontLayout>
                        <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
                          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem', color: 'var(--primary)' }}>404</h1>
                          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>Page Not Found</h2>
                          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            The page you requested could not be found.
                          </p>
                          <a href="/" className="btn btn-primary">
                            Return to Homepage
                          </a>
                        </div>
                      </StorefrontLayout>
                    }
                  />
                </Routes>
              </Router>
            </OrderProvider>
          </WishlistProvider>
        </CartProvider>
      </ProductProvider>
          </AuthProvider>
        </LanguageProvider>
      </GlobalErrorBoundary>
    );
  };

export default App;
