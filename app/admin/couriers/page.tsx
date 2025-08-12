'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, CheckCircle, XCircle, Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import api from '@/lib/api';

interface Document {
  id: number;
  type: string;
  url: string;
  isVerified: boolean;
  status: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  state: string;
  isActive: boolean;
  createdAt: string;
}

interface Courier {
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
  user: User;
  documents: Document[];
  totalRiders: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function Couriers() {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [filteredCouriers, setFilteredCouriers] = useState<Courier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 1
  });
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);
  const [viewingDocument, setViewingDocument] = useState<Document | null>(null);
  const [documentComment, setDocumentComment] = useState('');

  useEffect(() => {
    const fetchCouriers = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/couriers?page=${pagination.page}&limit=${pagination.limit}`);
        setCouriers(response.data.data);
        setFilteredCouriers(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error('Failed to fetch couriers:', err);
        setError('Failed to load couriers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCouriers();
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    // Filter couriers based on search term
    const filtered = couriers.filter(courier => {
      return (
        courier.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courier.phone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    setFilteredCouriers(filtered);
  }, [searchTerm, couriers]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleViewCourier = (courier: Courier) => {
    setSelectedCourier(courier);
  };

  const handleViewDocument = (document: Document) => {
    setViewingDocument(document);
    setDocumentComment('');
  };

  const handleCloseDocument = () => {
    setViewingDocument(null);
  };

  const handleApproveDocument = async () => {
    if (!viewingDocument || !selectedCourier) return;

    try {
      await api.put(`/admin/update-document-status/${viewingDocument.id}`, {
        isVerified: true,
        comment: documentComment
      });

      // Update local state
      const updatedCouriers = couriers.map(courier => {
        if (courier.id === selectedCourier.id) {
          const updatedDocuments = courier.documents.map(doc => {
            if (doc.id === viewingDocument.id) {
              return { ...doc, isVerified: true, status: 'APPROVED' };
            }
            return doc;
          });
          return { ...courier, documents: updatedDocuments };
        }
        return courier;
      });

      setCouriers(updatedCouriers);
      setFilteredCouriers(updatedCouriers);
      setSelectedCourier(updatedCouriers.find(c => c.id === selectedCourier.id) || null);
      handleCloseDocument();
    } catch (err) {
      console.error('Failed to approve document:', err);
      setError('Failed to approve document. Please try again.');
    }
  };

  const handleRejectDocument = async () => {
    if (!viewingDocument || !selectedCourier) return;

    try {
      await api.put(`/admin/update-document-status/${viewingDocument.id}`, {
        isVerified: false,
        comment: documentComment
      });

      // Update local state
      const updatedCouriers = couriers.map(courier => {
        if (courier.id === selectedCourier.id) {
          const updatedDocuments = courier.documents.map(doc => {
            if (doc.id === viewingDocument.id) {
              return { ...doc, isVerified: false, status: 'REJECTED' };
            }
            return doc;
          });
          return { ...courier, documents: updatedDocuments };
        }
        return courier;
      });

      setCouriers(updatedCouriers);
      setFilteredCouriers(updatedCouriers);
      setSelectedCourier(updatedCouriers.find(c => c.id === selectedCourier.id) || null);
      handleCloseDocument();
    } catch (err) {
      console.error('Failed to reject document:', err);
      setError('Failed to reject document. Please try again.');
    }
  };

  const handleCloseDetails = () => {
    setSelectedCourier(null);
  };

  const getStatusBadgeClass = (isVerified: boolean) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getDocumentStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
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

  const renderDocumentItem = (document: Document) => {
    return (
      <div className="flex items-center justify-between p-3 border rounded-md mb-2">
        <div className="flex items-center gap-3">
          <a 
            href={document.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {document.type}
          </a>
          <span className={`text-xs px-2 py-1 rounded-full ${getDocumentStatusBadgeClass(document.status)}`}>
            {document.status}
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleViewDocument(document)}
        >
          <Eye size={16} className="mr-1" />
          {document.isVerified || document.status === 'REJECTED' ? 'Review' : 'Verify'}
        </Button>
      </div>
    );
  };

  const renderDocumentsSection = () => (
    <div>
      <h3 className="font-semibold mb-4">Documents</h3>
      <div className="space-y-3">
        {selectedCourier?.documents.map((document, index) => (
          <div key={`${document.id}-${index}`}>
            {renderDocumentItem(document)}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentViewer = () => {
    if (!viewingDocument || !selectedCourier) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={handleCloseDocument}>
        <div className="bg-white rounded-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{viewingDocument.type}</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseDocument}>
                <XCircle size={20} />
              </Button>
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-4 border rounded-md">
                <p className="mb-2">Document URL:</p>
                <a 
                  href={viewingDocument.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {viewingDocument.url}
                </a>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Comment
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm"
                    rows={3}
                    value={documentComment}
                    onChange={(e) => setDocumentComment(e.target.value)}
                    placeholder="Add comments about this document..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleRejectDocument}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={18} className="mr-1" />
                    Reject Document
                  </Button>
                  <Button 
                    onClick={handleApproveDocument}
                    className="bg-[#EF7D35] hover:bg-[#EF7D35]/90 text-white"
                  >
                    <CheckCircle size={18} className="mr-1" />
                    Approve Document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading && couriers.length === 0) {
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
                <th className="text-left py-3 px-4 font-medium">Company Name</th>
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
                    <td className="py-3 px-4">{courier.companyName}</td>
                    <td className="py-3 px-4">{courier.user.email}</td>
                    <td className="py-3 px-4">{formatDate(courier.createdAt)}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(courier.isVerified)}`}>
                        {courier.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{courier.totalRiders}</td>
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

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredCouriers.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} couriers
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
                      <p className="font-medium">{selectedCourier.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{selectedCourier.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{selectedCourier.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{selectedCourier.address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registration Date</p>
                      <p className="font-medium">{formatDate(selectedCourier.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(selectedCourier.isVerified)}`}>
                        {selectedCourier.isVerified ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Riders</p>
                      <p className="font-medium">{selectedCourier.totalRiders}</p>
                    </div>
                  </div>
                </div>

                {renderDocumentsSection()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {renderDocumentViewer()}
    </div>
  );
}