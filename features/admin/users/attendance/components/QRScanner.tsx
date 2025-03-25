'use client'

import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import verificationAnimation from '@/public/qr_verification_animation.json';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import Cookies from "js-cookie";

interface UserDetails {
  firstName: string;
  secondName: string;
  email: string;
  phone: string;
  membership: string;
}

export default function QRScanner() {
  const [data, setData] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const scanTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-details/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`,
        }
      });

      if (!response.ok) {
        setErrorMessage('Invalid QR code');
        setShowDialog(true);
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
      setErrorMessage(null);
      
      // Save attendance after successfully fetching user details
      await saveAttendance(userId);
      
      setShowDialog(true);
      setIsProcessing(true);
      return true;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return false;
    }
  };

  // Add a function to save attendance
  const saveAttendance = async (userId: string) => {
    try {
      const response = await fetch(`/api/user-details/save-attendance/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("firebaseIdToken")}`,
        }
      });

      if (!response.ok) {
        console.error('Failed to save attendance');
        return false;
      }

      const data = await response.json();
      console.log('Attendance saved:', data);
      toast.success('Attendance recorded successfully');
      return true;
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to record attendance');
      return false;
    }
  };

  const handleScan = async (result: any) => {
    console.log('handleScan result:', result);
    if (isProcessing || showAnimation || showDialog) return;

    console.log('lastScannedCode:', lastScannedCode);
    console.log('result.text:', result?.text);
    if (result?.text === lastScannedCode) return;

    if (result?.text) {
      setIsProcessing(true);
      setLastScannedCode(result.text);
      setData(result.text);
      setShowAnimation(true);

      try {
        const success = await fetchUserDetails(result.text);
        
        if (!success) {
          // Error is already shown in dialog from fetchUserDetails
          setTimeout(() => {
            setShowAnimation(false);
          }, 2000);
          return;
        }
        
        // Success case - keep the processing state true until dialog is closed
        setTimeout(() => {
          setShowAnimation(false);
        }, 2000);
      } catch (error) {
        console.error('Error processing QR code:', error);
        setErrorMessage('Error processing QR code');
        setShowDialog(true);
        setTimeout(() => {
          setShowAnimation(false);
        }, 2000);
      }
    }
  };

  // Add this useEffect to properly reset the scanner state
  React.useEffect(() => {
    // This will run whenever showDialog changes
    // When dialog closes, we need to ensure lastScannedCode is reset after a small delay
    if (!showDialog) {
      const timer = setTimeout(() => {
        setLastScannedCode(null);
      }, 500); // Small delay to prevent immediate rescanning
      
      return () => clearTimeout(timer);
    }
  }, [showDialog]);

  const handleDialogChange = (open: boolean) => {
    setShowDialog(open);
    if (!open) {
      setIsProcessing(false);
      // We'll reset lastScannedCode in the useEffect with a delay
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="rounded-lg overflow-hidden border border-gray-200">
        {!showAnimation && !showDialog && (
          <QrReader
            onResult={handleScan}
            constraints={{
              facingMode: 'environment',
              aspectRatio: 1,
              width: { min: 640, ideal: 1280, max: 1920 },
              height: { min: 480, ideal: 720, max: 1080 }
            }}
            videoId="qr-video"
            videoStyle={{ width: '100%', height: '100%' }}
            scanDelay={1000}
            className="w-full aspect-square"
            ViewFinder={() => null}
            containerStyle={{ width: '100%' }}
          />
        )}
      </div>

      {showAnimation && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-lg">
          <div className="w-48 h-48">
            <Lottie
              animationData={verificationAnimation}
              loop={false}
              autoplay
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{errorMessage ? 'Error' : 'User Details'}</DialogTitle>
          </DialogHeader>
          {errorMessage ? (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-center p-4">
                  <p className="text-red-500 font-medium">{errorMessage}</p>
                </div>
              </CardContent>
            </Card>
          ) : userDetails && (
            <Card>
              <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{`${userDetails.firstName} ${userDetails.secondName}`}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{userDetails.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Membership</p>
                    <p className="font-medium">{userDetails.membership}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}