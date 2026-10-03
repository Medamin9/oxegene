import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

function ProductCustomizer({ product, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('Regular (350ml)');
  const [milk, setMilk] = useState('Whole');
  const [sweetness, setSweetness] = useState('None');
  const [extraShot, setExtraShot] = useState(false);
  const [coldFoam, setColdFoam] = useState(false);
  const [caramelDrizzle, setCaramelDrizzle] = useState(false);
  const [notes, setNotes] = useState('');

  const calculatePrice = () => {
    let price = product.price;

    // Size upcharge
    if (size.includes('Large')) price += 1.5;

    // Milk upcharge
    if (milk !== 'Whole') price += 1.5;

    // Extras
    if (extraShot) price += 2.0;
    if (coldFoam) price += 1.5;
    if (caramelDrizzle) price += 1.0;

    return price;
  };

  const handleAddToCart = () => {
    const unitPrice = calculatePrice();
    const customizations = [];

    if (milk !== 'Whole') customizations.push(milk);
    if (sweetness !== 'None') customizations.push(sweetness + ' Sweet');
    if (extraShot) customizations.push('Extra Shot');
    if (coldFoam) customizations.push('Cold Foam');
    if (caramelDrizzle) customizations.push('Caramel');

    addToCart({
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice,
      size,
      customizations: customizations.join(', '),
      specialNotes: notes,
      imageUrl: product.imageUrl,
    });

    onClose();
  };

  const totalPrice = (calculatePrice() * quantity).toFixed(3);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal Dialog / Bottom Sheet */}
      <div className="relative z-10 w-full max-w-lg max-h-[92dvh] sm:max-h-[88vh] flex flex-col rounded-t-3xl sm:rounded-2xl glass-effect-3 shadow-2xl overflow-hidden animate-modal-pop border border-white/10">
        
        {/* Mobile Pull Handle Indicator */}
        <div className="w-full flex justify-center pt-2.5 pb-1 sm:hidden bg-surface-container/60">
          <div className="w-12 h-1 rounded-full bg-white/20" />
        </div>

        {/* Modal Header (Fixed at top) */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/5 flex items-start justify-between gap-3 shrink-0 bg-surface-container/40 backdrop-blur-md">
          <div className="space-y-0.5 min-w-0">
            <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider text-xs">
              {product.category?.name || 'Spécialité'}
            </span>
            <h3 className="font-headline-md sm:font-headline-lg text-headline-md sm:text-headline-lg text-on-surface font-bold truncate">
              {product.name}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1 sm:line-clamp-2">
              {product.description}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center shrink-0 transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-5 slim-scrollbar scroll-smooth">
          {/* Product Image */}
          {product.imageUrl && (
            <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden bg-surface-container-lowest border border-white/5">
              <img
                className="w-full h-full object-cover"
                src={product.imageUrl}
                alt={product.imageAlt || product.name}
              />
              <div className="absolute bottom-2.5 left-2.5 px-3 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md font-headline-sm text-headline-sm text-secondary text-xs sm:text-sm font-bold shadow-md">
                Base: {product.price.toFixed(3)} TND
              </div>
            </div>
          )}

          {/* Size */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between text-xs sm:text-sm">
              <span>Taille</span>
              <span className="text-on-surface-variant font-normal text-xs">Choisir une option</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Regular (350ml)', 'Large (480ml)'].map((s) => (
                <label key={s} className="cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={size === s}
                    onChange={(e) => setSize(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-full bg-surface-container-high peer-checked:bg-primary-container peer-checked:text-on-primary-container flex items-center justify-between text-on-surface transition-all border border-transparent peer-checked:border-primary/30">
                    <span className="font-label-md text-label-md text-xs sm:text-sm font-medium">{s.split(' ')[0]}</span>
                    <span className="font-label-sm text-label-sm text-outline peer-checked:text-on-primary-container text-xs">
                      {s.includes('Large') ? '+1.500' : '+0.000'}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Milk */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface font-semibold text-xs sm:text-sm">
              Choix du Lait
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: 'Entier', value: 'Whole' },
                { label: 'Avoine', value: 'Oat' },
                { label: 'Amande', value: 'Almond' },
                { label: 'Coco', value: 'Coconut' },
              ].map((m) => (
                <label key={m.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="milk"
                    value={m.value}
                    checked={milk === m.value}
                    onChange={(e) => setMilk(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="p-2 sm:p-2.5 text-center rounded-xl sm:rounded-full bg-surface-container-high peer-checked:bg-primary-container peer-checked:text-on-primary-container text-on-surface font-label-sm text-label-sm transition-all border border-transparent peer-checked:border-primary/30 text-xs sm:text-sm">
                    {m.label}{m.value !== 'Whole' && ' (+1.5)'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Sweetness */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface font-semibold text-xs sm:text-sm">
              Niveau de Sucre
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Sans', value: 'None' },
                { label: 'Normal', value: 'Standard' },
                { label: 'Très Sucré', value: 'Extra Sweet' },
              ].map((s) => (
                <label key={s.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="sweetness"
                    value={s.value}
                    checked={sweetness === s.value}
                    onChange={(e) => setSweetness(e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="p-2 sm:p-2.5 text-center rounded-xl sm:rounded-full bg-surface-container-high peer-checked:bg-primary peer-checked:text-on-primary text-on-surface font-label-sm text-label-sm transition-all border border-transparent peer-checked:border-primary/30 text-xs sm:text-sm">
                    {s.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="space-y-2">
            <label className="font-label-md text-label-md text-on-surface font-semibold text-xs sm:text-sm">
              Personnalisez Votre Tasse
            </label>
            <div className="space-y-2">
              {[
                {
                  label: "Shot d'Espresso Supplé.",
                  price: '+2.000 TND',
                  checked: extraShot,
                  onChange: setExtraShot,
                },
                {
                  label: 'Mousse Vanille Froide',
                  price: '+1.500 TND',
                  checked: coldFoam,
                  onChange: setColdFoam,
                },
                {
                  label: 'Filet de Caramel',
                  price: '+1.000 TND',
                  checked: caramelDrizzle,
                  onChange: setCaramelDrizzle,
                },
              ].map((extra, idx) => (
                <label
                  key={idx}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-surface-container-high cursor-pointer hover:bg-surface-container-highest transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={extra.checked}
                      onChange={(e) => extra.onChange(e.target.checked)}
                      className="w-4 h-4 rounded text-primary-container focus:ring-0 shrink-0"
                    />
                    <span className="font-label-sm sm:font-label-md text-label-sm sm:text-label-md text-on-surface truncate text-xs sm:text-sm">
                      {extra.label}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary font-mono shrink-0 ml-2 text-xs sm:text-sm">
                    {extra.price}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes au Barista */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface font-semibold text-xs sm:text-sm">
              Notes au Barista
            </label>
            <textarea
              className="w-full rounded-xl bg-surface-container-high p-3 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container text-xs sm:text-sm border border-white/5 resize-none"
              placeholder="Ex: Très chaud, décaféiné, peu de glace..."
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Sticky Actions Footer (Always visible on mobile & desktop) */}
        <div className="p-3 sm:p-4 bg-surface-container-high/95 backdrop-blur-xl border-t border-white/10 shrink-0 flex items-center justify-between gap-3 sm:gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 sm:gap-3 bg-surface-container-lowest/80 rounded-full p-1 sm:p-1.5 px-2.5 sm:px-3 border border-white/5 shrink-0">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Diminuer quantité"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">remove</span>
            </button>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface w-5 sm:w-6 text-center text-sm sm:text-base">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Augmenter quantité"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[15px] sm:text-[16px]">add</span>
            </button>
          </div>

          {/* Add to Cart CTA Button */}
          <button
            onClick={handleAddToCart}
            className="flex-1 h-11 sm:h-12 rounded-full bg-primary-container text-on-primary-container font-label-md sm:font-label-lg font-bold shadow-glow-primary hover:bg-primary-container/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-base px-3"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">add_shopping_cart</span>
            <span>Ajouter</span>
            <span className="opacity-60">•</span>
            <span className="font-mono">{totalPrice} TND</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductCustomizer;
