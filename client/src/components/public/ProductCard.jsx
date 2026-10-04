import React from 'react';
import useScrollReveal from '../../hooks/useScrollReveal';
import { resolveImageUrl } from '../../utils/api';

function ProductCard({ product, onClick, index = 0 }) {
  const [cardRef, isVisible] = useScrollReveal({
    threshold: 0.05,
    rootMargin: '0px 0px -40px 0px',
  });

  const staggerDelay = `${(index % 4) * 80}ms`;
  const imgSrc = resolveImageUrl(product.imageUrl);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      style={{ transitionDelay: isVisible ? staggerDelay : '0ms' }}
      className={`group cursor-pointer rounded-xl glass-effect card-hover-lift flex flex-col justify-between shadow-elevation-1 p-5 border border-white/5 hover:border-primary-container/40 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-[0.96] pointer-events-none'
      }`}
    >
      <div className="space-y-4">
        <div className="relative w-full h-48 rounded-md overflow-hidden">
          {imgSrc ? (
            <img
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
              src={imgSrc}
              alt={product.imageAlt || product.name}
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="w-full h-full items-center justify-center bg-surface-container-high"
            style={{ display: imgSrc ? 'none' : 'flex' }}
          >
            <span className="material-symbols-outlined text-[56px] text-on-surface-variant opacity-20">
              local_cafe
            </span>
          </div>
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold shadow-md">
              Meilleure Vente
            </span>
          )}
          {product.isSpecialty && !product.isBestSeller && (
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold shadow-md">
              Spécialité
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
      <div className="pt-4 mt-2 flex items-center justify-between">
        <span className="font-headline-md text-headline-md text-secondary">
          {product.price.toFixed(3)} <span className="font-label-sm text-label-sm text-on-surface-variant">TND</span>
        </span>
        <button className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg group-hover:bg-primary-container group-hover:text-on-primary-container transition-all">
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
