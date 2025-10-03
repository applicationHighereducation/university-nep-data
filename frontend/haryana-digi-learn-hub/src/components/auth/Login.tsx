import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import haryanaLogo from "@/assets/https___www.pngguru.in_storage_uploads_images_Haryana Govt Logo free png, Govt of haryana png logo_1665496339_1922488633.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <img 
              src={haryanaLogo} 
              alt="Haryana Government Logo" 
              className="w-20 h-20 object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-semibold text-primary">Login</CardTitle>
          <CardDescription>Welcome back! Please enter your details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                required
                className="h-11 bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                required
                className="h-11 bg-muted/50"
              />
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Register
                </Link>
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;