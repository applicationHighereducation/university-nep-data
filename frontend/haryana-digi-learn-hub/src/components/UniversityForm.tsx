import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { GraduationCap, MapPin, Phone, Globe, Calendar, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const universitySchema = z.object({
  id: z.string().min(1, "Please select a university id"),
  name: z.string().min(1, "Please select a university"),
  uniSecret: z.string().optional(),
  type: z.enum(["public", "private", "community"]).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  studentCount: z.string().optional(),
  facultyCount: z.string().optional(),
  officialEmail: z.string().optional(),
  officePhone: z.string().optional(),
  highAuthorityName: z.string().optional(),
  vcName: z.string().optional(),
  vcPhone: z.string().optional(),
  vcEmail: z.string().optional(),
  registrarName: z.string().optional(),
  registrarPhone: z.string().optional(),
  registrarEmail: z.string().optional(),
});

type UniversityFormData = z.infer<typeof universitySchema>;

export function UniversityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { number: 1, title: "Basic Information", description: "University name, type, and basic details" },
    { number: 2, title: "Address Information", description: "Location and address details" },
    { number: 3, title: "Contact Information", description: "Phone, email, and website" },
    { number: 4, title: "University Information", description: "Vice Chancellor, Official Email and other details" },
    { number: 5, title: "University Information", description: "Registrar, Official Email and other details" }
  ];

  const totalSteps = steps.length;

  const form = useForm<UniversityFormData>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      id: "",
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      email: "",
      website: "",
      studentCount: "",
      facultyCount: "",
      officialEmail: "",
      highAuthorityName: "",
      officePhone: "",
      vcName: "",
      vcEmail: "",
      vcPhone: "",
      registrarEmail: "",
      registrarName: "",
      registrarPhone: ""
    },
  });

  const { user } = useAuth();
  const defaultUniId = user?.u_id;

  useEffect(() => {
    const fetchUniversityData = async () => {
      if (!defaultUniId) return;

      try {
        const response = await axios.get(
          `/api/uni-data/get`,
          { withCredentials: true }
        );

        const data = response.data.data

        const address = data.u_address
        const parts = address.split(",").map(part => part.trim());
        console.log(parts)
   
        
        if(response.data.data){
          const mappedData = {
            name: data.u_name,
            address: parts[0],
            phone: data.u_phone,
            city: parts[1],
            state: parts[2],
            zipCode: parts[3],
            website: data.u_website_url,
            vcName: data.u_vc_name,
            vcEmail: data.vc_mail,
            vcPhone: data.vc_mobile,
            registrarName: data.u_reg_name,
            registrarPhone: data.reg_mobile,
            registrarEmail: data.reg_email,
          }

          console.log(mappedData)
          form.reset(mappedData)
          console.log('After reset: ', form.getValues())
        }

      } catch (error) {
        console.error("Failed to fetch university data:", error);
      }
    };

    fetchUniversityData();
  }, [defaultUniId]);

  const onSubmit = async () => {

  }


  const submit = async (data: UniversityFormData) => {
    

    setIsSubmitting(true);
    try {
    // Validate Registrar info
    const isValid = await form.trigger(["registrarName", "registrarPhone", "registrarEmail"]);
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }

    const values = form.getValues()

    
    // Submit registrar data to backend
    await axios.post(
      "/api/uni-data/uploadRegistrar",
      {
        name: values.registrarName,
        mobile: values.registrarPhone,
        email: values.registrarEmail,
      },
      { withCredentials: true }
    );

    toast.success("University details saved successfully!");
    form.reset();
    setCurrentStep(1);

    // Navigate to /profile after submission
    window.location.href = "/profile";
  } catch (error: any) {
    console.error("❌ Axios Error:", error);
    toast.error(error.response?.data?.message || "Failed to save registrar info");
  } finally {
    setIsSubmitting(false);
  }
};

  const nextStep = async () => {
    const values = form.getValues();

    if (currentStep === 1) {
      const isValid = await form.trigger(["name"]);
      if (!isValid) return;

     try {
  await axios.post("/api/uni-data/uploadName", {
    uniName: values.name,
  }, {withCredentials: true});

  toast.success("University name saved!");
  setCurrentStep(currentStep + 1);
} catch (error: any) {
  console.error("❌ Axios Error:", error);
  toast.error(error.response?.data?.message || "Error saving university name");
}
    } else if (currentStep === 2) {
      const isValid = await form.trigger(["address", "city", "state", "zipCode"]);
      if (!isValid) return;

      try {
        await axios.post("/api/uni-data/uploadAddress", {
          street : values.address,
          city: values.city,
          state: values.state,
          pincode : values.zipCode,
        }, {withCredentials: true});
        toast.success("Address saved!");
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Error saving address");
      }
    } else if (currentStep === 3) {
      const isValid = await form.trigger(["phone", "website"]);
      if (!isValid) return;

      await axios.post(
        "/api/uni-data/uploadContact",
        {
          phone: values.phone,
          website: values.website,
        },
        { withCredentials: true }
      );
      toast.success("Contact info saved!");
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      const isValid = await form.trigger(["vcName", "vcPhone", "vcEmail"]);
      if (!isValid) return;

      await axios.post(
        "/api/uni-data/uploadVc",
        {
          name: values.vcName,
          mobile: values.vcPhone,
          email: values.vcEmail
        },
        { withCredentials: true }
      );
      toast.success("Contact info saved!");
      setCurrentStep(currentStep + 1);
    } 
      else {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>University ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Your University ID" {...field} value={defaultUniId} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Enter University Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Your University Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                key="address"
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Street" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Faridabad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Haryana" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="198273" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

 case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
              <Phone className="h-5 w-5" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                key= "phone"
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 5551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Website URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.university.edu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              
            </div>
          </div>
        );

      case 4:
        return (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="vcName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Vice Chancellor Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter University VC Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vcPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Enter Office Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 5551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vcEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Enter Official Email Id
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              

            </div>
          </div>
        );

        
      case 5:
        return (
            <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="registrarName"
                key="registrarName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Registrar Name
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter University Registrar Name" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrarPhone"
                key="registrarPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Enter Office Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 5551234567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registrarEmail"
                key="registrarEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      Enter Official Email Id
                    </FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
        );


      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-primary mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                University Registration
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Step {currentStep} of {totalSteps}: {steps[currentStep - 1].description}
            </p>
          </div>

          <Card className="shadow-[var(--form-shadow)] border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-primary">{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>{steps[currentStep - 1].description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {renderStepContent()}

                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="px-6"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep < totalSteps ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="px-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={submit}
                        disabled={isSubmitting}
                        className="px-8 py-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? "Saving..." : "Save University Details"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}