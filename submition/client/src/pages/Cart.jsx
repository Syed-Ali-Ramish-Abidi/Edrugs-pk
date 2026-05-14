import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, Lock, ShoppingCart, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, updateQty, removeItem, totalAmount } = useCart();
  const navigate = useNavigate();

  const handleInc = (id, currentQty) => {
    updateQty(id, currentQty + 1);
  };

  const handleDec = (id, currentQty) => {
    updateQty(id, Math.max(1, currentQty - 1));
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  const shippingFee = cart.length > 0 ? 150 : 0;
  const total = totalAmount + shippingFee;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Shopping Cart</h1>
          <span className="bg-teal-100 text-teal-800 text-sm font-semibold px-3 py-1 rounded-full">
            {cart.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          
          {/* Cart Items Column */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Cart Items</h2>
              </div>
              
              <AnimatePresence>
                {cart.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="p-12 text-center"
                  >
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <ShoppingCart size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Looks like you haven't added any medicines or products to your cart yet.</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-teal-600 text-white rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm">
                      Continue Shopping
                    </Link>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                        className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-teal-50/20 transition-colors"
                      >
                        {/* Image */}
                        <div className="w-20 h-20 rounded-[8px] border border-gray-200 overflow-hidden shrink-0 bg-white">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500 mb-1">{item.category}</p>
                          {(item.is_rx || item.requires_prescription || item.isRx) && (
                            <div className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1 inline-block">
                              REQUIRES PRESCRIPTION
                            </div>
                          )}
                          <div className="text-teal-700 font-bold">Rs. {item.price.toLocaleString()}</div>
                        </div>

                        {/* Actions (Qty + Remove) */}
                        <div className="flex items-center gap-4 sm:gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                          
                          {/* Qty Selector */}
                          <div className="flex items-center border border-teal-200 rounded-[10px] overflow-hidden bg-white shadow-sm shrink-0">
                            <button 
                              onClick={() => handleDec(item.id, item.qty)}
                              className="w-8 h-8 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
                            >
                              <Minus size={14} strokeWidth={2.5} />
                            </button>
                            <div className="w-10 text-center text-sm font-bold text-gray-800 bg-gray-50 h-8 flex items-center justify-center border-x border-teal-100">
                              {item.qty}
                            </div>
                            <button 
                              onClick={() => handleInc(item.id, item.qty)}
                              className="w-8 h-8 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-colors"
                            >
                              <Plus size={14} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Subtotal & Trash */}
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block w-24">
                              <span className="block text-xs text-gray-400 font-medium">Subtotal</span>
                              <span className="font-bold text-gray-800">Rs. {(item.price * item.qty).toLocaleString()}</span>
                            </div>
                            <button 
                              onClick={() => handleRemove(item.id)}
                              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
                              title="Remove item"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium text-gray-800">Rs. {totalAmount?.toLocaleString() || 0}</span>
                </div>
                
                <div className="flex items-center justify-between text-gray-600">
                  <span className="text-sm">Shipping Fee</span>
                  <span className="font-medium text-gray-800">Rs. {shippingFee.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-teal-700">Rs. {total.toLocaleString()}</span>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  disabled={cart.length === 0}
                  className="w-full mt-6 px-6 py-3.5 bg-teal-600 text-white rounded-[10px] font-bold text-base hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
                  <Lock size={14} />
                  <span className="text-xs font-medium uppercase tracking-wider">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
