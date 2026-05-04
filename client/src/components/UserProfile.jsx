import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, CreditCard, MapPin, Ticket, Edit2, LogOut } from 'lucide-react';

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState({
    email: 'i230651@isb.nu.edu.pk',
    birthday: '',
    gender: 'Male'
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">Ali Ramish</h1>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <span>+92 300 1234567</span>
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <CheckCircle size={14} /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Order History', icon: Clock },
          { label: 'Saved Cards', icon: CreditCard },
          { label: 'Delivery Address', icon: MapPin },
          { label: 'My Vouchers', icon: Ticket },
        ].map((action, idx) => (
          <button
            key={idx}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-[10px] border border-gray-200 hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="bg-teal-50 p-3 rounded-full text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors mb-3">
              <action.icon size={24} />
            </div>
            <span className="text-sm font-medium text-gray-800">{action.label}</span>
          </button>
        ))}
      </div>

      {/* User Info Form */}
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">Personal Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <button className="text-gray-400 hover:text-teal-600 transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Birthday */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Birthday</label>
              <button className="text-gray-400 hover:text-teal-600 transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
            <input
              type="date"
              value={userInfo.birthday}
              onChange={(e) => setUserInfo({ ...userInfo, birthday: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Gender */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <button className="text-gray-400 hover:text-teal-600 transition-colors">
                <Edit2 size={16} />
              </button>
            </div>
            <select
              value={userInfo.gender}
              onChange={(e) => setUserInfo({ ...userInfo, gender: e.target.value })}
              className="w-full px-4 py-2.5 rounded-[10px] bg-gray-50 border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
