import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, Star, ArrowRight } from "lucide-react";

import FormInput from "../../components/common/FormInput";
import AlertMessage from "../../components/common/AlertMessage";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import authService from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { setCredentials } from "../../store/slices/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError("");
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      if (res.data.user && res.data.token) {
        dispatch(
          setCredentials({ user: res.data.user, token: res.data.token }),
        );
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200/40 rounded-full blur-2xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-14 h-14 bg-accent-200/40 rounded-full blur-xl" />

        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-sm text-center"
        >
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-2xl text-neutral-900">
              Kids<span className="text-gradient-primary">Toys</span>
            </span>
          </div>

          <img
            src="https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600"
            alt="Happy kids playing"
            className="w-64 h-64 object-cover rounded-3xl mx-auto mb-8 shadow-card-hover"
          />

          <h2 className="font-display font-bold text-3xl text-neutral-900 mb-3">
            Welcome Back!
          </h2>
          <p className="text-neutral-600 leading-relaxed">
            Sign in to access your orders, wishlist, and exclusive deals on
            premium kids toys.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {[
              "Safe & Certified Toys",
              "Free Shipping on $50+",
              "Easy 30-Day Returns",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2.5 bg-white/60 rounded-xl px-4 py-2.5"
              >
                <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
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
            <h1 className="font-display font-bold text-3xl text-neutral-900 mb-2">
              Sign In
            </h1>
            <p className="text-neutral-500">
              New here?{" "}
              <Link
                to="/register"
                className="text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </div>

          {serverError && (
            <AlertMessage
              type="error"
              message={serverError}
              onClose={() => setServerError("")}
              className="mb-5"
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              {...register("email")}
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              autoComplete="email"
            />

            <FormInput
              {...register("password")}
              label="Password"
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              showPasswordToggle
              error={errors.password?.message}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
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

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base mt-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" color="text-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-neutral-400">
            By signing in, you agree to our{" "}
            <Link
              to="#"
              className="text-neutral-600 hover:text-neutral-800 underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="#"
              className="text-neutral-600 hover:text-neutral-800 underline"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
