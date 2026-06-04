import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Star, ArrowRight, CheckCircle } from 'lucide-react';

import FormInput from '../../components/common/FormInput';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../services/authService';

const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Enter a valid email address'),
  phone:           z.string().optional(),
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setIsLoading(true);
    try {
      const { confirmPassword, ...payload } = data;
      void confirmPassword;
      await authService.register(payload);
      setSuccess(true);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-hero-gradient">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-card-hover p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
            Registration Successful!
          </h2>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            We've sent a verification link to your email address. Please check your inbox and verify your account to continue.
          </p>
          <button onClick={() => navigate('/login')} className="btn-primary w-full py-3">
            Go to Login <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-50 via-sky-50 to-secondary-50 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-10 right-10 w-24 h-24 bg-accent-200/30 rounded-full blur-2xl" />
        <div className="absolute bottom-16 left-8 w-32 h-32 bg-sky-200/30 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-sm text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-2xl text-neutral-900">
              Kids<span className="text-gradient-primary">Toys</span>
            </span>
          </Link>

          <img
            src="https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600"
            alt="Kids playing with toys"
            className="w-64 h-64 object-cover rounded-3xl mx-auto mb-8 shadow-card-hover"
          />

          <h2 className="font-display font-bold text-3xl text-neutral-900 mb-3">
            Join the Fun!
          </h2>
          <p className="text-neutral-600 leading-relaxed mb-6">
            Create your account and get access to thousands of amazing toys, exclusive deals, and a world of fun.
          </p>

          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { label: '50,000+', desc: 'Happy Customers' },
              { label: '10,000+', desc: 'Products' },
              { label: '99%', desc: 'Safe & Certified' },
              { label: '24/7', desc: 'Customer Support' },
            ].map(({ label, desc }) => (
              <div key={desc} className="bg-white/60 rounded-2xl p-3">
                <p className="font-display font-bold text-xl text-primary-600">{label}</p>
                <p className="text-xs text-neutral-600">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-6"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl text-neutral-900">
              Kids<span className="text-gradient-primary">Toys</span>
            </span>
          </Link>

          <div className="mb-8">
<h1 className="font-display font-extrabold text-4xl text-[#ff5a5f] mb-2">
  Create Account
</h1>
            <p className="text-neutral-500">Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {serverError && (
            <AlertMessage
              type="error"
              message={serverError}
              onClose={() => setServerError('')}
              className="mb-5"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              {...register('name')}
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              autoComplete="name"
            />

            <FormInput
              {...register('email')}
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <FormInput
              {...register('phone')}
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+1 (555) 000-0000"
              icon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              autoComplete="tel"
            />

            <FormInput
              {...register('password')}
              label="Password"
              placeholder="At least 6 characters"
              icon={<Lock className="w-4 h-4" />}
              showPasswordToggle
              error={errors.password?.message}
              autoComplete="new-password"
            />

            <FormInput
              {...register('confirmPassword')}
              label="Confirm Password"
              placeholder="Repeat your password"
              icon={<Lock className="w-4 h-4" />}
              showPasswordToggle
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base mt-2 mb-4"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-400">
            By creating an account, you agree to our{' '}
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 underline">Terms of Service</Link>{' '}
            and{' '}
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 underline">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
