import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, CreditCard,ChevronRight,
  ShoppingBag, ArrowLeft, Check, Phone
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import type { ShippingAddress } from '../../services/orderService';

declare global {
  interface Window { Razorpay: any; }
}

const STEPS = ['Shipping', 'Payment', 'Review'];

export default function CheckoutPage() {
  const { cart, clearCart }    = useCart();
  const { user }               = useAuth();
  const navigate               = useNavigate();

  const [step, setStep]         = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState('');

  const [address, setAddress] = useState<ShippingAddress>({
    street:  '',
    city:    '',
    state:   '',
    pincode: '',
    country: 'India',
    phone:   user?.phone || '',
  });

  const [paymentMethod] = useState<'razorpay'>('razorpay');

  const shippingPrice = cart && cart.totalPrice > 500 ? 0 : 0;
  const total         = cart ? cart.totalPrice + shippingPrice : 0;

  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setError('');
    setIsLoading(true);
    try {
      // Create order
      const orderRes = await orderService.createOrder({
        shippingAddress: address,
        paymentMethod,
      });
      const order = orderRes.data.order;

     

      // Razorpay
      const rzpRes = await orderService.createRazorpayOrder(order._id);
      const { razorpayOrder, key } = rzpRes.data;

      const options = {
        key,
        amount:   razorpayOrder.amount,
        currency: 'INR',
        name:     'Kids Toys Store',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        prefill: {
          name:    user?.name,
          email:   user?.email,
          contact: address.phone,
        },
        theme: { color: '#FF6B6B' },
        handler: async (response: any) => {
          try {
            await orderService.verifyPayment(order._id, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });
            await clearCart();
            navigate(`/order-success/${order._id}`);
          } catch {
            setError('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment cancelled. Please try again.');
            setIsLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart) return null;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : navigate('/cart')}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-bold text-2xl text-neutral-900">Checkout</h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                i === step
                  ? 'bg-[#FF6B6B] text-white'
                  : i < step
                  ? 'bg-green-100 text-green-700'
                  : 'bg-neutral-100 text-neutral-500'
              }`}>
                {i < step
                  ? <Check className="w-4 h-4" />
                  : <span className="w-4 h-4 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                }
                {s}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-8 rounded ${i < step ? 'bg-green-400' : 'bg-neutral-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">

            {/* Step 0 — Shipping */}
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-5 h-5 text-[#FF6B6B]" />
                  <h2 className="font-bold text-lg text-neutral-900">Shipping Address</h2>
                </div>

                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>


                    
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        required
                        type="tel"
                        value={address.phone}
                        onChange={e => setAddress(p => ({ ...p, phone: e.target.value }))}
                        placeholder="9876543210"
                        className="w-full pl-10 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={address.street}
                      onChange={e => setAddress(p => ({ ...p, street: e.target.value }))}
                      placeholder="123 MG Road, Apartment 4B"
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={address.city}
                        onChange={e => setAddress(p => ({ ...p, city: e.target.value }))}
                        placeholder="Mumbai"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={address.state}
                        onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                        placeholder="Maharashtra"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Pincode <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        value={address.pincode}
                        onChange={e => setAddress(p => ({ ...p, pincode: e.target.value }))}
                        placeholder="400001"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Country</label>
                      <input
                        value={address.country}
                        onChange={e => setAddress(p => ({ ...p, country: e.target.value }))}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B6B]/30 focus:border-[#FF6B6B]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#FF6B6B] text-white py-3 rounded-xl font-semibold hover:bg-[#ff5252] transition-colors mt-2"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 1 — Payment */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard className="w-5 h-5 text-[#FF6B6B]" />
                  <h2 className="font-bold text-lg text-neutral-900">Payment Method</h2>
                </div>

                <div className="space-y-3">
                  {/* Razorpay */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#FF6B6B] bg-red-50/50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="razorpay"
                   
                      className="accent-[#FF6B6B]"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 text-sm">Razorpay</p>
                        <p className="text-xs text-neutral-500">Cards, UPI, Netbanking, Wallets</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Recommended
                    </span>
                  </label>

            
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B6B] text-white py-3 rounded-xl font-semibold hover:bg-[#ff5252] transition-colors mt-6"
                >
                  Review Order
                  <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* Step 2 — Review */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Shipping summary */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FF6B6B]" />
                      <h3 className="font-semibold text-neutral-900">Shipping to</h3>
                    </div>
                    <button
                      onClick={() => setStep(0)}
                      className="text-xs text-[#FF6B6B] font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600">
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-neutral-600">{address.phone}</p>
                </div>

                {/* Payment summary */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#FF6B6B]" />
                      <h3 className="font-semibold text-neutral-900">Payment</h3>
                    </div>
                    <button onClick={() => setStep(1)} className="text-xs text-[#FF6B6B] font-medium hover:underline">
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 capitalize">Razorpay</p>
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
                  <h3 className="font-semibold text-neutral-900 mb-4">
                    Items ({cart.items.length})
                  </h3>
                  <div className="space-y-3">
                    {cart.items.map(item => (
                      <div key={item._id} className="flex gap-3">
                        <img
                          src={item.product.images[0] || 'https://via.placeholder.com/60'}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-neutral-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm">{error}</div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-[#FF6B6B] text-white py-4 rounded-xl font-bold text-base hover:bg-[#ff5252] transition-colors disabled:opacity-60 shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isLoading ? 'Placing Order...'  : 'Pay Now'}
                </button>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm h-fit sticky top-24">
            <h3 className="font-bold text-neutral-900 mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4">
              {cart.items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-neutral-600 truncate mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-neutral-900 flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span className={shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                  {shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 text-base pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}