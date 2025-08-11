'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, XCircle, Search } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  registrationDate: string;
  totalTransactions: number;
  loyaltyCoins: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const fetchCustomers = () => {
      // Demo data
      const demoData: Customer[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+234 801 234 5678',
          status: 'active',
          registrationDate: '2023-10-15',
          totalTransactions: 12,
          loyaltyCoins: 240,
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+234 802 345 6789',
          status: 'active',
          registrationDate: '2023-09-22',
          totalTransactions: 8,
          loyaltyCoins: 160,
        },
        {
          id: '3',
          name: 'Michael Johnson',
          email: 'michael.j@example.com',
          phone: '+234 803 456 7890',
          status: 'inactive',
          registrationDate: '2023-11-05',
          totalTransactions: 3,
          loyaltyCoins: 60,
        },
        {
          id: '4',
          name: 'Sarah Williams',
          email: 'sarah.w@example.com',
          phone: '+234 804 567 8901',
          status: 'active',
          registrationDate: '2023-12-10',
          totalTransactions: 15,
          loyaltyCoins: 300,
        },
        {
          id: '5',
          name: 'David Brown',
          email: 'david.b@example.com',
          phone: '+234 805 678 9012',
          status: 'inactive',
          registrationDate: '2023-08-30',
          totalTransactions: 5,
          loyaltyCoins: 100,
        },
      ];

      setCustomers(demoData);
      setFilteredCustomers(demoData);
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on search term and status
    const filtered = customers.filter((customer) => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, statusFilter, customers]);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleStatusChange = (customerId: string, newStatus: 'active' | 'inactive') => {
    const updatedCustomers = customers.map(customer => 
      customer.id === customerId ? { ...customer, status: newStatus } : customer
    );
    
    setCustomers(updatedCustomers);
    
    if (selectedCustomer && selectedCustomer.id === customerId) {
      setSelectedCustomer({ ...selectedCustomer, status: newStatus });
    }
  };

  const handleCloseDetails = () => {
    setSelectedCustomer(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customer Management</h1>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Customers</CardTitle>
        </CardHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Registration Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Transactions</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{customer.name}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{formatDate(customer.registrationDate)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(customer.status)}`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{customer.totalTransactions}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewCustomer(customer)}
                        className="text-[#EF7D35] hover:text-[#EF7D35]/80 hover:bg-[#EF7D35]/10"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Customer Details</h2>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{formatDate(selectedCustomer.registrationDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedCustomer.status)}`}>
                        {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Activity Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Total Transactions</p>
                      <p className="font-medium">{selectedCustomer.totalTransactions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Loyalty Coins</p>
                      <p className="font-medium">{selectedCustomer.loyaltyCoins}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Activity</p>
                      <p className="font-medium">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end gap-3">
                {selectedCustomer.status === 'active' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedCustomer.id, 'inactive')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={18} className="mr-1" />
                    Deactivate
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleStatusChange(selectedCustomer.id, 'active')}
                    className="bg-[#EF7D35] hover:bg-[#EF7D35]/90 text-white"
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}