import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, CreditCard, MapPin, Ticket, Edit2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const signOut = auth?.signOut ?? (async () => {});
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: user?.email || '',
    birthday: '',
    gender: 'Male'
  });
  const [activeView, setActiveView] = useState('info');

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">{user?.user_metadata?.full_name || 'User'}</h1>
          <div className="flex items-center gap-2 mt-2 text-gray-600">
            <span>{user?.email || 'No email'}</span>
            <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <CheckCircle size={14} /> Verified
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { key: 'orders', label: 'Order History', icon: Clock },
          { key: 'cards', label: 'Saved Cards', icon: CreditCard },
          { key: 'address', label: 'Delivery Address', icon: MapPin },
          { key: 'vouchers', label: 'My Vouchers', icon: Ticket },
        ].map((action) => {
          const isOrderAction = action.key === 'orders';
          return (
            <button
              key={action.key}
              onClick={() => {
                if (isOrderAction) return navigate('/dashboard');
                setActiveView(action.key);
              }}
              className={`flex flex-col items-center justify-center p-6 bg-white rounded-[10px] border ${activeView === action.key ? 'border-teal-500 shadow-md' : 'border-gray-200'} hover:shadow-md transition-all group cursor-pointer`}
            >
              <div className={`bg-teal-50 p-3 rounded-full text-teal-600 ${activeView === action.key ? 'bg-teal-600 text-white' : 'group-hover:bg-teal-600 group-hover:text-white'} transition-colors mb-3`}>
                <action.icon size={24} />
              </div>
              <span className="text-sm font-medium text-gray-800">{action.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content Area - switches based on activeView */}
      <div className="bg-white rounded-[10px] shadow-sm border border-gray-100 p-6 mb-8">
        {activeView === 'address' ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">Saved Addresses</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg">
                <div className="font-medium">Home</div>
                <div className="text-sm text-gray-600">123, Example Street, Lahore, Punjab</div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1 text-sm bg-teal-600 text-white rounded">Deliver Here</button>
                  <button className="px-3 py-1 text-sm border rounded">Edit</button>
                </div>
              </div>
              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center">
                <button className="px-4 py-2 bg-white border border-teal-600 text-teal-700 rounded">Add New Address</button>
              </div>
            </div>
          </>
        ) : activeView === 'cards' ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">Payment Methods</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-100 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-medium">Visa ending 4242</div>
                  <div className="text-sm text-gray-600">Expires 12/2025</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border rounded">Edit</button>
                  <button className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded">Remove</button>
                </div>
              </div>
              <div className="p-4 border border-dashed border-gray-200 rounded-lg text-center">
                <button className="px-4 py-2 bg-white border border-teal-600 text-teal-700 rounded">Add Payment Method</button>
              </div>
            </div>
          </>
        ) : activeView === 'vouchers' ? (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 border-b pb-4">My Vouchers</h2>
            <div className="text-gray-600">You have no vouchers at the moment.</div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-[10px] font-medium hover:bg-teal-700 transition-colors shadow-sm"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
