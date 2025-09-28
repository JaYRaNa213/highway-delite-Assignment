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
  password: string;
}

const Signup: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const signupForm = useForm<SignupFormData>();

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.signup(data.email, data.name, data.password);
      if (response.success && response.data) {
        login(response.data.user, response.data.token);
        toast.success('Account created successfully!');
        navigate('/welcome');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
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
            <p className="text-secondary-600">Enter your details to get started</p>
          </div>

          <div className="card-content">
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

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...signupForm.register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="input pr-10"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {signupForm.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {signupForm.formState.errors.password.message}
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
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
            </form>
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
