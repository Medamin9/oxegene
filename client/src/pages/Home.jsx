import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../utils/api';
import Hero from '../components/public/Hero';
import CategoryNav from '../components/public/CategoryNav';
import MenuSection from '../components/public/MenuSection';
import ProductCustomizer from '../components/public/ProductCustomizer';
import Aurora from '../components/effects/Aurora';
import SnowEffect from '../components/effects/SnowEffect';

function Home() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { data: menuData, isLoading } = useQuery('menu', api.getMenu);
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-label-lg text-label-lg text-on-surface-variant">Loading menu...</p>
        </div>
      </div>
    );
  }

  const categories = menuData?.categories || [];

  return (
    <div className="flex flex-col w-full relative">
      {/* Snow Background Effect */}
      <SnowEffect imageSrc="/snow.png" />

      {/* Aurora Effect Background - Top of Page */}
      <div className="absolute top-0 left-0 right-0 h-[600px] pointer-events-none -z-10 opacity-30 transition-opacity duration-500">
        <Aurora
          colorStops={['#7c3aed', '#a78bfa', '#7c3aed']}
          amplitude={1.2}
          blend={0.6}
          speed={0.8}
        />
      </div>

      {/* Ambient backgrounds */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-primary-container/20 rounded-full blur-[140px] pointer-events-none -z-10"></div>
      <div className="absolute top-80 right-10 w-80 h-80 bg-tertiary-container/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <Hero />
      <CategoryNav categories={categories} />

      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-space-xl space-y-20">
        {categories.map((category) => (
          <MenuSection
            key={category.id}
            category={category}
            onProductClick={setSelectedProduct}
          />
        ))}
      </section>

      {selectedProduct && (
        <ProductCustomizer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Retour en haut"
        className={`fixed bottom-8 left-8 z-40 w-12 h-12 rounded-full glass-effect-2 text-on-surface border border-primary-container/40 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-primary-container hover:text-on-primary-container ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto shadow-glow-primary'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        <span className="material-symbols-outlined text-[24px]">arrow_upward</span>
      </button>
    </div>
  );
}

export default Home;
