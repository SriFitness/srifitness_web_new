'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'

export default function SettingsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()
  const auth = useAuth()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    photoURL: '',
    phoneNumber: '',
    address: '',
    bio: ''
  })
  
  useEffect(() => {
    // Load user data
    if (auth?.currentUser) {
      setProfileData({
        displayName: auth.currentUser.displayName || '',
        email: auth.currentUser.email || '',
        photoURL: auth.currentUser.photoURL || '',
        phoneNumber: auth.currentUser.phoneNumber || '',
        address: '', // These would come from your user database
        bio: ''
      })
    }
  }, [auth?.currentUser])
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleProfileUpdate = async (e: React.FormEvent) => {
    // e.preventDefault()
    // setIsLoading(true)
    
    // try {
    //   // Update profile in Firebase Auth
    //   if (auth?.currentUser) {
    //     await auth.currentUser.updateProfile({
    //       displayName: profileData.displayName,
    //       photoURL: profileData.photoURL
    //     })
        
    //     // Here you would also update additional user data in your database
        
    //     toast.success('Profile updated successfully')
    //   }
    // } catch (error) {
    //   console.error('Error updating profile:', error)
    //   toast.error('Failed to update profile')
    // } finally {
    //   setIsLoading(false)
    // }
  }
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    // Implement password change logic
    toast.success('Password updated successfully')
  }
  
  const handleImageChange = (urls: string[]) => {
    if (urls.length > 0) {
      setProfileData(prev => ({ ...prev, photoURL: urls[0] }))
    }
  }
  
  return (
    <div className="container mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and how others see you on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.photoURL || ''} alt={profileData.displayName} />
                      <AvatarFallback>{profileData.displayName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="w-full max-w-xs">
                      <ImageUpload 
                        value={profileData.photoURL ? [profileData.photoURL] : []} 
                        onChange={handleImageChange}
                        multiple={false}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input 
                          id="displayName" 
                          value={profileData.displayName} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          value={profileData.email} 
                          disabled
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input 
                          id="phoneNumber" 
                          value={profileData.phoneNumber} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={profileData.address} 
                          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea 
                        id="bio" 
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        value={profileData.bio} 
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment methods.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Billing settings coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}