import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Star, ArrowRight } from 'lucide-react';
import authService from '../../services/authService';


type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    const verify = async () => {
      try {
        const res = await authService.verifyEmail(token);
        setMessage(res.data.message || 'Email verified successfully!');
        setStatus('success');
      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Verification failed. The link may have expired.');
        setStatus('error');
      }
    };

    verify();
  }, [token]);

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

        <div className="bg-white rounded-3xl shadow-card p-8 sm:p-10 text-center">
          {status === 'loading' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-4"
            >
              <div className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
                Verifying Your Email
              </h2>
              <p className="text-neutral-500 text-sm">
                Please wait while we verify your email address...
              </p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <div className="w-20 h-20 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-accent-500" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
                Email Verified!
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed mb-8">{message}</p>

              <div className="space-y-3">
                <Link to="/login" className="btn-primary w-full py-3.5 text-base">
                  Sign In to Your Account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/" className="btn-ghost w-full py-3 text-sm font-medium">
                  Go to Homepage
                </Link>
              </div>

              {/* Celebration */}
              <div className="mt-8 p-4 bg-accent-50 rounded-2xl">
                <p className="text-sm font-medium text-accent-700">
                  Welcome to KidsToys family! Explore thousands of amazing toys and get exclusive deals.
                </p>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-error-500" />
              </div>
              <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-neutral-600 text-sm leading-relaxed mb-8">{message}</p>

              <div className="space-y-3">
                <Link to="/register" className="btn-primary w-full py-3.5">
                  Register Again
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="btn-outline w-full py-3">
                  Back to Login
                </Link>
              </div>

              <p className="mt-6 text-xs text-neutral-400">
                Verification links expire after 24 hours. Please register again to get a new verification email.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
