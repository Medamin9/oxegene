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
      alert('Please provide your name and phone number');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
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

  return (
    <>
      <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-surface-container-lowest/80 backdrop-blur-md hidden transition-opacity" onClick={closeDrawer}></div>
      
      <div id="cart-drawer" className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-surface-container-low shadow-elevation-3 flex flex-col justify-between transform translate-x-full transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] border-l border-white/5">
        {/* Header */}
        <div className="p-6 bg-surface-container flex items-center justify-between shadow-md border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">shopping_bag</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Votre Plateau</h3>
            <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
              {getTotalItems()}
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 slim-scrollbar scroll-smooth">
          {cart.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
              <span className="material-symbols-outlined text-[48px] text-outline">local_cafe</span>
              <p className="font-headline-sm text-headline-sm text-on-surface">Votre plateau est vide</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Sélectionnez une boisson ou une gourmandise de notre menu.
              </p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 40}ms` }}
                className="p-4 rounded-xl bg-surface-container flex flex-col gap-2 shadow-sm animate-fade-in border border-white/5 hover:border-primary-container/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-label-lg text-label-lg font-bold text-on-surface">{item.productName}</h4>
                    <p className="font-body-sm text-body-sm text-secondary">
                      {item.size} • {item.customizations}
                    </p>
                    {item.specialNotes && (
                      <p className="font-body-sm text-body-sm text-outline-variant italic">
                        Note: "{item.specialNotes}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-outline hover:text-error transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-on-surface font-semibold">
                    {(item.unitPrice * item.quantity).toFixed(3)} TND
                  </span>
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface text-[12px] hover:bg-primary-container hover:text-on-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">remove</span>
                    </button>
                    <span className="font-mono font-bold text-label-md text-on-surface w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-on-surface text-[12px] hover:bg-primary-container hover:text-on-primary-container transition-all"
                    >
                      <span className="material-symbols-outlined text-[14px]">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout section */}
        {cart.length > 0 && (
          <div className="p-6 bg-surface-container space-y-4 shadow-elevation-3">
            {/* Customer info */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Votre Nom *"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full h-10 rounded-full bg-surface-container-high px-4 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none"
              />
              <input
                type="tel"
                placeholder="Numéro de Téléphone *"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full h-10 rounded-full bg-surface-container-high px-4 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email (optionnel)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full h-10 rounded-full bg-surface-container-high px-4 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none"
              />
              {orderMode === 'DELIVERY' && (
                <input
                  type="text"
                  placeholder="Adresse de Livraison *"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full h-10 rounded-full bg-surface-container-high px-4 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none"
                />
              )}
              <input
                type="text"
                placeholder="Demandes spéciales (optionnel)"
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full h-10 rounded-full bg-surface-container-high px-4 text-on-surface font-body-sm text-body-sm placeholder:text-outline focus:outline-none"
              />
            </div>

            {/* Order summary */}
            <div className="p-3 rounded-lg bg-surface-container-high/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">
                  Destination
                </span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container">
                  {orderMode === 'DINE_IN' ? `Sur place: ${tableNumber.split(' ')[1]}` : 'À Emporter'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-mono text-on-surface">{getTotal().toFixed(3)} TND</span>
              </div>
              <div className="pt-2 flex justify-between items-baseline font-headline-md text-headline-md text-on-surface">
                <span className="font-bold">Total à Payer</span>
                <span className="text-secondary font-mono font-bold">{getTotal().toFixed(3)} TND</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={createOrderMutation.isLoading}
              className="w-full h-12 rounded-full bg-primary-container hover:bg-primary-container/90 text-on-primary-container font-label-lg text-label-lg transition-all shadow-glow-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
