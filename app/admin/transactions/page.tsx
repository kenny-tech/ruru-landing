'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

interface Customer {
  id: string;
  fristName: string; // Note: Typo in API response (should be firstName)
  lastName: string;
  email: string;
  phoneNumber: string;
}

interface CourierCompany {
  id: number;
  companyName: string;
  phone: string;
}

interface StatusHistory {
  id: number;
  status: string;
  changedAt: string;
}

interface Transaction {
  id: number;
  pickupAddress: string;
  dropoffAddress: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  value: string;
  status: string;
  isExpress: boolean;
  isInsurance: boolean;
  cost: string;
  weight: number;
  packageDetails: string;
  trackingId: string;
  isPaid: boolean;
  createdAt: string;
  customer: Customer;
  courierCompany: CourierCompany;
  rider: any; // Can be defined more specifically if needed
  statusHistories: StatusHistory[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1
  });
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/transactions?page=${pagination.page}&limit=${pagination.limit}`);
        setTransactions(response.data.data);
        setFilteredTransactions(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Failed to fetch transactions:', err);
        setError('Failed to load transactions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    // Filter transactions based on search term
    const filtered = transactions.filter(transaction => {
      const customerName = `${transaction.customer.fristName} ${transaction.customer.lastName}`;
      return (
        transaction.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.courierCompany.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.senderPhone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedTransaction(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_TRANSIT':
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
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

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(parseFloat(amount));
  };

  if (loading && transactions.length === 0) {
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
              placeholder="Search by tracking ID, customer, courier or phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={pagination.limit}
            onChange={(e) => setPagination(prev => ({ ...prev, limit: Number(e.target.value), page: 1 }))}
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Tracking ID</th>
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
                        {transaction.trackingId}
                        {transaction.isExpress && (
                          <span className="ml-2 bg-[#7A315F]/10 text-[#7A315F] text-xs px-2 py-0.5 rounded-full">
                            Express
                          </span>
                        )}
                        {transaction.isInsurance && (
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                            Insured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{`${transaction.customer.fristName} ${transaction.customer.lastName}`}</td>
                    <td className="py-3 px-4">{transaction.courierCompany.companyName}</td>
                    <td className="py-3 px-4">{formatDate(transaction.createdAt)}</td>
                    <td className="py-3 px-4">{formatCurrency(transaction.cost)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(transaction.status)}`}>
                        {transaction.status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredTransactions.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </Button>
            <span className="px-3 py-1 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={handleCloseDetails}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Transaction Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(null)}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Tracking ID</p>
                    <p className="font-medium text-lg">{selectedTransaction.trackingId}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(selectedTransaction.status)}`}>
                      {selectedTransaction.status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Sender Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{selectedTransaction.senderName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedTransaction.senderPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pickup Address</p>
                        <p className="font-medium">{selectedTransaction.pickupAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Receiver Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">{selectedTransaction.receiverName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{selectedTransaction.receiverPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dropoff Address</p>
                        <p className="font-medium">{selectedTransaction.dropoffAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Package Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Percel Value</p>
                        <p className="font-medium">{selectedTransaction.value}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Details</p>
                        <p className="font-medium">{selectedTransaction.packageDetails}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight (kg)</p>
                        <p className="font-medium">{selectedTransaction.weight}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Transaction Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{`${selectedTransaction.customer.fristName} ${selectedTransaction.customer.lastName}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Courier Company</p>
                        <p className="font-medium">{selectedTransaction.courierCompany.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">{formatCurrency(selectedTransaction.cost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Status</p>
                        <p className="font-medium">
                          {selectedTransaction.isPaid ? (
                            <span className="text-green-600">Paid</span>
                          ) : (
                            <span className="text-red-600">Unpaid</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Delivery Timeline</h3>
                  <div className="space-y-4">
                    {selectedTransaction.statusHistories.map((history, index) => (
                      <div key={history.id} className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full ${
                          history.status === 'COMPLETED' ? 'bg-green-500' :
                          history.status === 'CANCELLED' ? 'bg-red-500' :
                          'bg-blue-500'
                        } flex items-center justify-center text-white text-xs`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">
                            {history.status.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(history.changedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}