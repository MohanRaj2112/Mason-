import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartSidebar } from './components/CartSidebar';
import { FloatingActions } from './components/FloatingActions';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Products } from './pages/Products';
import { Booking } from './pages/Booking';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { Admin } from './pages/Admin';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const id = hash.replace('#', '');
<<<<<<< HEAD
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      scrollToElement();
      // Safety timeout in case element was still rendering after page change
      const timer = setTimeout(scrollToElement, 150);
      return () => clearTimeout(timer);
=======
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
>>>>>>> 1db21cd3fbb8d2a56e53f3cfdb93a3fa06e2b6a7
    }
  }, [pathname, hash]);

  return null;
}

// Layout wrapper that hides public navbar/footer on admin page
function Layout({ children }) {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}
      <CartSidebar />
      <div style={{ flex: 1 }}>{children}</div>
      {!isAdminPath && <FloatingActions />}
      {!isAdminPath && <Footer />}
    </>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Routes>
                {/* Home Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/index.html" element={<Home />} />

                {/* Services Routes */}
                <Route path="/services" element={<Services />} />
                <Route path="/services.html" element={<Services />} />

                {/* Products & Tool Rentals Routes */}
                <Route path="/products" element={<Products />} />
                <Route path="/products.html" element={<Products />} />
                <Route path="/tools" element={<Products />} />
                <Route path="/tools-rental" element={<Products />} />
                <Route path="/tools.html" element={<Products />} />

                {/* Booking Wizard Routes */}
                <Route path="/booking" element={<Booking />} />
                <Route path="/booking.html" element={<Booking />} />

                {/* Contact & Reviews Routes */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact.html" element={<Contact />} />

                {/* Authentication Routes */}
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth.html" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/register" element={<Auth />} />

                {/* Admin Management Dashboard */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin.html" element={<Admin />} />

                {/* Catch-all fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
