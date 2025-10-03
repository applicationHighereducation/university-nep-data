import { useState } from "react";
import { Header } from "@/components/Header";
import { DashboardNavigation } from "@/components/DashboardNavigation";
import { OverviewDashboard } from "@/components/dashboards/OverviewDashboard";
import { InstituteProgramsDashboard } from "@/components/dashboards/InstituteProgramsDashboard";
import { ComplianceDashboard } from "@/components/dashboards/ComplianceDashboard";
import { ProgramAlignmentDashboard } from "@/components/dashboards/ProgramAlignmentDashboard";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [authDialog, setAuthDialog] = useState<{ open: boolean; type: 'signin' | 'signup' | null }>({
    open: false,
    type: null
  });

  const handleSignIn = () => {
    setAuthDialog({ open: true, type: 'signin' });
  };

  const handleSignUp = () => {
    setAuthDialog({ open: true, type: 'signup' });
  };

  const closeAuthDialog = () => {
    setAuthDialog({ open: false, type: null });
  };

  const renderDashboard = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'programs':
        return <InstituteProgramsDashboard />;
      case 'compliance':
        return <ComplianceDashboard />;
      case 'alignment':
        return <ProgramAlignmentDashboard />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSignIn={handleSignIn} onSignUp={handleSignUp} />
      
      <main className="container mx-auto px-4 py-8">
        <DashboardNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <div className="mt-8">
          {renderDashboard()}
        </div>
      </main>
      
      <Footer />
      
      <AuthDialog
        open={authDialog.open}
        onClose={closeAuthDialog}
        type={authDialog.type || 'signin'}
      />
    </div>
  );
};

export default Index;
