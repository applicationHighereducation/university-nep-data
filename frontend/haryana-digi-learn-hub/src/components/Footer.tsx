export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Digital Education Management System
            </h3>
            <p className="text-muted-foreground text-sm">
              Government of Haryana's comprehensive platform for managing and monitoring higher education institutions across the state.
            </p>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Department of Higher Education</p>
              <p>UGC Guidelines</p>
              <p>Institutional Policies</p>
              <p>Program Compliance</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4">Contact Information</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Department of Higher Education</p>
              <p>Government of Haryana</p>
              <p>Chandigarh, India</p>
              <p>Email: education@haryana.gov.in</p>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Government of Haryana. All rights reserved. | Digital Education Management System</p>
        </div>
      </div>
    </footer>
  );
};