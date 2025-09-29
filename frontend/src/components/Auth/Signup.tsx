import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, RefreshCcw, KeyRound } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SignupEmailFormData {
  email: string;
}

interface VerifyOtpFormData {
  otp: string;
}

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailForm = useForm<SignupEmailFormData>();
  const otpForm = useForm<VerifyOtpFormData>();

  const handleSendOtp = async (data: SignupEmailFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.sendOtp(data.email);
      if (response.success) {
        setEmail(data.email);
        setStep('otp');
        toast.success('OTP sent to your email');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (data: VerifyOtpFormData) => {
    setIsVerifying(true);
    try {
      const response = await authAPI.verifyOtp(email, data.otp);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Account created');
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
            <h1 className="text-2xl font-bold text-secondary-900">Create Account</h1>
            <p className="text-secondary-600">Sign up with your name, email and OTP</p>
          </div>

          <div className="card-content">
            {step === 'email' ? (
              <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                    <input
                      {...emailForm.register('email', {
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
                    />
                  </div>
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={otpForm.handleSubmit(handleVerifyOtp)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Enter OTP sent to {email}
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                    <input
                      {...otpForm.register('otp', {
                        required: 'OTP is required',
                        pattern: { value: /^\d{6}$/g, message: 'OTP must be 6 digits' },
                      })}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="input pl-10 tracking-widest"
                      autoComplete="one-time-code"
                      placeholder="123456"
                    />
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-secondary-600 hover:text-secondary-800 text-sm"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                  >
                    <RefreshCcw className="h-4 w-4 mr-1" /> Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isVerifying ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Verify & Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="card-footer">
            <p className="text-center text-sm text-secondary-600 w-full">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
