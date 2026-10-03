import React from 'react';
import { useQuery } from 'react-query';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { Mascot } from 'page-mascot';
import useScrollReveal from '../../hooks/useScrollReveal';

function Hero() {
  const { data } = useQuery('content', api.getContent);
  const { orderMode, setOrderMode, tableNumber, setTableNumber } = useCart();
  const [heroRef, isVisible] = useScrollReveal({ threshold: 0.05 });

  const heroContent = data?.content?.hero || {};

  const openCartDrawer = () => {
    document.getElementById('cart-drawer-backdrop')?.classList.remove('hidden');
    document.getElementById('cart-drawer')?.classList.remove('translate-x-full');
  };

  return (
    <section
      ref={heroRef}
      className={`w-full max-w-7xl mx-auto mt-16 px-6 lg:px-12 pt-space-lg pb-4 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
        }`}
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low shadow-2xl p-8 lg:p-12 border border-white/5">
        {/* Glow effects */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary-container/25 rounded-full blur-3xl pointer-events-none"></div>


        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-space-xs px-3 py-1.5 rounded-full bg-primary-container/20 text-secondary">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Oxègene • Bar à Café Live
              </span>
            </div>

            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-on-surface tracking-tight leading-tight">
              {heroContent.title}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-tertiary">
                {heroContent.subtitle}
              </span>
            </h1>

            <p className="font-body-xl text-body-xl text-on-surface-variant max-w-xl">
              {heroContent.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container-lowest/80 text-on-surface">
                <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span>
                <span className="font-label-md text-label-md">{heroContent.currentLot}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-surface-container-lowest/80 text-on-surface">
                <span className="material-symbols-outlined text-secondary text-[18px]">speed</span>
                <span className="font-label-md text-label-md">{heroContent.averageExtraction}</span>
              </div>
            </div>
          </div>

          {/* Mascot — size set directly so getBoundingClientRect stays accurate */}
          <div className="w-full lg:w-auto flex items-center justify-center py-4 lg:py-0">
            <Mascot
              directions="/drone-directions.webp"
              reactions="/drone-reactions.webp"
              size={260}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
