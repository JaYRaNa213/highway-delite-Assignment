import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface SignupFormData {
  email: string;
  name: string;
}

interface OTPFormData {
  otp: string;
}

const Signup: React.FC = () => {
  const [step, setStep] = useState<'signup' | 'verify'>('signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const signupForm = useForm<SignupFormData>();
  const otpForm = useForm<OTPFormData>();

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.signup(data.email, data.name);
      if (response.success) {
        setEmail(data.email);
        setName(data.name);
        setStep('verify');
        toast.success('OTP sent to your email!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message as string | undefined;
      // If user already exists, fall back to request OTP and continue to verify step
      if (message && message.toLowerCase().includes('user already exists')) {
        try {
          const req = await authAPI.requestOTP(data.email);
          if (req.success) {
            setEmail(data.email);
            setName(data.name);
            setStep('verify');
            toast.success('Account exists. OTP sent to your email!');
          } else {
            toast.error('Failed to send OTP');
          }
        } catch (e: any) {
          toast.error(e.response?.data?.message || 'Failed to send OTP');
        }
      } else {
        toast.error(message || 'Signup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.verifyOTP(email, data.otp);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Account created successfully!');
        navigate('/welcome');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await authAPI.requestOTP(email);
      if (response.success) {
        toast.success('OTP resent to your email!');
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
            <h1 className="text-2xl font-bold text-secondary-900">
              {step === 'signup' ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-secondary-600">
              {step === 'signup' 
                ? 'Enter your details to get started' 
                : 'Enter the OTP sent to your email'
              }
            </p>
          </div>

          <div className="card-content">
            {step === 'signup' ? (
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                    <input
                      {...signupForm.register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      type="text"
                      className="input pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                  {signupForm.formState.errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                    <input
                      {...signupForm.register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="input pl-10"
                      placeholder="Enter your email"
                    />
                  </div>
                  {signupForm.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.email.message}
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
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    OTP Code
                  </label>
                  <div className="relative">
                    <input
                      {...otpForm.register('otp', { 
                        required: 'OTP is required',
                        pattern: {
                          value: /^\d{6}$/,
                          message: 'OTP must be 6 digits'
                        }
                      })}
                      type={showOTP ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOTP(!showOTP)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    >
                      {showOTP ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-sm text-secondary-600">
                    OTP sent to <span className="font-medium">{email}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary btn-lg w-full"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    'Verify & Continue'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('signup')}
                  className="btn btn-outline btn-md w-full"
                >
                  Back to Signup
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
