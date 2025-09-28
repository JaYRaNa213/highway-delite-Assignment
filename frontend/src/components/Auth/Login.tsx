import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  otp: string;
}

const Login: React.FC = () => {
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormData>();

  const handleRequestOTP = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.requestOTP(email);
      if (response.success) {
        setIsOTPSent(true);
        toast.success('OTP sent to your email!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data.email, data.otp);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Login successful!');
        navigate('/welcome');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    const email = form.getValues('email');
    if (email) {
      await handleRequestOTP(email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold text-secondary-900">Welcome Back</h1>
            <p className="text-secondary-600">
              {isOTPSent 
                ? 'Enter the OTP sent to your email' 
                : 'Enter your email to receive OTP'
              }
            </p>
          </div>

          <div className="card-content">
            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
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
                        message: 'Invalid email address'
                      }
                    })}
                    type="email"
                    className="input pl-10"
                    placeholder="Enter your email"
                    disabled={isOTPSent}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {isOTPSent && (
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    OTP Code
                  </label>
                  <div className="relative">
                    <input
                      {...form.register('otp', { 
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
                  {form.formState.errors.otp && (
                    <p className="text-red-500 text-xs mt-1">
                      {form.formState.errors.otp.message}
                    </p>
                  )}
                </div>
              )}

              {!isOTPSent ? (
                <button
                  type="button"
                  onClick={() => {
                    const email = form.getValues('email');
                    if (email) {
                      handleRequestOTP(email);
                    }
                  }}
                  disabled={isLoading || !form.watch('email')}
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
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg w-full"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      'Login'
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Resend OTP
                    </button>
                  </div>
                </>
              )}
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
