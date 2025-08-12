'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';
import api, { ENDPOINTS } from '@/lib/api';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!identifier || !password) {
      setError('Please enter both email/phone and password');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(ENDPOINTS.SIGNIN, {
        identifier,
        password,
      });

      console.log('response: ', response);

      // Store token and user data
      localStorage.setItem('authToken', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));

      // Redirect to dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-center mb-6 mt-3">
          <Image src="/logo.png" alt="Ruru Logistics" width={120} height={40} className="h-10 w-auto" />
        </div>
        
        <CardHeader className="text-center space-y-2 px-0">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin dashboard</CardDescription>
        </CardHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="identifier" className="block text-sm font-medium">Email or Phone Number</label>
            <Input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="veleho813@inboxbear.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            {/* <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Link href="/admin/forgot-password" className="text-sm text-[#EF7D35] hover:underline">
                Forgot password?
              </Link>
            </div> */}
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full mb-3 bg-[#EF7D35] hover:bg-[#EF7D35]/90"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </Card>
    </div>
  );
}