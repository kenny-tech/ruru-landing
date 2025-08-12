'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

interface UserDetails {
  id: string;
  fristName: string; // Note: Typo in API response (should be firstName)
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string;
  faceId: string | null;
  otp: string | null;
  role: string;
  ipAddress: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    deviceId: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  loginAttempts: number;
  lastFailedLogin: string | null;
}

export default function Settings() {
  const router = useRouter();
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setFetchingProfile(true);
        const response = await api.get('/auth/user/details');
        const userDetails = response.data.data;
        
        setProfileData({
          firstName: userDetails.fristName, // Note the typo in API response
          lastName: userDetails.lastName,
          email: userDetails.email,
          phoneNumber: userDetails.phoneNumber,
        });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setFetchError('Failed to load profile. Please try again.');
      } finally {
        setFetchingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess(false);

    try {
      // Simple validation
      if (!profileData.firstName || !profileData.lastName || !profileData.email || !profileData.phoneNumber) {
        throw new Error('All fields are required');
      }

      // Prepare the data to match the API structure
      const updateData = {
        fristName: profileData.firstName, // Note the typo to match API
        lastName: profileData.lastName,
        email: profileData.email,
        phoneNumber: profileData.phoneNumber,
      };

      await api.put('/user', updateData);
      
      setProfileSuccess(true);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setProfileError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess(false);

    try {
      // Simple validation
      if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        throw new Error('All fields are required');
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (passwordData.newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await api.post('/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      setPasswordSuccess(true);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Clear local storage and redirect to login
      setTimeout(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.push('/admin');
      }, 1500);
    } catch (err: any) {
      console.error('Failed to change password:', err);
      setPasswordError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (fetchingProfile && !profileData.email) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EF7D35]"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md text-center my-6">
        {fetchError}
      </div>
    );
  }

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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
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
                  disabled={profileLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleProfileChange}
                  disabled={profileLoading}
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
                Password updated successfully! You will be logged out shortly.
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="oldPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="oldPassword"
                    name="oldPassword"
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    disabled={passwordLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    disabled={passwordLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    disabled={passwordLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
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
      </div>
    </div>
  );
}