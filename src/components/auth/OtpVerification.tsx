import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, SmartphoneIcon } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import FingerprintModelCanvas from '../3d/FingerprintModel';
import { auth } from '@/services/api';

interface OtpVerificationProps {
  mobileNumber: string;
  onVerify: (success: boolean) => void;
  onResend: () => void;
  onBack: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ 
  mobileNumber, 
  onVerify, 
  onResend,
  onBack 
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [scanAnimation, setScanAnimation] = useState(false);

  // Timer countdown for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Effect to send OTP when component mounts
  useEffect(() => {
    sendOtp();
  }, []);

  // Function to send SMS OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      setScanAnimation(true);
      
      await auth.resendOtp(mobileNumber);
      
      toast.success("OTP sent to your mobile number");
      setLoading(false);
      setScanAnimation(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
      setLoading(false);
      setScanAnimation(false);
    }
  };

  // Handle OTP verification
  const handleVerify = async () => {
    // Validation check
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setScanAnimation(true);
    
    try {
      const response = await auth.verifyOtp(mobileNumber, otp);
      
      if (response.success) {
        toast.success("OTP verified successfully");
        onVerify(true);
      } else {
        toast.error("Invalid OTP. Please try again.");
        onVerify(false);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
      setScanAnimation(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setIsResending(true);
    
    try {
      // Reset OTP field
      setOtp('');
      
      // Call the send OTP function again
      await sendOtp();
      
      setTimer(30);
      toast.success("A new OTP has been sent to your mobile number");
      onResend();
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Verify OTP</h2>
        <p className="text-muted-foreground">
          Enter the 6-digit code sent to {mobileNumber}
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          value={otp}
          onChange={(value) => setOtp(value)}
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={handleVerify}
          className="w-full"
          disabled={loading || otp.length !== 6}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify OTP'
          )}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?
          </p>
          <Button
            variant="link"
            onClick={handleResend}
            disabled={timer > 0 || isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resending...
              </>
            ) : timer > 0 ? (
              `Resend in ${timer}s`
            ) : (
              'Resend OTP'
            )}
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={onBack}
          className="mt-4"
        >
          Change mobile number
        </Button>
      </div>

      {/* 3D Model */}
      <div className="relative h-48">
        <FingerprintModelCanvas />
      </div>
    </div>
  );
};

export default OtpVerification;
