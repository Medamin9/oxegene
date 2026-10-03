import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import OrderConfirmation from './OrderConfirmation';

function CartDrawer() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal, getTotalItems, orderMode, tableNumber } = useCart();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const createOrderMutation = useMutation(api.createOrder, {
    onSuccess: (data) => {
      setOrderDetails(data.order);
      setShowConfirmation(true);
      clearCart();
      closeDrawer();
    },
    onError: (error) => {
      alert(error.message || 'Failed to create order');
    },
  });

  const closeDrawer = () => {
    document.getElementById('cart-drawer-backdrop')?.classList.add('hidden');
    document.getElementById('cart-drawer')?.classList.add('translate-x-full');
  };

  const handleCheckout = () => {
    if (!customerName || !customerPhone) {
      alert('Veuillez renseigner votre nom et numéro de téléphone');
      return;
    }
    if (cart.length === 0) {
      alert('Votre plateau est vide');
      return;
    }

    const orderData = {
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      orderType: orderMode,
      tableNumber: orderMode === 'DINE_IN' ? tableNumber : undefined,
      deliveryAddress: orderMode === 'DELIVERY' ? deliveryAddress : undefined,
      specialNotes: specialNotes || undefined,
      items: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        size: item.size,
        customizations: item.customizations,
        specialNotes: item.specialNotes,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  const totalItems = getTotalItems();
  const total = getTotal();

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md hidden transition-opacity"
        onClick={closeDrawer}
      />

      {/* Drawer — full-width on mobile, capped at md on larger screens */}
      <div
        id="cart-drawer"
        className="fixed top-0 right-0 h-[100dvh] w-full sm:max-w-md z-50 flex flex-col bg-surface-container-low shadow-elevation-3 transform translate-x-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] border-l border-white/5"
      >

        {/* ── Header ── */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-surface-container border-b border-white/5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px] sm:text-[24px]">shopping_bag</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold text-base sm:text-lg">Votre Plateau</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold text-xs sm:text-sm min-w-[22px] text-center">
              {totalItems}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Fermer le panier"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
          </button>
        </div>

        {/* ── Cart Items (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3 slim-scrollbar scroll-smooth">
          {cart.length === 0 ? (
            <div className="h-56 sm:h-64 flex flex-col items-center justify-center text-center space-y-3 px-4">
              <span className="material-symbols-outlined text-[44px] sm:text-[52px] text-outline">local_cafe</span>
              <p className="font-headline-sm text-headline-sm text-on-surface text-sm sm:text-base">Votre plateau est vide</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-xs sm:text-sm">
                Sélectionnez une boisson ou une gourmandise de notre menu.
              </p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 40}ms` }}
                className="p-3 sm:p-4 rounded-xl bg-surface-container flex flex-col gap-2 shadow-sm animate-fade-in border border-white/5 hover:border-primary-container/30 transition-all duration-300"
              >
                {/* Item row: info + delete */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface text-sm sm:text-base truncate">
                      {item.productName}
                    </h4>
                    <p className="font-body-sm text-body-sm text-secondary text-xs sm:text-sm truncate">
                      {item.size}{item.customizations ? ` • ${item.customizations}` : ''}
                    </p>
                    {item.specialNotes && (
                      <p className="font-body-sm text-body-sm text-outline-variant italic text-xs mt-0.5 truncate">
                        Note: "{item.specialNotes}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Supprimer ${item.productName}`}
                    className="text-outline hover:text-error transition-colors p-1 shrink-0 mt-0.5"
                  >
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px]">delete</span>
                  </button>
                </div>

                {/* Price + Quantity */}
                <div className="flex items-center justify-between pt-0.5">
                  <span className="font-mono text-on-surface font-semibold text-xs sm:text-sm">
                    {(item.unitPrice * item.quantity).toFixed(3)} TND
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-surface-container-high rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      aria-label="Diminuer quantité"
                      className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px] sm:text-[14px]">remove</span>
                    </button>
                    <span className="font-mono font-bold text-on-surface w-4 text-center text-xs sm:text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      aria-label="Augmenter quantité"
                      className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-primary-container hover:text-on-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[13px] sm:text-[14px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Checkout Section (sticky footer when cart has items) ── */}
        {cart.length > 0 && (
          <div className="px-3 sm:px-5 py-3 sm:py-4 bg-surface-container space-y-3 shadow-elevation-3 border-t border-white/5 shrink-0">

            {/* Customer info fields */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Votre Nom *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="h-9 sm:h-10 rounded-full bg-surface-container-high px-3 sm:px-4 text-on-surface text-xs sm:text-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5 w-full"
                />
                <input
                  type="tel"
                  placeholder="Téléphone *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="h-9 sm:h-10 rounded-full bg-surface-container-high px-3 sm:px-4 text-on-surface text-xs sm:text-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5 w-full"
                />
              </div>
              <input
                type="email"
                placeholder="Email (optionnel)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full h-9 sm:h-10 rounded-full bg-surface-container-high px-3 sm:px-4 text-on-surface text-xs sm:text-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5"
              />
              {orderMode === 'DELIVERY' && (
                <input
                  type="text"
                  placeholder="Adresse de Livraison *"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full h-9 sm:h-10 rounded-full bg-surface-container-high px-3 sm:px-4 text-on-surface text-xs sm:text-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5"
                />
              )}
              <input
                type="text"
                placeholder="Demandes spéciales (optionnel)"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full h-9 sm:h-10 rounded-full bg-surface-container-high px-3 sm:px-4 text-on-surface text-xs sm:text-sm placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary-container border border-white/5"
              />
            </div>

            {/* Order summary pill */}
            <div className="px-3 py-2.5 rounded-xl bg-surface-container-high/80 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold text-xs">
                  Destination
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                  {orderMode === 'DINE_IN' ? `Sur place • ${tableNumber.split(' ')[1]}` : 'À Emporter'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-on-surface-variant text-xs sm:text-sm">Sous-total</span>
                <span className="font-mono text-on-surface font-semibold text-xs sm:text-sm">{total.toFixed(3)} TND</span>
              </div>
              <div className="flex justify-between items-baseline pt-0.5 border-t border-white/5">
                <span className="font-bold text-on-surface text-sm sm:text-base">Total à Payer</span>
                <span className="text-secondary font-mono font-bold text-sm sm:text-base">{total.toFixed(3)} TND</span>
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={handleCheckout}
              disabled={createOrderMutation.isLoading}
              className="w-full h-11 sm:h-12 rounded-full bg-primary-container hover:bg-primary-container/90 active:scale-95 text-on-primary-container font-bold text-sm sm:text-base transition-all shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createOrderMutation.isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                  <span>En cours...</span>
                </>
              ) : (
                <>
                  <span>Confirmer la Commande</span>
                  <span className="material-symbols-outlined text-[18px]">east</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {showConfirmation && orderDetails && (
        <OrderConfirmation order={orderDetails} onClose={() => setShowConfirmation(false)} />
      )}
    </>
  );
}

export default CartDrawer;
