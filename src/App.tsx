import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { CartProvider } from "./store/CartContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/Product";
import Maison from "./pages/Maison";
import Contact from "./pages/Contact";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/maison" element={<Maison />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </HashRouter>
    </CartProvider>
  );
}
