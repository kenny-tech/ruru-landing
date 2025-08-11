'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Settings() {
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@ruru.com',
    phone: '+234 801 234 5678',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    // Simple validation
    if (!profileData.name || !profileData.email || !profileData.phone) {
      setProfileError('All fields are required');
      setProfileLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setProfileSuccess(true);
      setProfileLoading(false);
    }, 1500);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess(false);

    // Simple validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      setPasswordLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setPasswordSuccess(true);
      setPasswordLoading(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Profile Settings</CardTitle>
            <CardDescription>
              Update your account information
            </CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            {profileError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {profileError}
              </div>
            )}

            {profileSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-[#EF7D35] hover:bg-[#EF7D35]/90"
                  disabled={profileLoading}
                >
                  {profileLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Change Password</CardTitle>
            <CardDescription>
              Update your password
            </CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            {passwordError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
                Password updated successfully!
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-[#7A315F] hover:bg-[#7A315F]/90"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Notification Settings</CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EF7D35]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Express Delivery Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when express deliveries are booked</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EF7D35]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Courier Registration Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when new couriers register</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EF7D35]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System Updates</p>
                  <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EF7D35]"></div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-[#EF7D35] hover:bg-[#EF7D35]/90">
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">System Settings</CardTitle>
            <CardDescription>
              Configure system-wide settings
            </CardDescription>
          </CardHeader>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="expressRate">Express Delivery Rate (%)</Label>
                <Input
                  id="expressRate"
                  type="number"
                  defaultValue="25"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500">Additional percentage charged for express deliveries</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loyaltyRate">Loyalty Points Rate</Label>
                <Input
                  id="loyaltyRate"
                  type="number"
                  defaultValue="10"
                  min="0"
                />
                <p className="text-xs text-gray-500">Number of loyalty points earned per ₦1,000 spent</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxRiders">Maximum Riders per Courier</Label>
                <Input
                  id="maxRiders"
                  type="number"
                  defaultValue="20"
                  min="1"
                />
                <p className="text-xs text-gray-500">Maximum number of riders a courier can onboard</p>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-[#7A315F] hover:bg-[#7A315F]/90">
                Save Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}