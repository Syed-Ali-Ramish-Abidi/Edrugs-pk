import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Home, Briefcase, Map } from 'lucide-react';

export default function AddressModal({ isOpen, onClose }) {
  const [view, setView] = useState('select'); // 'select' | 'add'
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [newAddressLabel, setNewAddressLabel] = useState('Home');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[10px] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              {view === 'select' ? 'Select Address' : 'Add New Address'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body content based on state */}
          <div className="p-5 overflow-y-auto flex-1">
            {view === 'select' && (
              <div className="space-y-4">
                {/* Saved Addresses List */}
                <div
                  onClick={() => setSelectedAddress('1')}
                  className={`border rounded-[10px] p-4 cursor-pointer transition-all ${
                    selectedAddress === '1'
                      ? 'border-teal-500 bg-teal-50/30'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddress === '1' ? 'border-teal-600' : 'border-gray-300'}`}>
                        {selectedAddress === '1' && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 text-sm">Home</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        1548 Staar Hostel ISLAMABAD
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedAddress('2')}
                  className={`border rounded-[10px] p-4 cursor-pointer transition-all ${
                    selectedAddress === '2'
                      ? 'border-teal-500 bg-teal-50/30'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAddress === '2' ? 'border-teal-600' : 'border-gray-300'}`}>
                        {selectedAddress === '2' && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-800 text-sm">Work</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Office 402, Software Technology Park, I-9/3, Islamabad
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add New Address Link */}
                <button
                  onClick={() => setView('add')}
                  className="mt-4 text-teal-600 font-medium text-sm hover:text-teal-700 flex items-center focus:outline-none"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {view === 'add' && (
              <div className="space-y-5">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your area or area name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* Map Placeholder */}
                <div className="w-full h-40 bg-gray-200 rounded-[10px] flex items-center justify-center relative border border-gray-300">
                  <div className="absolute text-teal-600 drop-shadow-md">
                    <MapPin size={32} />
                  </div>
                  <span className="text-sm text-gray-500 mt-12">Google Map Integration Here</span>
                </div>

                {/* Label Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Save address as</label>
                  <div className="flex gap-3">
                    {[
                      { id: 'Home', icon: Home },
                      { id: 'Work', icon: Briefcase },
                      { id: 'Other', icon: Map }
                    ].map((label) => (
                      <button
                        key={label.id}
                        onClick={() => setNewAddressLabel(label.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          newAddressLabel === label.id
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-teal-500'
                        }`}
                      >
                        <label.icon size={14} /> {label.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">House/Flat Number*</label>
                    <input
                      type="text"
                      placeholder="E.g. House No. 12"
                      className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Building/Society Name*</label>
                    <input
                      type="text"
                      placeholder="E.g. Staar Hostel"
                      className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex gap-3">
            {view === 'add' && (
              <button
                onClick={() => setView('select')}
                className="px-6 py-2.5 rounded-[10px] text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => {
                if (view === 'select') {
                  onClose(); // Proceed logic
                } else {
                  setView('select'); // Save and go back to select list
                }
              }}
              className="flex-1 bg-teal-600 text-white py-2.5 rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm"
            >
              {view === 'select' ? 'Continue' : 'Save Address'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
