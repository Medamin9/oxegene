import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/public/Navbar';
import Footer from '../components/public/Footer';
import CartDrawer from '../components/public/CartDrawer';
import FloatingCartButton from '../components/public/FloatingCartButton';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <Navbar />
      <main className="w-full pt-16 sm:pt-20 bg-surface min-h-[calc(100vh-280px)]">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}

export default PublicLayout;
