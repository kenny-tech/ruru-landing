'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Truck, Users, FileText } from 'lucide-react';
import api from '@/lib/api';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface CountsData {
  totalCouriers: number;
  totalRiders: number;
  totalCustomers: number;
}

const StatCard = ({ title, value, description, icon, color }: StatCardProps) => (
  <Card className="overflow-hidden">
    <div className="flex">
      <div className="p-6 flex-1">
        <CardHeader className="p-0">
          <CardDescription className="text-sm font-medium text-gray-500">{title}</CardDescription>
          <CardTitle className="text-2xl font-bold mt-1">{value}</CardTitle>
        </CardHeader>
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      </div>
      <div className={`w-16 flex items-center justify-center ${color}`}>
        {icon}
      </div>
    </div>
  </Card>
);

export default function Dashboard() {
  const [stats, setStats] = useState<CountsData>({
    totalCouriers: 0,
    totalRiders: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/users/counts');
        setStats(response.data.data);
      } catch (err) {
        console.error('Failed to fetch counts:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EF7D35]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center my-6">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Couriers"
          value={stats.totalCouriers}
          description="Active courier companies"
          icon={<Truck size={24} className="text-white" />}
          color="bg-[#EF7D35]"
        />
        <StatCard
          title="Total Riders"
          value={stats.totalRiders}
          description="Registered courier riders"
          icon={<Users size={24} className="text-white" />}
          color="bg-[#7A315F]"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          description="Registered app users"
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-500"
        />
      </div>
    </div>
  );
}