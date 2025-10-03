import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Award, TrendingUp } from "lucide-react";

interface DashboardNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const dashboardTabs = [
  { id: 'overview', label: 'Overview', icon: TrendingUp, description: 'System overview and key metrics' },
  { id: 'programs', label: 'Institute Programs', icon: BarChart3, description: 'Program distribution analysis' },
  { id: 'compliance', label: 'UGC Compliance', icon: Award, description: 'Compliance tracking and monitoring' },
  { id: 'alignment', label: 'Program Alignment', icon: Users, description: 'Council alignment and performance' },
];

export const DashboardNavigation = ({ activeTab, onTabChange }: DashboardNavigationProps) => {
  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Education Analytics Dashboard</h2>
        <p className="text-lg text-muted-foreground">Comprehensive insights into higher education management</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Card key={tab.id} className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-government ${
              isActive ? 'ring-2 ring-primary shadow-government bg-gradient-card' : 'hover:bg-accent/50'
            }`}>
              <Button
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className="w-full h-full p-0 flex flex-col items-center space-y-3 text-left"
              >
                <div className={`p-3 rounded-full ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <h3 className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                    {tab.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {tab.description}
                  </p>
                </div>
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};