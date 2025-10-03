import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormCardProps {
  form: {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'pending' | 'overdue';
    priority?: 'high' | 'medium' | 'low';
    dueDate?: string;
    completedDate?: string;
    category: string;
  };
}

export function FormCard({ form }: FormCardProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      iconColor: "text-success",
      bgColor: "bg-success/10 border-success/20",
      badgeVariant: "default" as const,
      badgeText: "Completed"
    },
    pending: {
      icon: Clock,
      iconColor: "text-warning",
      bgColor: "bg-warning/10 border-warning/20",
      badgeVariant: "secondary" as const,
      badgeText: "Pending"
    },
    overdue: {
      icon: AlertCircle,
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10 border-destructive/20",
      badgeVariant: "destructive" as const,
      badgeText: "Overdue"
    }
  };

  const config = statusConfig[form.status];
  const StatusIcon = config.icon;

  const priorityColors = {
    high: "text-destructive",
    medium: "text-warning", 
    low: "text-muted-foreground"
  };

  return (
    <Card className={cn(
      "p-6 transition-all duration-300 hover:shadow-medium hover:-translate-y-1 cursor-pointer border-2",
      config.bgColor
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <StatusIcon className={cn("h-6 w-6", config.iconColor)} />
          <div>
            <h3 className="font-semibold text-lg text-foreground">{form.title}</h3>
            <p className="text-sm text-muted-foreground">{form.category}</p>
          </div>
        </div>
        <Badge variant={config.badgeVariant} className="font-medium">
          {config.badgeText}
        </Badge>
      </div>

      <p className="text-muted-foreground mb-4 leading-relaxed">{form.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {form.priority && (
            <div className="flex items-center gap-1">
              <div className={cn("w-2 h-2 rounded-full", 
                form.priority === 'high' ? 'bg-destructive' :
                form.priority === 'medium' ? 'bg-warning' : 'bg-muted-foreground'
              )} />
              <span className={cn("capitalize font-medium", priorityColors[form.priority])}>
                {form.priority} Priority
              </span>
            </div>
          )}
          
          {(form.dueDate || form.completedDate) && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {form.status === 'completed' ? 'Completed' : 'Due'}: {' '}
                {form.status === 'completed' ? form.completedDate : form.dueDate}
              </span>
            </div>
          )}
        </div>

        {form.status !== 'completed' && (
          <Button variant="outline" size="sm" className="group">
            {form.status === 'overdue' ? 'Complete Now' : 'Start Form'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </div>
    </Card>
  );
}