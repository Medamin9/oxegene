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

  const openCart = () => {
    document.getElementById('cart-drawer-backdrop')?.classList.remove('hidden');
    document.getElementById('cart-drawer')?.classList.remove('translate-x-full');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-2xl border-b border-primary/20 shadow-elevation-3'
          : 'bg-surface/80 backdrop-blur-xl border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'h-14' : 'h-16 sm:h-20'
          }`}
        >
          {/* ── Brand ── */}
          <Link to="/" className="flex items-center gap-2 group min-w-0">
            <img
              alt="Oxegène Coffee Logo"
              className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 shrink-0 ${
                isScrolled ? 'h-8' : 'h-9 sm:h-11'
              }`}
              src="./logob.png"
            />
            <span className="font-headline-sm sm:font-headline-md font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors truncate">
              Oxegène
            </span>
          </Link>

          {/* ── Opening badge (md+) ── */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high/60 border border-white/5">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse shrink-0"></span>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider whitespace-nowrap">
              Ouvert&nbsp;•&nbsp;07:30&nbsp;-&nbsp;23:00
            </span>
          </div>

          {/* ── Cart button ── */}
          <button
            onClick={openCart}
            type="button"
            aria-label="Voir le panier"
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary-container text-on-primary-container hover:bg-primary-container/90 hover:scale-105 active:scale-95 transition-all shadow-glow-primary shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>

            {/* label — hidden on xs */}
            <span className="hidden sm:inline font-label-lg">Panier</span>

            {/* item count badge */}
            <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1 rounded-full bg-on-primary-container text-on-primary font-bold text-xs leading-none">
              {totalItems}
            </span>

            {/* price — hidden on xs, shown from sm */}
            <span className="hidden sm:inline border-l border-white/20 pl-2 font-mono text-sm font-semibold whitespace-nowrap">
              {total.toFixed(3)}&nbsp;<span className="text-xs opacity-80">TND</span>
            </span>
          </button>
        </div>
      </div>

      {/* Scroll progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-tertiary transition-all duration-75 pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />
    </header>
  );
}

export default Navbar;
