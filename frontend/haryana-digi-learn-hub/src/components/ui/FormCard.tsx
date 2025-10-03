import { Button } from "@/components/ui/button";
import { Tag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface Form {
  id: string;
  title: string;
  description: string;
  category: string;
  link: string;
}

interface FormCardProps {
  form: Form;
}

export const FormCard: React.FC<FormCardProps> = ({ form }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">{form.title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{form.description}</p>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Tag className="h-4 w-4" />
            <span>{form.category}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <Link to={form.link}>
          <Button className="flex items-center gap-2">
            Fill Form
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};