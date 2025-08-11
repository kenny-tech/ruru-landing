'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  UserPlus,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Geist } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const NavItem = ({ href, icon, label, active, onClick }: NavItemProps) => (
  <Link 
    href={href} 
    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${active 
      ? 'bg-[#EF7D35]/10 text-[#EF7D35]' 
      : 'hover:bg-gray-100 text-gray-700'}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Pages that should not have sidebar
  const noSidebarPages = ['/admin', '/admin/forgot-password'];
  const shouldShowSidebar = !noSidebarPages.includes(pathname);

  useEffect(() => {
    setIsClient(true);
    
    // Check if user is authenticated for protected pages
    if (shouldShowSidebar) {
      const authData = localStorage.getItem('ruruAdminAuth');
      if (!authData) {
        router.push('/admin');
      }
    }
  }, [router, shouldShowSidebar]);

  const handleLogout = () => {
    localStorage.removeItem('ruruAdminAuth');
    router.push('/admin');
  };

  // Don't render anything on the server to prevent hydration errors
  if (!isClient) return null;

  const navItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { href: '/admin/couriers', icon: <Truck size={20} />, label: 'Couriers' },
    { href: '/admin/customers', icon: <Users size={20} />, label: 'Customers' },
    { href: '/admin/riders', icon: <Users size={20} />, label: 'Riders' },
    { href: '/admin/transactions', icon: <FileText size={20} />, label: 'Transactions' },
    // { href: '/admin/create-admin', icon: <UserPlus size={20} />, label: 'Create Admin' },
    { href: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  // For pages without sidebar (login, forgot password)
  if (!shouldShowSidebar) {
    return (
      <div className={`${geistSans.variable} antialiased min-h-screen`}>
        {children}
      </div>
    );
  }

  // For pages with sidebar
  return (
    <div className={`${geistSans.variable} antialiased min-h-screen bg-gray-50 flex flex-col md:flex-row`}>
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Ruru Logistics" width={100} height={32} className="h-8 w-auto" />
          <span className="font-semibold text-lg">Admin</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar for desktop */}
      <aside className={`
        ${isMobileMenuOpen ? 'block fixed inset-0 z-50 bg-white' : 'hidden'} 
        md:block md:static md:w-64 md:min-h-screen bg-white border-r p-4
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2 mb-8">
            <Image src="/logo.png" alt="Ruru Logistics" width={100} height={32} className="h-8 w-auto" />
            <span className="font-semibold text-lg">Admin</span>
          </div>

          {/* Mobile header */}
          <div className="md:hidden flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Ruru Logistics" width={100} height={32} className="h-8 w-auto" />
              <span className="font-semibold text-lg">Admin</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => (
              <NavItem 
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            ))}
          </nav>

          {/* Logout button */}
          <Button 
            variant="ghost" 
            className="mt-auto flex items-center gap-3 justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}