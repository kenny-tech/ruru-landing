"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Truck,
  Users,
  Eye,
  ChevronRight,
  XCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import api from "@/lib/api";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface CountsData {
  totalCouriers: number;
  totalRiders: number;
  totalCustomers: number;
}

interface Customer {
  id: string;
  fristName: string;
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
  rider: any;
  statusHistories: StatusHistory[];
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  color,
}: StatCardProps) => (
  <Card className="overflow-hidden">
    <div className="flex">
      <div className="p-6 flex-1">
        <CardHeader className="p-0">
          <CardDescription className="text-sm font-medium text-gray-500">
            {title}
          </CardDescription>
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

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "IN_TRANSIT":
    case "PENDING":
      return "bg-blue-100 text-blue-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="h-4 w-4" />;
    case "CANCELLED":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(parseFloat(amount));
};

export default function Dashboard() {
  const [stats, setStats] = useState<CountsData>({
    totalCouriers: 0,
    totalRiders: 0,
    totalCustomers: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch counts
        const countsResponse = await api.get("/admin/users/counts");
        setStats(countsResponse.data.data);

        // Fetch recent transactions
        const transactionsResponse = await api.get(
          "/admin/transactions?page=1&limit=5"
        );
        setTransactions(transactionsResponse.data.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleCloseDetails = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedTransaction(null);
    }
  };

  if (loading) {
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
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Couriers"
          value={stats.totalCouriers}
          description="Active courier companies"
          icon={<Truck size={24} className="text-white" />}
          color="bg-[#EF7D35]"
        />
        <StatCard
          title="Total Riders"
          value={stats.totalRiders}
          description="Registered courier riders"
          icon={<Users size={24} className="text-white" />}
          color="bg-[#7A315F]"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          description="Registered app users"
          icon={<Users size={24} className="text-white" />}
          color="bg-blue-500"
        />
      </div>

      {/* Recent Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Latest 5 transactions in the system
              </CardDescription>
            </div>
            <Link href="/admin/transactions">
              <button className="text-sm font-medium text-[#EF7D35] flex items-center hover:text-[#EF7D35]/80 transition-colors">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </Link>
          </div>
        </CardHeader>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-6 font-medium text-sm">
                    Tracking ID
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-sm">
                    Customer
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-sm">
                    Courier
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-sm">
                    Date
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-sm">
                    Amount
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-sm">
                    Status
                  </th>
                  <th className="text-right py-3 px-6 font-medium text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-6">
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
                    <td className="py-3 px-6">{`${transaction.customer.fristName} ${transaction.customer.lastName}`}</td>
                    <td className="py-3 px-6">
                      {transaction.courierCompany.companyName}
                    </td>
                    <td className="py-3 px-6">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="py-3 px-6">
                      {formatCurrency(transaction.cost)}
                    </td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(
                          transaction.status
                        )}`}
                      >
                        {transaction.status
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0) + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleViewTransaction(transaction)}
                        className="text-[#EF7D35] hover:text-[#EF7D35]/80 text-sm font-medium flex items-center ml-auto"
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="bg-gray-100 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-gray-400"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" x2="8" y1="13" y2="13"></line>
                  <line x1="16" x2="8" y1="17" y2="17"></line>
                  <line x1="10" x2="8" y1="9" y2="9"></line>
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  No transactions found
                </p>
                <p className="text-sm text-gray-500">
                  There are no recent transactions to display
                </p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Transaction Details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Tracking ID</p>
                    <p className="font-medium text-lg">
                      {selectedTransaction.trackingId}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(
                        selectedTransaction.status
                      )}`}
                    >
                      {selectedTransaction.status
                        .split("_")
                        .map(
                          (word) => word.charAt(0) + word.slice(1).toLowerCase()
                        )
                        .join(" ")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Sender Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {selectedTransaction.senderName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {selectedTransaction.senderPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Pickup Address</p>
                        <p className="font-medium">
                          {selectedTransaction.pickupAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Receiver Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {selectedTransaction.receiverName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">
                          {selectedTransaction.receiverPhone}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dropoff Address</p>
                        <p className="font-medium">
                          {selectedTransaction.dropoffAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Package Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Parcel Value</p>
                        <p className="font-medium">
                          {selectedTransaction.value}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Details</p>
                        <p className="font-medium">
                          {selectedTransaction.packageDetails}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Weight (kg)</p>
                        <p className="font-medium">
                          {selectedTransaction.weight}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">
                      Transaction Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Customer</p>
                        <p className="font-medium">{`${selectedTransaction.customer.fristName} ${selectedTransaction.customer.lastName}`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Courier Company</p>
                        <p className="font-medium">
                          {selectedTransaction.courierCompany.companyName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="font-medium">
                          {formatCurrency(selectedTransaction.cost)}
                        </p>
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

                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-4">Delivery Timeline</h3>
                  <div className="space-y-4">
                    {selectedTransaction.statusHistories.map(
                      (history, index) => (
                        <div
                          key={history.id}
                          className="flex items-start gap-3"
                        >
                          <div
                            className={`w-6 h-6 rounded-full ${
                              history.status === "COMPLETED"
                                ? "bg-green-500"
                                : history.status === "CANCELLED"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            } flex items-center justify-center text-white text-xs`}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">
                              {history.status
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0) + word.slice(1).toLowerCase()
                                )
                                .join(" ")}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(history.changedAt)}
                            </p>
                          </div>
                        </div>
                      )
                    )}
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
