import React from 'react';
import { useCart } from '../../context/CartContext';

function OrderConfirmation({ order, onClose }) {
  const { tableNumber, orderMode } = useCart();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-container-lowest/85 backdrop-blur-2xl"></div>
      
      <div className="relative z-10 w-full max-w-md rounded-xl bg-surface-container-low p-6 md:p-8 space-y-6 shadow-elevation-3 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container mx-auto flex items-center justify-center shadow-glow-primary-strong animate-bounce">
          <span className="material-symbols-outlined text-[32px]">check_circle</span>
        </div>

        <div className="space-y-1">
          <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-bold">
            Commande Reçue • Barista en Action
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Commande Confirmée !
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Votre commande est en cours de préparation au bar à espresso.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-surface-container text-left space-y-3 font-body-sm text-body-sm">
          <div className="flex justify-between items-center pb-2">
            <span className="font-label-sm text-label-sm uppercase text-outline">
              Numéro de Ticket
            </span>
            <span className="font-mono text-primary font-bold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Temps Estimé:</span>
            <span className="text-on-surface font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
              10 - 15 Min
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-on-surface-variant">Destination:</span>
            <span className="text-on-surface font-semibold">
              {orderMode === 'DINE_IN' ? tableNumber : 'Comptoir À Emporter'}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-on-surface font-bold">Total:</span>
            <span className="font-headline-sm text-headline-sm text-secondary font-mono font-bold">
              {order.total.toFixed(3)} TND
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-full bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-all"
        >
          Retour au Menu
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmation;
