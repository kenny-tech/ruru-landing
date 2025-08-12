'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

interface Customer {
  id: string;
  fristName: string; // Note: Typo in API response (should be firstName)
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  state: string;
  isActive: boolean;
  createdAt: string;
  isDeactivated: boolean;
  ninNumber: string | null;
  isNinVerified: boolean;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/customers?page=${pagination.page}&limit=${pagination.limit}`);
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(customer => {
      const fullName = `${customer.fristName} ${customer.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleStatusChange = async (customerId: string, isActive: boolean) => {
    try {
      setStatusLoading(true);
      
      // Call the activation/deactivation endpoint
      await api.patch('/user/activate-deactivate', {
        userId: customerId,
        status: isActive
      });
      
      // Update local state
      const updatedCustomers = customers.map(customer => 
        customer.id === customerId ? { ...customer, isActive } : customer
      );
      
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
      
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, isActive });
      }
    } catch (err) {
      console.error('Failed to update customer status:', err);
      setError('Failed to update customer status. Please try again.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedCustomer(null);
    }
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && customers.length === 0) {
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
              placeholder="Search by name, email or phone"
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
                <th className="text-left py-3 px-4 font-medium">Name</th>
                <th className="text-left py-3 px-4 font-medium">Email</th>
                <th className="text-left py-3 px-4 font-medium">Registration Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Phone</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{`${customer.fristName} ${customer.lastName}`}</td>
                    <td className="py-3 px-4">{customer.email}</td>
                    <td className="py-3 px-4">{formatDate(customer.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(customer.isActive)}`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{customer.phoneNumber}</td>
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredCustomers.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={handleCloseDetails}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Customer Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCustomer(null)}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{`${selectedCustomer.fristName} ${selectedCustomer.lastName}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedCustomer.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{selectedCustomer.state}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{formatDate(selectedCustomer.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedCustomer.isActive)}`}>
                        {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NIN Verification</p>
                      <p className="font-medium">
                        {selectedCustomer.isNinVerified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className="font-medium">
                        {selectedCustomer.isDeactivated ? 'Deactivated' : 'Active'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end gap-3">
                {selectedCustomer.isActive ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedCustomer.id, false)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                    disabled={statusLoading}
                  >
                    {statusLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <XCircle size={18} className="mr-1" />
                        Deactivate
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleStatusChange(selectedCustomer.id, true)}
                    className="bg-[#EF7D35] hover:bg-[#EF7D35]/90 text-white"
                    disabled={statusLoading}
                  >
                    {statusLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CheckCircle size={18} className="mr-1" />
                        Activate
                      </>
                    )}
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