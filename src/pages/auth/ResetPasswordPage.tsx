import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Lock, Star, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

import FormInput from '../../components/common/FormInput';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../services/authService';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setServerError('Invalid or missing reset token.');
      return;
    }
    setServerError('');
    setIsLoading(true);
    try {
      await authService.resetPassword({ token, password: data.password });
      setSuccess(true);
      // 3 seconds baad login pe redirect
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || 'Reset failed. Link may have expired.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Invalid Token ───────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
            Invalid Reset Link
          </h2>
          <p className="text-neutral-600 text-sm mb-8">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Link to="/forgot-password" className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            Request New Link
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Success Screen ───────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hero-gradient px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-card p-10 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-accent-500" />
          </div>
          <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
            Password Reset Successful!
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed mb-2">
            Your password has been updated successfully.
          </p>
          <p className="text-neutral-400 text-xs mb-8">
            Redirecting to login page in 3 seconds...
          </p>

          {/* Progress bar */}
          <motion.div
            className="h-1 bg-accent-200 rounded-full mb-8 overflow-hidden"
          >
            <motion.div
              className="h-full bg-accent-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </motion.div>

          <Link
            to="/login"
            className="btn-primary w-full py-3 flex items-center justify-center gap-2"
          >
            Go to Login
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  // ─── Reset Password Form ──────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="font-display font-bold text-xl text-neutral-900">
            Kids<span className="text-gradient-primary">Toys</span>
          </span>
        </Link>

        <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary-500" />
          </div>

          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-2xl text-neutral-900 mb-2">
              Set New Password
            </h1>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Your new password must be different from your previously used password.
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
              {...register('password')}
              label="New Password"
              placeholder="At least 6 characters"
              icon={<Lock className="w-4 h-4" />}
              showPasswordToggle
              error={errors.password?.message}
              autoComplete="new-password"
            />

            <FormInput
              {...register('confirmPassword')}
              label="Confirm New Password"
              placeholder="Repeat your new password"
              icon={<Lock className="w-4 h-4" />}
              showPasswordToggle
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            {/* Password requirements */}
            <div className="bg-neutral-50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-medium text-neutral-600 mb-2">
                Password requirements:
              </p>
              {[
                'At least 6 characters',
                'Mix of letters and numbers recommended',
                'Avoid using common passwords',
              ].map((req) => (
                <div key={req} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  <p className="text-xs text-neutral-500">{req}</p>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  Resetting Password...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}