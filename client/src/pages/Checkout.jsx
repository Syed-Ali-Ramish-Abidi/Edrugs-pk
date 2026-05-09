import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, UploadCloud, CreditCard, Banknote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, totalAmount, hasPrescriptionItem, clearCart } = useCart();
  const { user } = useAuth();
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [file, setFile] = useState(null);
  const [address, setAddress] = useState({ name: '', street: '', phone: '' });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadPrescription = async (file) => {
    try {
      // Generate clean, URL-friendly filename: rx-{timestamp}.{extension}
      const extension = file.name.split('.').pop();
      const filename = `rx-${Date.now()}.${extension}`;
      const { data, error } = await supabase.storage.from('prescriptions').upload(filename, file);
      if (error) throw error;
      const { data: publicData } = supabase.storage.from('prescriptions').getPublicUrl(filename);
      return publicData?.publicUrl || null;
    } catch (err) {
      console.error('Prescription upload error:', err);
      return null;
    }
  };

  const shippingFee = cart.length > 0 ? 150 : 0;
  const total = totalAmount + shippingFee;

  const handleConfirmOrder = async () => {
    if (!address.name || !address.street || !address.phone) {
      toast.error('Please fill in your full delivery address and phone number.');
      return;
    }

    const needsRx = cart.some(i => i.is_rx || i.isRx || i.requires_prescription);
    if (needsRx) {
      if (!file) {
        toast.error('Please upload a prescription for your Rx medicines.');
        return;
      }
      // Validate image type and size (<5MB)
      if (!file.type.startsWith('image/')) {
        toast.error('Prescription must be an image (JPG/PNG).');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Prescription image must be smaller than 5MB.');
        return;
      }
    }

    if (!user) {
      toast.error('Please log in to place an order.');
      navigate('/login');
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Step A: Insert Order
      const orderPayload = {
        user_id: user.id,
        items: cart,
        total_amount: total,
        delivery_address: `${address.name}, ${address.street}, ${address.phone}`,
        status: 'Pending',
        payment_method: paymentMethod
      };

      // If prescription present, upload and attach URL
      if (needsRx && file) {
        const publicUrl = await uploadPrescription(file);
        if (!publicUrl) {
          toast.error('Failed to upload prescription. Please try again.');
          setIsPlacingOrder(false);
          return;
        }
        orderPayload.prescription_url = publicUrl;
      }

      const { data: orderData, error: orderError } = await supabase.from('orders').insert([orderPayload]).select();
      if (orderError) throw orderError;

      // Step B: Sync Inventory
      for (const item of cart) {
        // Fetch current stock
        const { data: medData, error: medError } = await supabase.from('medicines').select('stock').eq('id', item.id).single();
        if (medError) throw medError;
        
        const currentStock = medData.stock || 0;
        const orderedQty = item.qty;
        
        await supabase.from('medicines').update({ stock: Math.max(0, currentStock - orderedQty) }).eq('id', item.id);
      }

      // Step C: Clear Cart
      clearCart();
      
      // Success Handling
      toast.success(`Order Placed! ID: ${orderData[0].id}`);
      navigate('/dashboard'); 
    } catch (err) {
      console.error('Error placing order:', err);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-200px)] py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight mb-6">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Left Column - Checkout Steps */}
          <div className="lg:col-span-8 space-y-6">

            {/* Delivery Address Card */}
            <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MapPin size={20} className="text-teal-600" />
                  Delivery Address
                </h2>
              </div>
              <div className="bg-gray-50 rounded-[8px] p-4 border border-gray-100 space-y-3">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={address.name} 
                  onChange={(e) => setAddress({...address, name: e.target.value})} 
                  className="w-full p-2 border border-gray-200 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <input 
                  type="text" 
                  placeholder="Full Address" 
                  value={address.street} 
                  onChange={(e) => setAddress({...address, street: e.target.value})} 
                  className="w-full p-2 border border-gray-200 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                />
                <input 
                  type="text" 
                  placeholder="Phone Number" 
                  value={address.phone} 
                  onChange={(e) => setAddress({...address, phone: e.target.value})} 
                  className="w-full p-2 border border-gray-200 rounded text-sm focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            {/* Smart Prescription Logic Area */}
            <AnimatePresence mode="wait">
              {hasPrescriptionItem ? (
                /* Upload Card (Only shows if isRx is true for any item) */
                <motion.div
                  key="upload-box"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-teal-50 rounded-[10px] shadow-sm border-2 border-dashed border-teal-300 overflow-hidden p-6 transition-all hover:bg-teal-100/50"
                >
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <UploadCloud size={20} className="text-teal-600" />
                    Upload Prescription
                  </h2>
                  <p className="text-sm text-gray-600 mb-5">Required for Rx (prescription-only) medicines in your cart. Valid formats: JPG, PNG, PDF.</p>

                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-white border border-teal-200 px-5 py-2.5 rounded-[8px] text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors shadow-sm inline-block">
                      Choose File
                      <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
                    </label>
                    <span className="text-sm font-medium text-gray-500 truncate max-w-[200px] md:max-w-xs">
                      {file ? file.name : 'No file chosen'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* Fallback UI (Shows if no items require prescription) */
                <motion.div
                  key="success-box"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 rounded-[10px] shadow-sm border border-green-200 p-4 flex items-start gap-3"
                >
                  <CheckCircle2 size={20} className="text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-green-800">No prescription required</h3>
                    <p className="text-sm text-green-700 mt-0.5">The items in your cart do not require a medical prescription. You're good to go!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Method Card */}
            <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h2>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-[8px] cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-gray-200 hover:border-teal-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="ml-3 flex items-center gap-2 text-gray-800 font-medium">
                    <Banknote size={18} className="text-gray-500" />
                    Cash on Delivery
                  </span>
                </label>

                <label className={`flex items-center p-4 border rounded-[8px] cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-teal-500 bg-teal-50/50 shadow-sm' : 'border-gray-200 hover:border-teal-300'}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500 cursor-pointer"
                  />
                  <span className="ml-3 flex items-center gap-2 text-gray-800 font-medium">
                    <CreditCard size={18} className="text-gray-500" />
                    Credit/Debit Card
                  </span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-[10px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>
              </div>

              <div className="p-5 space-y-4">
                {/* Dynamic Mini Cart Items */}
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-start justify-between text-sm">
                      <span className="text-gray-600 max-w-[180px] truncate">
                        {item.name} <span className="text-gray-400 text-xs ml-1">(x{item.qty})</span>
                      </span>
                      <span className="font-medium text-gray-800 shrink-0">
                        Rs. {(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-gray-600 pt-4 border-t border-gray-100">
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

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmOrder}
                  disabled={isPlacingOrder || cart.length === 0}
                  className="w-full mt-6 px-6 py-3.5 bg-teal-600 text-white rounded-[10px] font-bold text-base hover:bg-teal-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : 'Place Order'}
                </motion.button>

                <div className="flex items-center justify-center gap-2 mt-4 text-teal-700 bg-teal-50 p-2.5 rounded-[8px] border border-teal-100">
                  <ShieldCheck size={16} />
                  <span className="text-xs font-semibold tracking-wide">100% SECURE CHECKOUT</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
