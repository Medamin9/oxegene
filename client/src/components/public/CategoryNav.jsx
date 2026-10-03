import React, { useState, useEffect, useRef } from 'react';

const iconMap = {
  'ac_unit': 'ac_unit',
  'coffee': 'local_cafe',
  'coffee_maker': 'coffee_maker',
  'eco': 'eco',
  'bakery_dining': 'bakery_dining',
  'restaurant': 'lunch_dining',
  'local_cafe': 'local_cafe',
  'local_drink': 'local_drink',
  'cake': 'cake',
  'lunch_dining': 'lunch_dining',
};

// Navbar is h-14 when scrolled, h-16 (mobile) / h-20 (sm+) when at top
// CategoryNav sits immediately below it → top = navbar height
const NAV_TOP_SCROLLED = 56;   // 14 * 4px = 56px
const NAV_TOP_DEFAULT_MOBILE = 64;  // 16 * 4px = 64px
const NAV_TOP_DEFAULT_SM = 80;      // 20 * 4px = 80px
const NAV_HEIGHT = 52; // py-3 (12px*2) + ~28px button height

function CategoryNav({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const navContainerRef = useRef(null);
  const buttonRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy
      const scrollPosition = window.scrollY + NAV_TOP_SCROLLED + NAV_HEIGHT + 20;
      let currentSlug = categories[0]?.slug || '';

      for (let i = categories.length - 1; i >= 0; i--) {
        const el = document.getElementById(categories[i].slug);
        if (el && el.offsetTop <= scrollPosition) {
          currentSlug = categories[i].slug;
          break;
        }
      }

      setActiveSlug(currentSlug);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // Auto-scroll active pill into view inside the horizontal nav
  useEffect(() => {
    const btn = buttonRefs.current[activeSlug];
    const container = navContainerRef.current;
    if (!btn || !container) return;
    const btnLeft = btn.offsetLeft;
    const btnWidth = btn.offsetWidth;
    const containerWidth = container.offsetWidth;
    const currentScroll = container.scrollLeft;
    if (btnLeft < currentScroll || btnLeft + btnWidth > currentScroll + containerWidth) {
      container.scrollTo({
        left: btnLeft - containerWidth / 2 + btnWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [activeSlug]);

  const scrollToCategory = (slug) => {
    setActiveSlug(slug);
    const element = document.getElementById(slug);
    if (element) {
      const offset = NAV_TOP_SCROLLED + NAV_HEIGHT + 16;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed bar — always visible, never clipped by overflow:hidden parents */}
      <div
        className={`fixed left-0 right-0 z-40 w-full transition-all duration-300 py-3 ${
          isScrolled
            ? 'bg-surface/92 backdrop-blur-2xl shadow-elevation-2 border-b border-white/5'
            : 'bg-surface/85 backdrop-blur-xl border-b border-transparent'
        }`}
        style={{
          top: isScrolled
            ? `${NAV_TOP_SCROLLED}px`
            : window.innerWidth >= 640
            ? `${NAV_TOP_DEFAULT_SM}px`
            : `${NAV_TOP_DEFAULT_MOBILE}px`,
        }}
      >
        <div
          ref={navContainerRef}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {categories.map((category) => {
            const isActive = activeSlug === category.slug;
            return (
              <button
                key={category.id}
                ref={(el) => (buttonRefs.current[category.slug] = el)}
                onClick={() => scrollToCategory(category.slug)}
                className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container shadow-glow-primary scale-105 font-bold'
                    : 'bg-surface-container-high/70 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[16px] ${
                    isActive ? 'text-secondary' : 'text-on-surface-variant'
                  }`}
                >
                  {iconMap[category.icon] || 'local_cafe'}
                </span>
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spacer — pushes content down by exactly the height of the fixed bar */}
      <div style={{ height: NAV_HEIGHT }} />
    </>
  );
}

export default CategoryNav;
