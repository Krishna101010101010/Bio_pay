
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import RegisterForm from '@/components/auth/RegisterForm';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  
  const handleRegister = (data: any) => {
    console.log('Registration data:', data);
    // In a real app, we would save user data here
    toast.success('Registration successful!', {
      description: 'Your account has been created.',
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="bg-card border border-border shadow-lg rounded-xl p-8">
          <RegisterForm onSubmit={handleRegister} />
        </div>
      </div>
    </div>
  );
};

export default Register;
