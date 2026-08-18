import { useState } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./store/CartContext";
import { AuthProvider } from "./store/AuthContext";
import { SiteProvider } from "./store/site";
import Layout from "./components/Layout";
import { BootLoader } from "./components/Loader";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/Product";
import CategoryPage from "./pages/CategoryPage";
import BrandPage from "./pages/BrandPage";
import Maison from "./pages/Maison";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Dashboard from "./pages/Dashboard";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/category/:name" element={<CategoryPage />} />
        <Route path="/brand/:id" element={<BrandPage />} />
        <Route path="/maison" element={<Maison />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <SiteProvider>
      <AuthProvider>
        <CartProvider>
          <HashRouter>
            <AnimatePresence>
              {!booted && <BootLoader key="boot" onDone={() => setBooted(true)} />}
            </AnimatePresence>
            <Layout>
              <AnimatedRoutes />
            </Layout>
          </HashRouter>
        </CartProvider>
      </AuthProvider>
    </SiteProvider>
  );
}
