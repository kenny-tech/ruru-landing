'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, XCircle } from 'lucide-react';

interface Transaction {
  id: string;
  orderNumber: string;
  customerName: string;
  courierName: string;
  riderName: string;
  amount: number;
  status: 'completed' | 'in-transit' | 'cancelled';
  date: string;
  isExpress: boolean;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const fetchTransactions = () => {
      // Demo data
      const demoData: Transaction[] = [
        {
          id: '1',
          orderNumber: 'ORD-12345',
          customerName: 'John Doe',
          courierName: 'Express Logistics',
          riderName: 'Alex Johnson',
          amount: 2500,
          status: 'completed',
          date: '2023-10-15T14:30:00',
          isExpress: true,
        },
        {
          id: '2',
          orderNumber: 'ORD-12346',
          customerName: 'Jane Smith',
          courierName: 'Fast Delivery Co.',
          riderName: 'Samuel Okafor',
          amount: 1800,
          status: 'in-transit',
          date: '2023-10-16T09:15:00',
          isExpress: false,
        },
        {
          id: '3',
          orderNumber: 'ORD-12347',
          customerName: 'Michael Johnson',
          courierName: 'City Riders',
          riderName: 'Emmanuel Adebayo',
          amount: 3200,
          status: 'completed',
          date: '2023-10-14T16:45:00',
          isExpress: true,
        },
        {
          id: '4',
          orderNumber: 'ORD-12348',
          customerName: 'Sarah Williams',
          courierName: 'Metro Delivery',
          riderName: 'Chioma Nwosu',
          amount: 1500,
          status: 'cancelled',
          date: '2023-10-13T11:20:00',
          isExpress: false,
        },
        {
          id: '5',
          orderNumber: 'ORD-12349',
          customerName: 'David Brown',
          courierName: 'Quick Transport',
          riderName: 'Ibrahim Mohammed',
          amount: 2200,
          status: 'completed',
          date: '2023-10-12T13:10:00',
          isExpress: false,
        },
      ];

      setTransactions(demoData);
      setFilteredTransactions(demoData);
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search term and status
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = 
        transaction.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.courierName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredTransactions(filtered);
  }, [searchTerm, statusFilter, transactions]);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = () => {
    setSelectedTransaction(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transaction Management</h1>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Transactions</CardTitle>
        </CardHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by order number, customer or courier"
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
            <option value="completed">Completed</option>
            <option value="in-transit">In Transit</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Order #</th>
                <th className="text-left py-3 px-4 font-medium">Customer</th>
                <th className="text-left py-3 px-4 font-medium">Courier</th>
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {transaction.orderNumber}
                        {transaction.isExpress && (
                          <span className="ml-2 bg-[#7A315F]/10 text-[#7A315F] text-xs px-2 py-0.5 rounded-full">
                            Express
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{transaction.customerName}</td>
                    <td className="py-3 px-4">{transaction.courierName}</td>
                    <td className="py-3 px-4">{formatDate(transaction.date)}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.amount)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewTransaction(transaction)}
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
                  <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Transaction Details</h2>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium text-lg">{selectedTransaction.orderNumber}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(selectedTransaction.status)}`}>
                      {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Customer Name</p>
                        <p className="font-medium">{selectedTransaction.customerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date & Time</p>
                        <p className="font-medium">{formatDate(selectedTransaction.date)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Service Type</p>
                        <p className="font-medium">
                          {selectedTransaction.isExpress ? 'Express Delivery' : 'Standard Delivery'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Delivery Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Courier Company</p>
                        <p className="font-medium">{selectedTransaction.courierName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Rider Name</p>
                        <p className="font-medium">{selectedTransaction.riderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">{formatCurrency(selectedTransaction.amount)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Delivery Timeline</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">1</div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-gray-500">{formatDate(selectedTransaction.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">2</div>
                      <div>
                        <p className="font-medium">Rider Assigned</p>
                        <p className="text-sm text-gray-500">{formatDate(new Date(new Date(selectedTransaction.date).getTime() + 15 * 60000).toISOString())}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full ${selectedTransaction.status === 'cancelled' ? 'bg-red-500' : selectedTransaction.status === 'in-transit' ? 'bg-blue-500' : 'bg-green-500'} flex items-center justify-center text-white text-xs`}>3</div>
                      <div>
                        <p className="font-medium">Pickup Completed</p>
                        <p className="text-sm text-gray-500">
                          {selectedTransaction.status === 'cancelled' ? 'Cancelled' : formatDate(new Date(new Date(selectedTransaction.date).getTime() + 45 * 60000).toISOString())}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full ${selectedTransaction.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'} flex items-center justify-center text-white text-xs`}>4</div>
                      <div>
                        <p className="font-medium">Delivery Completed</p>
                        <p className="text-sm text-gray-500">
                          {selectedTransaction.status === 'completed' ? formatDate(new Date(new Date(selectedTransaction.date).getTime() + 120 * 60000).toISOString()) : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}