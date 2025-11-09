import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertCircle, FileText, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress"; // New import

const OpenCase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const serviceType = location.state?.service || "General";

  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState({
    caseTitle: "",
    description: "",
    relatedService: serviceType,
    applicantName: "",
    nidaNumber: "",
    phone: "",
    region: "",
    district: "",
    ward: "",
    supportingDocs: null as FileList | null, // New field for file upload
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, supportingDocs: e.target.files }));
  };
  
  const validateStep = () => {
    if (step === 1 && (!formData.caseTitle || !formData.description || !formData.relatedService)) {
      toast({ title: "Validation Error", description: "Please complete all Case Details.", variant: "destructive" });
      return false;
    }
    if (step === 2 && (!formData.applicantName || !formData.nidaNumber || !formData.phone)) {
      toast({ title: "Validation Error", description: "Please complete all Applicant Information.", variant: "destructive" });
      return false;
    }
    if (step === 3 && (!formData.region || !formData.district || !formData.ward)) {
      toast({ title: "Validation Error", description: "Please complete all Location Details.", variant: "destructive" });
      return false;
    }
    return true;
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
        if (step < totalSteps) {
            setStep(step + 1);
        } else {
            // Final submission logic
            const caseId = `CASE-${Date.now()}`;
            
            toast({
              title: "Case Submitted Successfully",
              description: `Your case ID is ${caseId}. You will be contacted within 24 hours.`,
            });
            
            setTimeout(() => navigate("/services"), 2000);
        }
    }
  };

  const renderStepContent = () => {
    switch (step) {
        case 1:
            return (
                <>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Case Details</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="caseTitle">Case Title *</Label>
                            <Input id="caseTitle" required value={formData.caseTitle}
                                onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="relatedService">Related Service</Label>
                            <Select value={formData.relatedService} onValueChange={(v) => handleSelectChange("relatedService", v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General Inquiry/Complaint</SelectItem>
                                    <SelectItem value="ResidentCertificate">Resident Certificate</SelectItem>
                                    <SelectItem value="IntroductionLetter">Introduction Letter</SelectItem>
                                    <SelectItem value="BusinessPermit">Business Permit</SelectItem>
                                    <SelectItem value="ConstructionPermit">Construction Permit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Detailed Description *</Label>
                            <Textarea id="description" required rows={5} value={formData.description}
                                onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportingDocs">Supporting Documents (Optional)</Label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground mb-2">Upload police report, photos, or evidence (Max 5MB)</p>
                                <Input id="supportingDocs" type="file" multiple className="file:text-primary file:cursor-pointer" 
                                    onChange={handleFileChange} />
                            </div>
                        </div>
                    </div>
                </>
            );
        case 2:
            return (
                <>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Applicant Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="applicantName">Your Full Name *</Label>
                            <Input id="applicantName" required value={formData.applicantName}
                                onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nidaNumber">NIDA Number *</Label>
                            <Input id="nidaNumber" required value={formData.nidaNumber}
                                onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="phone">Phone Number *</Label>
                            <Input id="phone" type="tel" required value={formData.phone}
                                onChange={handleInputChange} />
                        </div>
                    </div>
                </>
            );
        case 3:
            return (
                <>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Location Details</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="region">Region *</Label>
                            <Input id="region" required value={formData.region}
                                onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="district">District *</Label>
                            <Input id="district" required value={formData.district}
                                onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="ward">Ward *</Label>
                            <Input id="ward" required value={formData.ward}
                                onChange={handleInputChange} />
                        </div>
                    </div>
                    <Card className="bg-secondary/10 p-4 mt-6">
                        <p className="text-sm text-foreground">
                            <strong>Note:</strong> Your case will be reviewed by the Ward Office within **24 hours**. You will receive updates via SMS and can track your case status online using the ID we provide.
                        </p>
                    </Card>
                </>
            );
        default:
            return null;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/services")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <Card className="glass-card p-8 border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Open a New Case/Complaint</h1>
              <p className="text-sm text-muted-foreground">Fungua Kesi/Malalamiko Mapya</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Step {step} of {totalSteps}</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1"><Progress value={progress} className="h-2" /></div>
              <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
              <Button type="submit" className="flex-1">
                {step === totalSteps ? (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Submit Final Case
                  </>
                ) : "Next Step"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OpenCase;