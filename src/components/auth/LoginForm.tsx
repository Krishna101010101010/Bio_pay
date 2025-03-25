import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Fingerprint, Loader2, SmartphoneIcon } from 'lucide-react';
import FingerPrintScanner from './FingerPrintScanner';
import OtpVerification from './OtpVerification';
import { toast } from "sonner";
import { auth } from '@/services/api';

const mobileRegex = /^[6-9]\d{9}$/;

const formSchema = z.object({
  mobile: z.string().regex(mobileRegex, {
    message: "Please enter a valid 10-digit Indian mobile number",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit: (values: { mobile: string, fingerprint: boolean }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [stage, setStage] = useState<'form' | 'otp' | 'fingerprint'>('form');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [mobile, setMobile] = useState("");
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const handleFormSubmit = async (values: FormValues) => {
    setMobile(values.mobile);
    setSendingOtp(true);
    
    try {
      await auth.resendOtp(values.mobile);
      setSendingOtp(false);
      setStage('otp');
      toast.success("OTP sent to your mobile number");
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
      setSendingOtp(false);
    }
  };

  const handleOtpVerify = async (success: boolean) => {
    if (success) {
      setStage('fingerprint');
    }
  };

  const handleOtpResend = async () => {
    try {
      await auth.resendOtp(mobile);
      toast.success("A new OTP has been sent to your mobile number");
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  const handleFingerprintComplete = async (success: boolean) => {
    if (success) {
      try {
        const response = await auth.login(mobile, true);
        if (response.success) {
          onSubmit({
            mobile,
            fingerprint: true,
          });
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {stage === 'form' && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <SmartphoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter your mobile number"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={sendingOtp}>
              {sendingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </Form>
      )}

      {stage === 'otp' && (
        <OtpVerification
          mobileNumber={mobile}
          onVerify={handleOtpVerify}
          onResend={handleOtpResend}
          onBack={() => setStage('form')}
        />
      )}

      {stage === 'fingerprint' && (
        <FingerPrintScanner
          onScanComplete={handleFingerprintComplete}
          onBack={() => setStage('otp')}
        />
      )}
    </div>
  );
};

export default LoginForm;
