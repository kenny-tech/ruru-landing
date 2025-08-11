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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <StatCard
          title="Total Transactions"
          value={stats.transactions}
          description="Completed deliveries"
          icon={<FileText size={24} className="text-white" />}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp size={20} className="text-[#EF7D35]" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-4">
            {[
              { time: '2 hours ago', action: 'New courier registration: FastTruck Logistics' },
              { time: '5 hours ago', action: 'Courier approved: SpeedyDelivery Inc.' },
              { time: '1 day ago', action: 'New customer registration: John Doe' },
              { time: '2 days ago', action: 'Transaction completed: Order #12345' },
              { time: '3 days ago', action: 'Rider deactivated: Michael Johnson' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-[#EF7D35] mt-2"></div>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Truck size={20} className="text-[#7A315F]" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-4">
            {[
              { name: 'Express Logistics', type: 'Courier', status: 'Pending Document Verification' },
              { name: 'Fast Delivery Co.', type: 'Courier', status: 'Pending Insurance Document' },
              { name: 'City Riders', type: 'Courier', status: 'Pending Business Address Verification' },
              { name: 'Metro Delivery', type: 'Courier', status: 'Pending Permit Document' },
              { name: 'Quick Transport', type: 'Courier', status: 'Pending Incorporation Document' },
            ].map((item, index) => (
              <div key={index} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.type} • {item.status}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-2 py-1 bg-[#EF7D35]/10 text-[#EF7D35] rounded hover:bg-[#EF7D35]/20">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}