import React from 'react';
import { useCart } from '../../context/CartContext';

function FloatingCartButton() {
  const { getTotalItems, getTotal } = useCart();

  const openCart = () => {
    document.getElementById('cart-drawer-backdrop')?.classList.remove('hidden');
    document.getElementById('cart-drawer')?.classList.remove('translate-x-full');
  };

  if (getTotalItems() === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={openCart}
        className="flex items-center gap-3 px-5 py-3 rounded-full bg-primary-container text-on-primary-container shadow-glow-primary-strong hover:scale-105 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined text-[24px]">coffee</span>
        <span className="font-label-lg text-label-lg font-bold">Mon Plateau</span>
        <span className="px-2.5 py-0.5 rounded-full bg-on-primary-container text-on-primary font-label-sm text-label-sm font-bold">
          {getTotalItems()}
        </span>
        <span className="font-label-md text-label-md font-mono hidden sm:inline">
          {getTotal().toFixed(3)} TND
        </span>
      </button>
    </div>
  );
}

export default FloatingCartButton;
