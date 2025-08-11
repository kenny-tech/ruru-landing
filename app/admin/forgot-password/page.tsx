'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-6">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="Ruru Logistics" width={120} height={40} className="h-10 w-auto" />
        </div>
        
        <CardHeader className="text-center space-y-2 px-0">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {!submitted 
              ? 'Enter your email address and we\'ll send you a link to reset your password' 
              : 'Check your email for a reset link'}
          </CardDescription>
        </CardHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            
            <Button 
              type="submit" 
              className="w-full bg-[#EF7D35] hover:bg-[#EF7D35]/90"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center mt-4">
              <Link href="/admin" className="text-sm text-[#7A315F] hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm">
              If an account exists with {email}, we've sent a password reset link to this email address.
            </div>
            
            <Button 
              onClick={() => setSubmitted(false)}
              variant="outline" 
              className="w-full"
            >
              Try Another Email
            </Button>
            
            <div className="text-center mt-4">
              <Link href="/admin" className="text-sm text-[#7A315F] hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}