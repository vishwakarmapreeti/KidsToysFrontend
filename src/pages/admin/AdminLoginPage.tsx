import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Star, ArrowRight, Shield, BarChart3, Users } from 'lucide-react';
import FormInput from '../../components/common/FormInput';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../services/authService';
import { setCredentials } from '../../store/slices/authSlice';
import { useAppDispatch } from '../../store/hooks';

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      if (res.data.user && res.data.token) {
        // Check if user is admin
        if (res.data.user.role === 'admin') {
          
dispatch(
          setCredentials({ user: res.data.user, token: res.data.token }),
        );
          navigate('/admin/dashboard', { replace: true });
        } else {
          setServerError('Access denied. Admin credentials required.');
        }
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Premium Admin Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden items-center justify-center p-12">
        {/* Animated background blobs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-14 h-14 bg-accent-200/40 rounded-full blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-sky-200/40 rounded-full blur-2xl" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-sm"
        >
          {/* Logo */}
          <div className="inline-flex items-center gap-2 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <Star className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <span className="font-display font-bold text-2xl text-neutral-900 block">
                Kids<span className="text-gradient-primary">Toys</span>
              </span>
              <span className="text-xs text-primary-600 font-semibold tracking-widest">ADMIN PANEL</span>
            </div>
          </div>

          {/* Admin Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 mb-8 shadow-sm">
            <Shield className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Secure Admin Access</span>
          </div>

          <h2 className="font-display font-bold text-3xl text-neutral-900 mb-3">
            Power & Control
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-8">
            Manage your premium kids toy store with advanced analytics, inventory, orders, and customer insights.
          </p>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: BarChart3, text: 'Advanced Analytics & Reports', delay: 0 },
              { icon: Users, text: 'Customer Management', delay: 0.1 },
              { icon: Shield, text: 'Secure Role-Based Access', delay: 0.2 },
            ].map(({ icon: Icon, text, delay }) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay }}
                className="flex items-center gap-3 bg-white/60 rounded-xl px-4 py-3 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-neutral-700">{text}</span>
              </motion.div>
            ))}
          </div>

          {/* Security Info */}
          <div className="mt-10 pt-8 border-t border-white/30">
            <p className="text-xs text-neutral-500 text-center">
              🔐 All admin activities are logged and monitored for security
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl text-neutral-900">
                Kids<span className="text-gradient-primary">Toys</span>
              </span>
              <span className="text-xs text-primary-600 font-semibold block">Admin</span>
            </div>
          </Link>

          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-50 rounded-full px-3 py-1.5 mb-4">
              <Shield className="w-3 h-3 text-primary-600" />
              <span className="text-xs font-semibold text-primary-700 tracking-widest">ADMIN ACCESS</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-neutral-900 mb-2">
              Admin Portal
            </h1>
            <p className="text-neutral-500 text-sm">
              Sign in to access the admin dashboard
            </p>
          </div>

          {/* Error Alert */}
          {serverError && (
            <AlertMessage
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
              className="mb-5"
            />
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              {...register('email')}
              label="Admin Email"
              type="email"
              placeholder="admin@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <FormInput
              {...register('password')}
              label="Password"
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              showPasswordToggle
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-400 accent-primary-500"
                />
                <span className="text-sm text-neutral-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base mt-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to Admin
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-neutral-500">Admin Only</span>
            </div>
          </div>

          {/* User Login Link */}
          <div className="text-center mb-6">
            <p className="text-sm text-neutral-600">
              Not an admin?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                User Login
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-primary-50 rounded-lg px-4 py-3.5 border border-primary-100">
            <p className="text-xs text-primary-700 text-center">
              <span className="font-semibold">🔐 Security Notice:</span> This is a restricted admin-only area. Only authorized administrators can access this section.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">
            By signing in, you agree to our{' '}
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 underline">Terms</Link>{' '}
            and{' '}
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
