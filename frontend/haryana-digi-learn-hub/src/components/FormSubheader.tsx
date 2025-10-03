import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface PageNavigationSubheaderProps {
  totalPages: number;
}

const PageNavigationSubheader = ({ totalPages }: PageNavigationSubheaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // extract current page from URL like /page/3
  const currentPage = parseInt(location.pathname.split("/form/page")[1]) || 1;
  const [inputPage, setInputPage] = useState(currentPage.toString());

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/form/page${page}`);
      setInputPage(page.toString());
    }
  };

  return (
    <div className="bg-gradient-to-r from-ugc-blue-light to-background border-b border-border shadow-sm">
      <div className="mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          
          {/* Page Info */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Go to page:</span>
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goToPage(Number(inputPage))}
                className="w-20 text-center"
              />
              <Button size="sm" onClick={() => goToPage(Number(inputPage))}>
                Go
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Jump */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNavigationSubheader;
