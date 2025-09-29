import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCcw, KeyRound } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  otp: string;
}

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormData>();

  const handleSendOtp = async () => {
    const valid = await form.trigger(['email']);
    if (!valid) return;
    const values = form.getValues();
    setIsLoading(true);
    try {
      const response = await authAPI.sendOtp(values.email);
      if (response.success) {
        setEmail(values.email);
        toast.success('OTP sent to your email');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to send OTP';
      toast.error(msg);
      if (msg?.toLowerCase().includes('name required') || msg?.toLowerCase().includes('signup')) {
        toast('No account found. Please sign up first.', { icon: 'ℹ️' });
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Single handler used for Send/Resend button

  const handleVerifyOtp = async () => {
    const valid = await form.trigger(['email', 'otp']);
    if (!valid) return;
    const values = form.getValues();
    setIsVerifying(true);
    try {
      const response = await authAPI.verifyOtp(values.email, values.otp);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Logged in successfully');
        navigate('/welcome');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const response = await authAPI.sendOtp(email);
      if (response.success) {
        toast.success('OTP resent');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold text-secondary-900">Welcome Back</h1>
            <p className="text-secondary-600">Sign in with your email and OTP</p>
          </div>

          <div className="card-content">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                  <input
                    {...form.register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    type="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Enter OTP
                </label>
                <div className="flex gap-3">
                  <div className="relative w-1/2">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                    <input
                      {...form.register('otp', {
                        required: 'OTP is required',
                        pattern: { value: /^\d{6}$/g, message: 'OTP must be 6 digits' },
                      })}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="input pl-10 tracking-widest"
                      autoComplete="one-time-code"
                      placeholder="Enter OTP"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="btn btn-outline w-1/2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <RefreshCcw className="h-4 w-4 mr-2" /> Send OTP
                      </div>
                    )}
                  </button>
                </div>
                {form.formState.errors.otp && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isVerifying}
                className="btn btn-primary btn-lg w-full"
              >
                {isVerifying ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    Verify & Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="card-footer">
            <p className="text-center text-sm text-secondary-600 w-full">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
