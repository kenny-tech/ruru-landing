'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, XCircle, Search } from 'lucide-react';

interface Courier {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  documents: {
    incorporationDoc: string;
    businessAddressDoc: string;
    insuranceDoc: string;
    permitDoc: string;
  };
  registrationDate: string;
  ridersCount: number;
}

export default function Couriers() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [filteredCouriers, setFilteredCouriers] = useState<Courier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [viewingDocument, setViewingDocument] = useState<{ type: string; url: string } | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const fetchCouriers = () => {
      // Demo data
      const demoData: Courier[] = [
        {
          id: '1',
          name: 'Express Logistics',
          email: 'contact@expresslogistics.com',
          phone: '+234 801 234 5678',
          status: 'pending',
          documents: {
            incorporationDoc: '/file.svg',
            businessAddressDoc: '/file.svg',
            insuranceDoc: '/file.svg',
            permitDoc: '/file.svg',
          },
          registrationDate: '2023-10-15',
          ridersCount: 12,
        },
        {
          id: '2',
          name: 'Fast Delivery Co.',
          email: 'info@fastdelivery.com',
          phone: '+234 802 345 6789',
          status: 'approved',
          documents: {
            incorporationDoc: '/file.svg',
            businessAddressDoc: '/file.svg',
            insuranceDoc: '/file.svg',
            permitDoc: '/file.svg',
          },
          registrationDate: '2023-09-22',
          ridersCount: 18,
        },
        {
          id: '3',
          name: 'City Riders',
          email: 'support@cityriders.com',
          phone: '+234 803 456 7890',
          status: 'rejected',
          documents: {
            incorporationDoc: '/file.svg',
            businessAddressDoc: '/file.svg',
            insuranceDoc: '/file.svg',
            permitDoc: '/file.svg',
          },
          registrationDate: '2023-11-05',
          ridersCount: 7,
        },
        {
          id: '4',
          name: 'Metro Delivery',
          email: 'hello@metrodelivery.com',
          phone: '+234 804 567 8901',
          status: 'pending',
          documents: {
            incorporationDoc: '/file.svg',
            businessAddressDoc: '/file.svg',
            insuranceDoc: '/file.svg',
            permitDoc: '/file.svg',
          },
          registrationDate: '2023-12-10',
          ridersCount: 15,
        },
        {
          id: '5',
          name: 'Quick Transport',
          email: 'admin@quicktransport.com',
          phone: '+234 805 678 9012',
          status: 'approved',
          documents: {
            incorporationDoc: '/file.svg',
            businessAddressDoc: '/file.svg',
            insuranceDoc: '/file.svg',
            permitDoc: '/file.svg',
          },
          registrationDate: '2023-08-30',
          ridersCount: 20,
        },
      ];

      setCouriers(demoData);
      setFilteredCouriers(demoData);
    };

    fetchCouriers();
  }, []);

  useEffect(() => {
    // Filter couriers based on search term and status
    const filtered = couriers.filter((courier) => {
      const matchesSearch = courier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           courier.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || courier.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredCouriers(filtered);
  }, [searchTerm, statusFilter, couriers]);

  const handleViewCourier = (courier: Courier) => {
    setSelectedCourier(courier);
  };

  const handleViewDocument = (type: string, url: string) => {
    setViewingDocument({ type, url });
  };

  const handleCloseDocument = () => {
    setViewingDocument(null);
  };

  const handleStatusChange = (courierId: string, newStatus: 'approved' | 'rejected') => {
    const updatedCouriers = couriers.map(courier => 
      courier.id === courierId ? { ...courier, status: newStatus } : courier
    );
    
    setCouriers(updatedCouriers);
    
    if (selectedCourier && selectedCourier.id === courierId) {
      setSelectedCourier({ ...selectedCourier, status: newStatus });
    }
  };

  const handleCloseDetails = () => {
    setSelectedCourier(null);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
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
        <h1 className="text-2xl font-bold">Courier Management</h1>
      </div>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-semibold">Couriers</CardTitle>
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
                <th className="text-left py-3 px-4 font-medium">Riders</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCouriers.length > 0 ? (
                filteredCouriers.map((courier) => (
                  <tr key={courier.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{courier.name}</td>
                    <td className="py-3 px-4">{courier.email}</td>
                    <td className="py-3 px-4">{formatDate(courier.registrationDate)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(courier.status)}`}>
                        {courier.status.charAt(0).toUpperCase() + courier.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{courier.ridersCount}</td>
                    <td className="py-3 px-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewCourier(courier)}
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
                    No couriers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Courier Details Modal */}
      {selectedCourier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseDetails}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Courier Details</h2>
                <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-4">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="font-medium">{selectedCourier.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedCourier.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedCourier.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{formatDate(selectedCourier.registrationDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedCourier.status)}`}>
                        {selectedCourier.status.charAt(0).toUpperCase() + selectedCourier.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Riders</p>
                      <p className="font-medium">{selectedCourier.ridersCount}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Documents</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Incorporation Document</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDocument('Incorporation Document', selectedCourier.documents.incorporationDoc)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Business Address Document</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDocument('Business Address Document', selectedCourier.documents.businessAddressDoc)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Insurance Document</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDocument('Insurance Document', selectedCourier.documents.insuranceDoc)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <span>Permit Document</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDocument('Permit Document', selectedCourier.documents.permitDoc)}
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {selectedCourier.status === 'pending' && (
                <div className="border-t pt-6 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedCourier.id, 'rejected')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={18} className="mr-1" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleStatusChange(selectedCourier.id, 'approved')}
                    className="bg-[#EF7D35] hover:bg-[#EF7D35]/90 text-white"
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Approve
                  </Button>
                </div>
              )}

              {selectedCourier.status === 'approved' && (
                <div className="border-t pt-6 flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedCourier.id, 'rejected')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={18} className="mr-1" />
                    Deactivate
                  </Button>
                </div>
              )}

              {selectedCourier.status === 'rejected' && (
                <div className="border-t pt-6 flex justify-end gap-3">
                  <Button 
                    onClick={() => handleStatusChange(selectedCourier.id, 'approved')}
                    className="bg-[#EF7D35] hover:bg-[#EF7D35]/90 text-white"
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Activate
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseDocument}>
          <div className="bg-white rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">{viewingDocument.type}</h2>
                <Button variant="ghost" size="sm" onClick={handleCloseDocument}>
                  <XCircle size={20} />
                </Button>
              </div>

              <div className="flex items-center justify-center p-10 border rounded-md bg-gray-50">
                <div className="text-center">
                  <img 
                    src={viewingDocument.url} 
                    alt={viewingDocument.type} 
                    className="w-16 h-16 mx-auto mb-4" 
                  />
                  <p className="text-gray-500">Document preview would be displayed here</p>
                  <p className="text-sm text-gray-400 mt-2">This is a demo placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}