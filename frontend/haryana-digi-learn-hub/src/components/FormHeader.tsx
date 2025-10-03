import React from 'react'
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import haryanaLogo from "@/assets/https___www.pngguru.in_storage_uploads_images_Haryana Govt Logo free png, Govt of haryana png logo_1665496339_1922488633.png";
import {Link} from 'react-router-dom'

type FormHeaderProps = {
  onSignIn: () => void;
  onSignUp: () => void;
};


function FormHeader({ onSignIn, onSignUp }: FormHeaderProps) {
  return (
    <header className="bg-gradient-government h-40 shadow-header border-b-4 border-primary">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo and Title Section */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <img 
                src={haryanaLogo} 
                alt="Government of Haryana Logo" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Government of Haryana
                </h1>
                <p className="text-lg text-white/90 font-medium">
                  Digital Education Management System
                </p>
                <p className="text-sm text-white/80">
                  Department of Higher Education
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Buttons */}
          { <div className="flex items-center space-x-3">
            
            <Link to = '/login'>
            <Button 
              variant="auth" 
              className="flex items-center space-x-2"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Button>
            </Link>
            
            <Link to = '/'>
            <Button 
              variant="government" 
              className="flex items-center space-x-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Exit</span>
            </Button>
            </Link>
          </div> }
        </div>
      </div>
    </header>
  );
}


export default FormHeader