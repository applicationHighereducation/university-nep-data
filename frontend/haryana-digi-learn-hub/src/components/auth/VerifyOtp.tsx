import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail } from 'lucide-react';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const { verifyOtp, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      return;
    }

    const success = await verifyOtp(email, otp);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-primary">Verify OTP</CardTitle>
          <CardDescription>
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="otp" className="text-sm font-medium text-center block">
                Verification Code
              </Label>
              <div className="flex justify-center">
                <InputOTP 
                  value={otp} 
                  onChange={setOtp}
                  maxLength={6}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg font-medium border-2 rounded-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg font-medium border-2 rounded-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg font-medium border-2 rounded-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg font-medium border-2 rounded-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg font-medium border-2 rounded-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg font-medium border-2 rounded-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
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
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{' '}
              <button 
                type="button"
                className="text-primary hover:underline font-medium"
                onClick={() => {
                  // Implement resend OTP functionality
                  console.log('Resend OTP');
                }}
              >
                Resend
              </button>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <Link to="/register" className="text-primary hover:underline font-medium">
                Back to Register
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;