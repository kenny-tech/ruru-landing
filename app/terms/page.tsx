import React from 'react';
import Link from 'next/link';

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Link 
          href="/terms/courier"
          className="p-6 border rounded-lg hover:border-blue-500 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-3">For Courier Companies</h2>
          <p className="text-gray-600">Terms and conditions for courier partners working with Ruru Logistics.</p>
        </Link>
        <Link 
          href="/terms/user"
          className="p-6 border rounded-lg hover:border-blue-500 transition-colors"
        >
          <h2 className="text-2xl font-semibold mb-3">For App Users</h2>
          <p className="text-gray-600">Terms and conditions for users of the Ruru Logistics app.</p>
        </Link>
      </div>
    </div>
  );
}