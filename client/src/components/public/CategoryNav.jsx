import React, { useState, useEffect, useRef } from 'react';

const iconMap = {
  'ac_unit': 'ac_unit',
  'coffee': 'local_cafe',
  'coffee_maker': 'coffee_maker',
  'eco': 'eco',
  'bakery_dining': 'bakery_dining',
  'restaurant': 'lunch_dining',
};

function CategoryNav({ categories }) {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug || '');
  const [isScrolled, setIsScrolled] = useState(false);
  const navContainerRef = useRef(null);
  const buttonRefs = useRef({});

  // Detect scroll position to track active section & sticky state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // ScrollSpy: Determine active category
      const scrollPosition = window.scrollY + 200; // Account for navbar & offset
      let currentSlug = activeSlug;

      for (let i = 0; i < categories.length; i++) {
        const cat = categories[i];
        const el = document.getElementById(cat.slug);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            currentSlug = cat.slug;
            break;
          }
        }
      }

      if (currentSlug && currentSlug !== activeSlug) {
        setActiveSlug(currentSlug);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, activeSlug]);

  // Keep active category button visible inside horizontal scroll container
  useEffect(() => {
    if (activeSlug && buttonRefs.current[activeSlug] && navContainerRef.current) {
      const activeBtn = buttonRefs.current[activeSlug];
      const container = navContainerRef.current;
      const btnLeft = activeBtn.offsetLeft;
      const btnWidth = activeBtn.offsetWidth;
      const containerWidth = container.offsetWidth;
      const currentScroll = container.scrollLeft;

      if (btnLeft < currentScroll || btnLeft + btnWidth > currentScroll + containerWidth) {
        container.scrollTo({
          left: btnLeft - containerWidth / 2 + btnWidth / 2,
          behavior: 'smooth',
        });
      }
    }
  }, [activeSlug]);

  const scrollToCategory = (slug) => {
    setActiveSlug(slug);
    const element = document.getElementById(slug);
    if (element) {
      const offset = 140; // Account for fixed header + sticky nav
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`sticky z-30 w-full transition-all duration-300 py-3 ${
        isScrolled
          ? 'top-16 bg-surface/90 backdrop-blur-2xl shadow-elevation-2 border-b border-white/5'
          : 'top-20 bg-surface/80 backdrop-blur-xl shadow-md border-b border-transparent'
      }`}
    >
      <div
        ref={navContainerRef}
        className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {categories.map((category) => {
          const isActive = activeSlug === category.slug;
          return (
            <button
              key={category.id}
              ref={(el) => (buttonRefs.current[category.slug] = el)}
              onClick={() => scrollToCategory(category.slug)}
              className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-glow-primary scale-105 font-bold'
                  : 'bg-surface-container-high/70 text-on-surface hover:bg-surface-container-high hover:scale-100'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] transition-transform duration-300 ${
                  isActive ? 'scale-110 text-secondary' : 'text-on-surface-variant'
                }`}
              >
                {iconMap[category.icon] || 'local_cafe'}
              </span>
              {category.name}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryNav;
