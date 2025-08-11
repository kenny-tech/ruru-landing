'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Truck, Users, FileText, TrendingUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
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
  const [stats, setStats] = useState({
    couriers: 0,
    riders: 0,
    customers: 0,
    transactions: 0
  });

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      // Demo data
      setStats({
        couriers: 24,
        riders: 156,
        customers: 1250,
        transactions: 3567
      });
    };

    fetchData();
  }, []);

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
          value={stats.couriers}
          description="Active courier companies"
          icon={<Truck size={24} className="text-white" />}
          color="bg-[#EF7D35]"
        />
        <StatCard
          title="Total Riders"
          value={stats.riders}
          description="Registered courier riders"
          icon={<Users size={24} className="text-white" />}
          color="bg-[#7A315F]"
        />
        <StatCard
          title="Total Customers"
          value={stats.customers}
          description="Registered app users"
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-500"
        />
        {/* <StatCard
          title="Total Transactions"
          value={stats.transactions}
          description="Completed deliveries"
          icon={<FileText size={24} className="text-white" />}
          color="bg-green-500"
        /> */}
      </div>
    </div>
  );
}