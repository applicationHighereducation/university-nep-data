import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Users, GraduationCap, User, X, Plus, Loader2 } from "lucide-react";
import axios from 'axios';
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "./Header";

// Define an interface for the faculty data received from the backend
interface FacultyMember {
  f_id: string;
  name: string;
  u_id: string;
}

// The form schema now validates an array of faculty objects
const facultySchema = z.object({
  universityId: z.string().min(1, "University ID is required"),
  facultyList: z.array(z.object({
    f_id: z.string(),
    name: z.string(),
    u_id: z.string(),
  })),
});

type FacultyFormData = z.infer<typeof facultySchema>;

// Correct API URL to match your backend routes
const API_URL = "/api/faculty";

export function FacultyForm() {
  const { user } = useAuth();
  const [isLoadingFaculty, setIsLoadingFaculty] = useState(true);

  const form = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      universityId: user?.u_id || "",
      facultyList: [],
    },
  });

  // Fetches the list of faculty from the database and updates the form state
  const fetchFaculty = async () => {
    if (!user?.u_id) return;
    setIsLoadingFaculty(true);
    try {
      // Calls the GET /api/faculty endpoint
      const response = await axios.get(API_URL, { withCredentials: true });
      const facultyData: FacultyMember[] = response.data.data || [];
      form.setValue('facultyList', facultyData); // Update the form with full objects
    } catch (error) {
      console.error("Failed to fetch faculty list:", error);
      toast.error("Could not load existing faculty.");
    } finally {
      setIsLoadingFaculty(false);
    }
  };

  // Fetch data when the component mounts or the user changes
  useEffect(() => {
    if (user?.u_id) {
      form.setValue("universityId", user.u_id);
      fetchFaculty();
    }
  }, [user, form.setValue]);

  // The main submit button now just provides user feedback, as saves are instant
  const onSubmit = () => {
    toast.info("All changes have been saved automatically.");
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-background to-muted py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-[var(--form-shadow)] border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                    <Users className="h-6 w-6 text-primary" />
                    Manage Faculty
                </CardTitle>
                
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="universityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            University ID
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="text" 
                              placeholder="University ID"
                              {...field}
                              readOnly
                              className="bg-muted/50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="facultyList"
                      render={({ field }) => {
                        const [inputValue, setInputValue] = useState('');
                        const [isAdding, setIsAdding] = useState(false);
                        const inputRef = useRef<HTMLInputElement>(null);

                        // Handler for adding a new faculty member via API
                        const addFaculty = async (name: string) => {
                          const trimmedName = name.trim();
                          if (!trimmedName) return;

                          // Check for duplicates before making an API call
                          if (field.value.some(faculty => faculty.name.toLowerCase() === trimmedName.toLowerCase())) {
                            toast.warning(`Faculty "${trimmedName}" already exists.`);
                            return;
                          }

                          setIsAdding(true);
                          try {
                            // Calls POST /api/faculty with name and u_id
                            await axios.post(API_URL, { name: trimmedName, u_id: user.u_id }, { withCredentials: true });
                            toast.success(`Added "${trimmedName}" successfully.`);
                            setInputValue('');
                            await fetchFaculty(); // Refresh the list from the DB
                          } catch (error) {
                            toast.error(error.response?.data?.message || "Failed to add faculty.");
                          } finally {
                            setIsAdding(false);
                            inputRef.current?.focus();
                          }
                        };

                        // Handler for removing a faculty member via API
                        const removeFaculty = async (facultyToRemove: FacultyMember) => {
                          try {
                            // Calls DELETE /api/faculty/:f_id
                            await axios.delete(`${API_URL}/${facultyToRemove.f_id}`, { withCredentials: true });
                            toast.success(`Removed "${facultyToRemove.name}".`);
                            await fetchFaculty(); // Refresh the list
                          } catch (error) {
                            toast.error(error.response?.data?.message || "Failed to remove faculty.");
                          }
                        };
                        
                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Faculty Name
                            </FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                      ref={inputRef}
                                      type="text"
                                      value={inputValue}
                                      onChange={(e) => setInputValue(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addFaculty(inputValue);
                                        }
                                      }}
                                      placeholder="Enter faculty name and press Enter or click Add..."
                                      className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addFaculty(inputValue)}
                                    disabled={!inputValue.trim() || isAdding}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                  >
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                    Add
                                  </button>
                                </div>
                                
                                <div className="border rounded-md p-4 bg-background min-h-[80px]">
                                  <div className="text-sm font-medium text-foreground mb-3">
                                    Faculty List ({field.value.length})
                                  </div>
                                  
                                  {isLoadingFaculty ? (
                                    <div className="flex justify-center items-center py-4">
                                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                    </div>
                                  ) : field.value.length === 0 ? (
                                    <div className="text-sm text-muted-foreground italic text-center py-4">
                                      No faculty members added yet
                                    </div>
                                  ) : (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                      {field.value.map((faculty, index) => (
                                        <div
                                          key={faculty.f_id} // Use database ID for the key
                                          className="flex items-center justify-between p-2 bg-muted/50 rounded-md hover:bg-muted/80 transition-colors"
                                        >
                                          <span className="text-sm font-medium">{faculty.name}</span>
                                          <button
                                            type="button"
                                            onClick={() => removeFaculty(faculty as FacultyMember)}
                                            className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-destructive/10 transition-colors"
                                            title={`Remove ${faculty.name}`}
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className="flex justify-center pt-6">
                    <Button 
                      type="submit" 
                      className="px-8 py-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Finish
                    </Button>
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