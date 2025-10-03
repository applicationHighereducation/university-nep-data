import { User, FileText, CheckCircle, Clock } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  university?: string;
}

interface Stats {
  totalForms: number;
  completedForms: number;
  pendingForms: number;
}

interface ProfileHeaderProps {
  user: User | null;
  stats: Stats;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, stats }) => {
  if (!user) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start gap-6">
        <div className="bg-primary/10 p-4 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">{user.username}</h1>
          <p className="text-muted-foreground mb-1">{user.email}</p>
          <p className="text-sm text-muted-foreground">{user.university}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.totalForms}</div>
            <div className="text-sm text-muted-foreground">Total Forms</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.completedForms}</div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-foreground">{stats.pendingForms}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </div>
      </div>
    </div>
  );
};