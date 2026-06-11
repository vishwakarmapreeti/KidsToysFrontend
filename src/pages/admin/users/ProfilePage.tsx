import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Lock,
  Save, Package, Heart, ChevronRight,
  CheckCircle, Eye, EyeOff,
} from 'lucide-react';
// import Layout from '../../components/layout/Layout';
// import { useAuth } from '../../context/AuthContext';
// import userService from '../../services/userService';
import Layout from '../../../components/layout/Layout';
import { useAuth } from '../../../context/AuthContext';
import userService from '../../../services/userService';

export default function ProfilePage() {
  const { user, login, token } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'password'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');

  // Profile form
  const [profileForm, setProfileForm] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  });

  // Address form
  const [addressForm, setAddressForm] = useState({
    street:  (user as any)?.address?.street  || '',
    city:    (user as any)?.address?.city    || '',
    state:   (user as any)?.address?.state   || '',
    pincode: (user as any)?.address?.pincode || '',
    country: (user as any)?.address?.country || 'India',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]         = useState(false);

  const showMessage = (msg: string, isError = false) => {
    if (isError) setError(msg);
    else setSuccess(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  // ── Update profile ────────────────────────────────────
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await userService.updateProfile({
        name:    profileForm.name,
        phone:   profileForm.phone,
        address: addressForm,
      });
      // Update auth context
      if (token) {
        login(res.data.user as any, token);
      }
      showMessage('Profile updated successfully!');
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Failed to update', true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update address ────────────────────────────────────
  const handleAddressSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await userService.updateProfile({
        name:    profileForm.name,
        phone:   profileForm.phone,
        address: addressForm,
      });
      if (token) login(res.data.user as any, token);
      showMessage('Address updated successfully!');
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Failed to update', true);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Change password ───────────────────────────────────
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('New passwords do not match', true);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', true);
      return;
    }
    setIsLoading(true);
    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('Password changed successfully!');
    } catch (err: any) {
      showMessage(err.response?.data?.message || 'Failed to change password', true);
    } finally {
      setIsLoading(false);
    }
  };

  const TABS = [
    { id: 'profile',  label: 'Personal Info', icon: User },
    { id: 'address',  label: 'Address',        icon: MapPin },
    { id: 'password', label: 'Password',        icon: Lock },
  ] as const;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-neutral-900">
              {user?.name}
            </h1>
            <p className="text-neutral-500 text-sm">{user?.email}</p>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize mt-1 inline-block ${
              user?.role === 'admin'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role}
            </span>
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link
            to="/orders"
            className="flex items-center justify-between bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#FF6B6B]/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#FF6B6B]" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-sm">My Orders</p>
                <p className="text-xs text-neutral-500">Track your orders</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6B6B] transition-colors" />
          </Link>

          <Link
            to="/wishlist"
            className="flex items-center justify-between bg-white border border-neutral-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900 text-sm">Wishlist</p>
                <p className="text-xs text-neutral-500">Saved items</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-red-400 transition-colors" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-neutral-100 rounded-2xl p-1 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSuccess(''); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5 text-sm"
          >
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {success}
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-5 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* ── Tab: Personal Info ──────────────────────── */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
          >
            <h2 className="font-bold text-lg text-neutral-900 mb-5">Personal Information</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    value={profileForm.name}
                    onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              {/* Email — readonly */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm bg-neutral-50 text-neutral-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    value={profileForm.phone}
                    onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── Tab: Address ────────────────────────────── */}
        {activeTab === 'address' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
          >
            <h2 className="font-bold text-lg text-neutral-900 mb-5">Delivery Address</h2>
            <form onSubmit={handleAddressSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Street Address
                </label>
                <input
                  value={addressForm.street}
                  onChange={e => setAddressForm(p => ({ ...p, street: e.target.value }))}
                  placeholder="123 MG Road, Apartment 4B"
                  className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">City</label>
                  <input
                    value={addressForm.city}
                    onChange={e => setAddressForm(p => ({ ...p, city: e.target.value }))}
                    placeholder="Mumbai"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">State</label>
                  <input
                    value={addressForm.state}
                    onChange={e => setAddressForm(p => ({ ...p, state: e.target.value }))}
                    placeholder="Maharashtra"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Pincode</label>
                  <input
                    value={addressForm.pincode}
                    onChange={e => setAddressForm(p => ({ ...p, pincode: e.target.value }))}
                    placeholder="400001"
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Country</label>
                  <input
                    value={addressForm.country}
                    onChange={e => setAddressForm(p => ({ ...p, country: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Saving...' : 'Save Address'}
              </button>
            </form>
          </motion.div>
        )}

        {/* ── Tab: Password ────────────────────────────── */}
        {activeTab === 'password' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
          >
            <h2 className="font-bold text-lg text-neutral-900 mb-5">Change Password</h2>
            <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
              {/* Current password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B] transition-all"
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5">
                {[
                  'At least 6 characters',
                  'Mix of letters and numbers recommended',
                ].map(req => (
                  <div key={req} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    <p className="text-xs text-neutral-500">{req}</p>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-[#FF6B6B] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#ff5252] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}