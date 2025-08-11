'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Demo credentials
  const demoCredentials = {
    email: 'admin@ruru.com',
    password: 'admin123'
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Demo authentication logic
    if (email === demoCredentials.email && password === demoCredentials.password) {
      // Store auth state in localStorage
      localStorage.setItem('ruruAdminAuth', JSON.stringify({ 
        isLoggedIn: true, 
        user: { email, role: 'admin' } 
      }));
      
      // Redirect to dashboard
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-center mb-6">
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
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ruru.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Link href="/admin/forgot-password" className="text-sm text-[#EF7D35] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#EF7D35] hover:bg-[#EF7D35]/90"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Demo credentials:</p>
            <p>Email: {demoCredentials.email}</p>
            <p>Password: {demoCredentials.password}</p>
          </div>
        </form>
      </Card>
    </div>
  );
}