import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, ArrowRight } from 'lucide-react';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data.email, data.password);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="card-header text-center">
            <h1 className="text-2xl font-bold text-secondary-900">Welcome Back</h1>
            <p className="text-secondary-600">Enter your credentials to sign in</p>
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
                  Password
                </label>
                <div className="relative">
                  <input
                    {...form.register('password', { 
                      required: 'Password is required'
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
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.password.message}
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
                    Sign In
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
