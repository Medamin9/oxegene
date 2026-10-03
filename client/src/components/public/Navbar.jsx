import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const { getTotalItems, getTotal } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 15);

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(Math.max((scrollY / docHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = getTotalItems();
  const total = getTotal();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-2xl border-b border-primary/20 shadow-elevation-3 py-0.5 sm:py-1'
          : 'bg-surface/80 backdrop-blur-xl border-b border-transparent py-0'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-3 sm:px-6 lg:px-12 flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 ${
          isScrolled ? 'h-14 sm:h-16' : 'h-16 sm:h-20'
        }`}
      >
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-space-lg min-w-0">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-space-sm group min-w-0">
            <img
              alt="Oxegène Coffee Logo"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 shrink-0 ${
                isScrolled ? 'h-8 sm:h-10' : 'h-9 sm:h-11 md:h-12'
              }`}
              src="./logob.png"
            />
            <span className="font-headline-sm sm:font-headline-md text-headline-sm sm:text-headline-md font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors truncate">
              Oxegène
            </span>
          </Link>

          {/* Desktop opening hours */}
          <div className="hidden xl:flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-surface-container-high/60 border border-white/5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              Ouvert • 07:30 - 23:00
            </span>
          </div>

          {/* Tablet compact badge */}
          <div className="hidden md:flex xl:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high/60 border border-white/5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
              Ouvert
            </span>
          </div>
        </div>

        {/* Right actions: Cart */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              document.getElementById('cart-drawer-backdrop')?.classList.remove('hidden');
              document.getElementById('cart-drawer')?.classList.remove('translate-x-full');
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all shadow-glow-primary shrink-0"
            type="button"
            aria-label="Voir le panier"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">shopping_bag</span>
            <span className="font-label-lg text-label-lg hidden md:inline">Panier</span>
            <span className="px-1.5 sm:px-2 py-0.5 min-w-[18px] sm:min-w-[22px] text-center rounded-full bg-on-primary-container text-on-primary font-bold text-xs sm:text-sm">
              {totalItems}
            </span>
            <span className="border-l border-white/20 pl-1.5 sm:pl-2 font-mono text-xs sm:text-sm font-semibold whitespace-nowrap">
              {total.toFixed(3)} <span className="hidden xs:inline text-[10px] sm:text-xs opacity-80">TND</span>
            </span>
          </button>
        </div>
      </div>

      {/* Scroll progress bar indicator */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-tertiary transition-all duration-75 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}

export default Navbar;
