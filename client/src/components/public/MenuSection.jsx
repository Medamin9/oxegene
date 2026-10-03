import React from 'react';
import ProductCard from './ProductCard';
import useScrollReveal from '../../hooks/useScrollReveal';

function MenuSection({ category, onProductClick }) {
  const [headerRef, isHeaderVisible] = useScrollReveal({
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  return (
    <div className="scroll-mt-36 space-y-6" id={category.slug}>
      <div
        ref={headerRef}
        className={`flex flex-col md:flex-row md:items-end justify-between gap-2 pb-3 transition-all duration-700 ${
          isHeaderVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-2 text-primary font-label-sm text-label-sm uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-[16px]">{category.icon || 'local_cafe'}</span>
            {category.slug.includes('oxygene-cafe') && 'Cafés Chauds Classiques • Préparés avec Soin'}
            {category.slug.includes('iced-coffee') && 'Cafés Glacés • Rafraîchissants & Savoureux'}
            {category.slug.includes('gaufres') && 'Gaufres Croustillantes • Garnitures Gourmandes'}
            {category.slug.includes('crepes') && 'Crêpes Fines & Généreuses • Saveurs Créatives'}
            {category.slug.includes('gateaux') && 'Pâtisseries Maison • Faites avec Amour'}
            {category.slug.includes('toasts') && 'Toasts Chauds • Pour les Petites Faims'}
            {category.slug.includes('eaux-et-jus') && 'Boissons Fraîches • Eaux & Jus Naturels'}
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">{category.name}</h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          {category.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {category.products.map((product, idx) => (
          <ProductCard
            key={product.id}
            index={idx}
            product={product}
            onClick={() => onProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
}

export default MenuSection;
