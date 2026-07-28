import React from 'react';
import { X, ShoppingBag, Trash2, Leaf, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckoutSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onCheckoutSuccess,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => {
    if (item.mode === 'rent') {
      return acc + (item.product.rentalPricePerDay || 15) * (item.rentalDays || 3) * item.quantity;
    }
    return acc + item.product.price * item.quantity;
  }, 0);

  const totalPoints = cartItems.reduce((acc, item) => acc + item.product.sustainabilityPoints, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md h-full backdrop-blur-2xl bg-white dark:bg-slate-950 border-l border-purple-500/30 p-6 flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
                Marketplace Cart
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-purple-500/10 text-slate-700 dark:text-purple-300 hover:bg-purple-500/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4 pt-4">
            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 dark:text-purple-300/60 font-mono text-xs">
                Your circular fashion cart is empty.
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={`${item.product.id}_${idx}`}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-purple-950/10 dark:bg-purple-950/30 border border-purple-500/20"
                >
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.product.title}
                    </div>
                    <div className="text-[10px] font-mono text-purple-600 dark:text-purple-300">
                      Mode: <span className="uppercase">{item.mode}</span> {item.mode === 'rent' && `(${item.rentalDays} Days)`}
                    </div>
                    <div className="text-xs font-bold font-serif text-slate-900 dark:text-white mt-1">
                      ${item.mode === 'rent' ? (item.product.rentalPricePerDay || 15) * (item.rentalDays || 3) : item.product.price}
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-rose-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Summary & Checkout */}
        {cartItems.length > 0 && (
          <div className="pt-4 border-t border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30">
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Green Points Earned:</span>
              </div>
              <span className="font-bold">+{totalPoints} Pts</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold font-serif text-slate-900 dark:text-white">
                Total Order:
              </span>
              <span className="text-2xl font-bold font-serif text-slate-900 dark:text-white">
                ${totalAmount}
              </span>
            </div>

            <button
              onClick={() => {
                onCheckoutSuccess();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold text-xs shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Sustainable Order</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
