import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import haryanaLogo from "@/assets/https___www.pngguru.in_storage_uploads_images_Haryana Govt Logo free png, Govt of haryana png logo_1665496339_1922488633.png";

export const Header = () => {
  const { user, logout } = useAuth(); // check if user is logged in
  const [open, setOpen] = useState(false);

  // Dropdown menu items (editable)
  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/profile" },
    { label: "Import Other Data", path: "/import-data" },
  ];

  return (
    <header className="bg-gradient-government h-40 shadow-header border-b-4 border-primary">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo + Title */}
          <div className="flex items-center space-x-6">
            <img 
              src={haryanaLogo} 
              alt="Haryana Government Logo" 
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

          {/* Right Side */}
          <div className="flex items-center space-x-3 relative">
            {!user ? (
              <>
                {/* Not logged in → show login/signup */}
                <Link to="/login">
                  <Button variant="auth" className="flex items-center space-x-2">
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>

                <Link to="/register">
                  <Button variant="government" className="flex items-center space-x-2">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {/* Logged in → show dropdown */}
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center bg-white text-primary font-medium px-4 py-2 rounded-lg shadow"
                >
                  Welcome {user.username}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>

                {open && (
                  <div className="absolute top-12 right-0 w-48 bg-white shadow-lg rounded-lg border">
                    <ul className="flex flex-col">
                      {menuItems.map((item, index) => (
                        <li key={index}>
                          <Link
                            to={item.path}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
