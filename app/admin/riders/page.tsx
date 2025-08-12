'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';

interface User {
  id: string;
  fristName: string; // Note: Typo in API response (should be firstName)
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  state: string;
  isActive: boolean;
  isDeactivated: boolean;
  ninNumber: string | null;
  isNinVerified: boolean;
  createdAt: string;
}

interface Company {
  id: number;
  companyName: string;
  address: string;
  phone: string;
  isVerified: boolean;
  averageRating: string;
  createdAt: string;
  costPerKilometer: string;
  costPerKilogram: string;
  averageSpeed: string;
  expressSpeedMultiplier: string;
  expressCost: string;
}

interface Rider {
  id: number;
  name: string;
  phone: string;
  plateNumber: string;
  isAvailable: boolean;
  earnings: number;
  successfulDeliveries: number;
  declinedDeliveries: number;
  createdAt: string;
  user: User;
  company: Company;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Riders() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1
  });
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/riders?page=${pagination.page}&limit=${pagination.limit}`);
        setRiders(response.data.data);
        setFilteredRiders(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Failed to fetch riders:', err);
        setError('Failed to load riders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    // Filter riders based on search term
    const filtered = riders.filter(rider => {
      const fullName = `${rider.user.fristName} ${rider.user.lastName}`;
      return (
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredRiders(filtered);
  }, [searchTerm, riders]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleViewRider = (rider: Rider) => {
    setSelectedRider(rider);
  };

  const handleStatusChange = async (riderId: number, isActive: boolean) => {
    try {
      setStatusLoading(true);
      
      // Call the activation/deactivation endpoint
      await api.patch('/user/activate-deactivate', {
        userId: riders.find(r => r.id === riderId)?.user.id, // Use the user ID from the rider object
        status: isActive
      });
      
      // Update local state
      const updatedRiders = riders.map(rider => 
        rider.id === riderId ? { 
          ...rider, 
          user: { ...rider.user, isActive } 
        } : rider
      );
      
      setRiders(updatedRiders);
      setFilteredRiders(updatedRiders);
      
      if (selectedRider && selectedRider.id === riderId) {
        setSelectedRider({ 
          ...selectedRider, 
          user: { ...selectedRider.user, isActive } 
        });
      }
    } catch (err) {
      console.error('Failed to update rider status:', err);
      setError('Failed to update rider status. Please try again.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedRider(null);
    }
  };

  const getStatusBadgeClass = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getAvailabilityBadgeClass = (isAvailable: boolean) => {
    return isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && riders.length === 0) {
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
        <h1 className="text-2xl font-bold">Rider Management</h1>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Riders</CardTitle>
        </CardHeader>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by name, email, phone, company or plate number"
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
                <th className="text-left py-3 px-4 font-medium">Company</th>
                <th className="text-left py-3 px-4 font-medium">Plate Number</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Availability</th>
                <th className="text-left py-3 px-4 font-medium">Deliveries</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.length > 0 ? (
                filteredRiders.map((rider) => (
                  <tr key={rider.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{`${rider.user.fristName} ${rider.user.lastName}`}</td>
                    <td className="py-3 px-4">{rider.company.companyName}</td>
                    <td className="py-3 px-4">{rider.plateNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(rider.user.isActive)}`}>
                        {rider.user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getAvailabilityBadgeClass(rider.isAvailable)}`}>
                        {rider.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span>Successful: {rider.successfulDeliveries}</span>
                        <span>Declined: {rider.declinedDeliveries}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewRider(rider)}
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
                    No riders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredRiders.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} riders
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

      {/* Rider Details Modal */}
      {selectedRider && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          onClick={handleCloseDetails}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Rider Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedRider(null)}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{`${selectedRider.user.fristName} ${selectedRider.user.lastName}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedRider.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedRider.user.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium">{selectedRider.user.state}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{formatDate(selectedRider.user.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Account & Vehicle Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedRider.user.isActive)}`}>
                        {selectedRider.user.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Availability</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getAvailabilityBadgeClass(selectedRider.isAvailable)}`}>
                        {selectedRider.isAvailable ? 'Available' : 'Unavailable'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">NIN Verification</p>
                      <p className="font-medium">
                        {selectedRider.user.isNinVerified ? 'Verified' : 'Not Verified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Plate Number</p>
                      <p className="font-medium">{selectedRider.plateNumber}</p>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-4 mt-6">Company Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{selectedRider.company.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Phone</p>
                      <p className="font-medium">{selectedRider.company.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Company Address</p>
                      <p className="font-medium">{selectedRider.company.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end gap-3">
                {selectedRider.user.isActive ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedRider.id, false)}
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
                    onClick={() => handleStatusChange(selectedRider.id, true)}
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