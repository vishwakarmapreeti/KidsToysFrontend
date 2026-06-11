import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, PackageOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { closeCart, removeCartItem, selectCartCount, updateCartItem } from '../../store/slices/cartSlice';

export default function CartDrawer() {
  const navigate  = useNavigate();
  const [updating, setUpdating] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { cart, isCartOpen,  } = useAppSelector((state) => state.cart);

  const cartCount = useAppSelector((state) => selectCartCount(state));

  const handleUpdate = async (itemId: string, qty: number) => {
    setUpdating(itemId);
    try {
      await dispatch(updateCartItem({itemId, quantity: qty})).unwrap();
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    try {
      await dispatch(removeCartItem(itemId)).unwrap();
    } finally {
      setUpdating(null);
    }
  };

  const handleCheckout = () => {
    dispatch(closeCart())
    navigate('/checkout');
  };

  const handleClose = () => {
    dispatch(closeCart());
    navigate("/shop");

  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCart())}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-105 bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
                <h2 className="font-display font-bold text-lg text-neutral-900">
                  My Cart
                </h2>
                {cartCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
              >
                <X className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {!cart || cart.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <PackageOpen className="w-16 h-16 text-neutral-200 mb-4" />
                  <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-neutral-500 text-sm mb-6">
                    Add some amazing toys to get started!
                  </p>
                  <button
                    onClick={handleClose}
                    className="btn-primary px-6 py-2.5"
                  >
                    Browse Toys
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className={`flex gap-3 p-3 rounded-2xl border border-neutral-100 bg-neutral-50 transition-opacity ${updating === item._id ? "opacity-50" : ""}`}
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${item.product._id}`}
                        onClick={() => dispatch(closeCart())}
                        className="shrink-0"
                      >
                        <img
                          src={
                            item.product.images[0] ||
                            "https://via.placeholder.com/80"
                          }
                          alt={item.product.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product._id}`}
                          onClick={() => dispatch(closeCart())}
                          className="font-medium text-sm text-neutral-900 hover:text-primary-600 transition-colors line-clamp-2 leading-snug"
                        >
                          {item.product.name}
                        </Link>
                        <p className="font-bold text-neutral-900 mt-1">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>

                        {/* Quantity + Remove */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 border border-neutral-200 rounded-lg bg-white">
                            <button
                              onClick={() =>
                                handleUpdate(item._id, item.quantity - 1)
                              }
                              disabled={
                                item.quantity <= 1 || updating === item._id
                              }
                              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdate(item._id, item.quantity + 1)
                              }
                              disabled={
                                item.quantity >= item.product.stock ||
                                updating === item._id
                              }
                              className="p-1.5 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-40"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemove(item._id)}
                            disabled={updating === item._id}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="border-t border-neutral-100 px-5 py-4 space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>₹{cart.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-neutral-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">
                      {cart.totalPrice > 500 ? 'Free' : '₹0'}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-neutral-900 text-base pt-2 border-t border-neutral-100">
                    <span>Total</span>
                    <span>₹{(cart.totalPrice + (cart.totalPrice > 500 ? 0 : 0)).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Buttons */}
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => dispatch(closeCart())}
                  className="w-full py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
