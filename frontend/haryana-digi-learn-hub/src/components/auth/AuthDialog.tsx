import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AuthDialogProps {
  open: boolean;
  onClose: () => void;
  type: 'signin' | 'signup';
}

export const AuthDialog = ({ open, onClose, type }: AuthDialogProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    designation: '',
    institute: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: type === 'signin' ? "Sign In Successful" : "Registration Successful",
      description: type === 'signin' 
        ? "Welcome to Haryana Education Management System" 
        : "Your account has been created successfully",
    });
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            {type === 'signin' ? 'Sign In' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'signup' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  placeholder="e.g., Professor, Admin Officer"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="institute">Institute</Label>
                <Input
                  id="institute"
                  value={formData.institute}
                  onChange={(e) => handleInputChange('institute', e.target.value)}
                  placeholder="Select your institute"
                  required
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <Button type="submit" variant="government" className="w-full">
            {type === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
        
        <div className="text-center text-sm text-muted-foreground">
          {type === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <Button 
            variant="link" 
            onClick={() => {
              // This would switch between signin/signup in a real implementation
            }}
            className="p-0 h-auto text-primary hover:underline"
          >
            {type === 'signin' ? 'Sign up' : 'Sign in'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};