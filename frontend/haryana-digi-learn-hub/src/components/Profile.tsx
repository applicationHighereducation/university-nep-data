import { ProfileHeader } from "./ui/ProfileHeader";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { FormCard } from "./ui/FormCard";

const mockForms = [
  {
    id: "1",
    title: "University Details",
    description: "Fill in mandatory details about your university.",
    category: "University Details",
    link: "/university-form"
  },
  {
    id: "2",
    title: "Faculty Information",
    description: "Form for filling in the various faculties in the University",
    category: "Faculty",
    link: "/faculty-form"
  },
  {
    id: "3",
    title: "Department Information",
    description: "Fill in details about the various departments present in the University.",
    category: "Department",
    link: "/department-form"
  },
  {
    id: "4",
    title: "Programs Offered",
    description: "Fill in details about the various programs on offer by the University",
    category: "Programs",
    link: "/program-form"
  },
  {
    id: "5",
    title: "NEP Form",
    description: "Fill in details about courses on offer that are aligned with the New Education Policy",
    category: "NEP",
    link: "/form/page1"
  }
];

const Profile = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Sign in to view your profile</h2>
          <Link to="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalForms: mockForms.length,
    completedForms: 0,
    pendingForms: 0,
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <ProfileHeader user={user} stats={stats} />

          <div className="mt-8">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Forms</h2>
              <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {mockForms.length} total
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockForms.map((form) => (
                <FormCard key={form.id} form={form} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;