import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Star, ArrowRight, ArrowLeft, Send } from 'lucide-react';


import FormInput from '../../components/common/FormInput';
import AlertMessage from '../../components/common/AlertMessage';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import authService from '../../services/authService';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setSubmittedEmail(data.email);
      setSuccess(true);
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          {!success ? (
            <>
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-secondary-50 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-secondary-500" />
              </div>

              <div className="text-center mb-8">
                <h1 className="font-display font-bold text-2xl text-neutral-900 mb-2">
                  Forgot Password?
                </h1>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  No worries! Enter your email address and we'll send you a link to reset your password.
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
                  {...register('email')}
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  autoComplete="email"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="text-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 transition-colors font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <div className="w-20 h-20 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-6">
                <Send className="w-9 h-9 text-accent-500" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
                Check Your Email
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed mb-2">
                We sent a password reset link to
              </p>
              <p className="font-semibold text-neutral-900 mb-6 break-all">{submittedEmail}</p>
              <p className="text-xs text-neutral-400 mb-8">
                The link expires in 15 minutes. Didn't receive it? Check your spam folder.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => { setSuccess(false); setServerError(''); }}
                  className="btn-outline w-full py-3"
                >
                  Try another email
                </button>
                <Link to="/login" className="btn-ghost w-full py-3 flex items-center justify-center gap-1.5 text-sm font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
