'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, XCircle, Search } from 'lucide-react';

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  courierName: string;
  registrationDate: string;
  totalDeliveries: number;
  plateNumber: string;
}

export default function Riders() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [filteredRiders, setFilteredRiders] = useState<Rider[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const fetchRiders = () => {
      // Demo data
      const demoData: Rider[] = [
        {
          id: '1',
          name: 'Alex Johnson',
          email: 'alex.j@expresslogistics.com',
          phone: '+234 801 234 5678',
          status: 'active',
          courierName: 'Express Logistics',
          registrationDate: '2023-10-15',
          totalDeliveries: 45,
          plateNumber: 'LG-234-KJA',
        },
        {
          id: '2',
          name: 'Samuel Okafor',
          email: 'samuel.o@fastdelivery.com',
          phone: '+234 802 345 6789',
          status: 'active',
          courierName: 'Fast Delivery Co.',
          registrationDate: '2023-09-22',
          totalDeliveries: 32,
          plateNumber: 'AJ-567-LGS',
        },
        {
          id: '3',
          name: 'Emmanuel Adebayo',
          email: 'emmanuel.a@cityriders.com',
          phone: '+234 803 456 7890',
          status: 'inactive',
          courierName: 'City Riders',
          registrationDate: '2023-11-05',
          totalDeliveries: 18,
          plateNumber: 'KD-789-ABJ',
        },
        {
          id: '4',
          name: 'Chioma Nwosu',
          email: 'chioma.n@metrodelivery.com',
          phone: '+234 804 567 8901',
          status: 'active',
          courierName: 'Metro Delivery',
          registrationDate: '2023-12-10',
          totalDeliveries: 27,
          plateNumber: 'LG-901-KJA',
        },
        {
          id: '5',
          name: 'Ibrahim Mohammed',
          email: 'ibrahim.m@quicktransport.com',
          phone: '+234 805 678 9012',
          status: 'inactive',
          courierName: 'Quick Transport',
          registrationDate: '2023-08-30',
          totalDeliveries: 15,
          plateNumber: 'KN-345-ABJ',
        },
      ];

      setRiders(demoData);
      setFilteredRiders(demoData);
    };

    fetchRiders();
  }, []);

  useEffect(() => {
    // Filter riders based on search term and status
    const filtered = riders.filter((rider) => {
      const matchesSearch = rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rider.courierName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || rider.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredRiders(filtered);
  }, [searchTerm, statusFilter, riders]);

  const handleViewRider = (rider: Rider) => {
    setSelectedRider(rider);
  };

  const handleStatusChange = (riderId: string, newStatus: 'active' | 'inactive') => {
    const updatedRiders = riders.map(rider => 
      rider.id === riderId ? { ...rider, status: newStatus } : rider
    );
    
    setRiders(updatedRiders);
    
    if (selectedRider && selectedRider.id === riderId) {
      setSelectedRider({ ...selectedRider, status: newStatus });
    }
  };

  const handleCloseDetails = () => {
    setSelectedRider(null);
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
              placeholder="Search by name, email or courier"
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
                <th className="text-left py-3 px-4 font-medium">Courier</th>
                <th className="text-left py-3 px-4 font-medium">Plate Number</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Deliveries</th>
                <th className="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRiders.length > 0 ? (
                filteredRiders.map((rider) => (
                  <tr key={rider.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{rider.name}</td>
                    <td className="py-3 px-4">{rider.courierName}</td>
                    <td className="py-3 px-4">{rider.plateNumber}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(rider.status)}`}>
                        {rider.status.charAt(0).toUpperCase() + rider.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">{rider.totalDeliveries}</td>
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
                  <td colSpan={6} className="py-4 px-4 text-center text-gray-500">
                    No riders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rider Details Modal */}
      {selectedRider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Rider Details</h2>
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
                      <p className="font-medium">{selectedRider.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedRider.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedRider.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Courier Company</p>
                      <p className="font-medium">{selectedRider.courierName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{formatDate(selectedRider.registrationDate)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedRider.status)}`}>
                        {selectedRider.status.charAt(0).toUpperCase() + selectedRider.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Vehicle & Activity Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Plate Number</p>
                      <p className="font-medium">{selectedRider.plateNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Deliveries</p>
                      <p className="font-medium">{selectedRider.totalDeliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Activity</p>
                      <p className="font-medium">2 days ago</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Average Rating</p>
                      <p className="font-medium">4.7/5.0</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 flex justify-end gap-3">
                {selectedRider.status === 'active' ? (
                  <Button 
                    variant="outline" 
                    onClick={() => handleStatusChange(selectedRider.id, 'inactive')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={18} className="mr-1" />
                    Deactivate
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleStatusChange(selectedRider.id, 'active')}
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