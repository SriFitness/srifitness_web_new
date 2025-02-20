'use client'

import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { toast } from 'sonner';
import Lottie from 'lottie-react';
import verificationAnimation from '@/public/qr_verification_animation.json';

export default function QRScanner() {
  const [data, setData] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleScan = async (result: any) => {
    if (result && !showAnimation) {
      setData(result?.text);
      setShowAnimation(true);
      
      // Show animation for 2 seconds
      setTimeout(() => {
        setShowAnimation(false);
        toast.success(`QR Code verified: ${result.text}`);
      }, 2000);
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error);
    if (error?.name === 'NotAllowedError') {
      setHasPermission(false);
      toast.error('Camera access was denied');
    } else {
      toast.error('Error accessing camera');
    }
  };

  if (!hasPermission) {
    return (
      <div className="w-full max-w-md mx-auto p-4 text-center">
        <p className="text-red-600 mb-4">Camera access was denied</p>
        <button
          onClick={() => setHasPermission(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      <div className="rounded-lg overflow-hidden border border-gray-200">
        {!showAnimation && (
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
            scanDelay={500}
            className="w-full aspect-square"
          />
        )}
      </div>

      {/* Verification Animation Overlay */}
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

      {data && !showAnimation && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <p className="text-green-700">Scanned Data: {data}</p>
        </div>
      )}
    </div>
  );
}