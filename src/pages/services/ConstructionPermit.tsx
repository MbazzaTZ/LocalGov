import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Building2, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useAuth } from "@/contexts/AuthContext";

// --- Logo and Bilingual Content Definitions ---
const LOGO_URL = "https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png";

const TEXTS = {
  header_en: "UNITED REPUBLIC OF TANZANIA",
  header_sw: "JAMHURI YA MUUNGANO WA TANZANIA",
  title_en: "OFFICIAL CONSTRUCTION PERMIT",
  title_sw: "KIBALI RASMI CHA UJENZI",
  issued_en: "Issued by the Local Government Authority",
  issued_sw: "Imetolewa na Mamlaka ya Serikali ya Mitaa",
  permit_no_en: "Permit Serial No:",
  permit_no_sw: "Namba ya Kibali:",
  owner_en: "OWNER DETAILS / TAARIFA ZA MMILIKI",
  project_en: "PROJECT DETAILS / TAARIFA ZA MRADI",
  owner_name_en: "Owner Name / Jina la Mmiliki:",
  owner_nida_en: "Owner NIDA / NIDA ya Mmiliki:",
  phone_en: "Phone / Simu:",
  email_en: "Email / Barua Pepe:",
  land_title_en: "Land Title / Hati ya Ardhi:",
  type_en: "Construction Type / Aina ya Ujenzi:",
  plot_size_en: "Plot Size / Ukubwa wa Kiwanja:",
  floors_en: "No. of Floors / Idadi ya Ghorofa:",
  address_en: "Project Address / Anuani ya Mradi:",
  start_date_en: "Approval Date / Tarehe ya Ruhusa:",
  statement_en: "APPROVAL GRANTED: The Municipal/District Council approves the construction project described above, subject to adherence to the submitted plans, zoning regulations, and local building codes.",
  statement_sw: "RUHUSA IMETOLEWA: Halmashauri ya Jiji/Wilaya inaidhinisha mradi wa ujenzi ulioelezwa hapo juu, kwa kuzingatia mipango iliyowasilishwa, kanuni za mipango miji, na viwango vya ujenzi vya mitaa.",
  validity_en: "This permit is valid for 12 months from the approval date.",
  validity_sw: "Kibali hiki ni halali kwa miezi 12 tangu tarehe ya idhini.",
  ward_exec_en: "WARD EXECUTIVE OFFICER (Signature & Stamp)",
  ward_exec_sw: "MTENDAJI WA KATA (Sahihi na Muhuri)",
  fee_en: "Application Fee Paid: TSh 100,000",
  verify_qr: "Scan to Verify / Changanua ili Kuthibitisha",
};

// 🔧 Utility: Load image safely for jsPDF
function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas error");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const ConstructionPermit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState({
    landTitle: "",
    ownerName: profile?.fullName || "",
    ownerNIDA: profile?.nida || "",
    constructionType: "",
    plotSize: "",
    floors: "1",
    address: "",
    phone: profile?.phone || "",
    language: "bilingual",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    if (step === 1 && (!formData.ownerName || !formData.ownerNIDA || !formData.landTitle)) {
      toast({ title: "Validation Error", description: "Please complete all Owner Details.", variant: "destructive" });
      return false;
    }
    if (step === 2 && (!formData.constructionType || !formData.plotSize || !formData.address)) {
      toast({ title: "Validation Error", description: "Please complete all Project Details.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const permitNo = `CPR-${Date.now()}`;
    const dateApproved = new Date().toLocaleDateString();

    // --- Header and Logo ---
    const tanzaniaLogo = await loadImage(LOGO_URL);
    doc.addImage(tanzaniaLogo, "PNG", 95, 8, 20, 20);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(TEXTS.header_en, 105, 30, { align: "center" });
    doc.text(TEXTS.header_sw, 105, 36, { align: "center" });
    doc.setFontSize(10);
    doc.text(TEXTS.issued_en, 105, 42, { align: "center" });
    doc.text(TEXTS.issued_sw, 105, 47, { align: "center" });
    doc.line(20, 50, 190, 50);

    // --- Title and Permit No ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.title_en, 105, 60, { align: "center" });
    doc.setFontSize(12);
    doc.text(TEXTS.title_sw, 105, 66, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`${TEXTS.permit_no_en} ${permitNo}`, 20, 78);
    doc.text(`${TEXTS.start_date_en} ${dateApproved}`, 130, 78);

    // --- Owner Details ---
    let y = 88;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.owner_en, 20, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const ownerData = [
      [TEXTS.owner_name_en, formData.ownerName],
      [TEXTS.owner_nida_en, formData.ownerNIDA],
      [TEXTS.phone_en, formData.phone],
      [TEXTS.land_title_en, formData.landTitle],
    ];

    ownerData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Project Details ---
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.project_en, 20, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const projectData = [
      [TEXTS.address_en, formData.address],
      [TEXTS.type_en, formData.constructionType],
      [TEXTS.plot_size_en, formData.plotSize],
      [TEXTS.floors_en, formData.floors],
    ];

    projectData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Official Statement (Authorization) ---
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("APPROVAL STATEMENT / TAARIFA YA IDHINI", 105, y, { align: "center" });
    doc.line(20, y + 2, 190, y + 2);
    y += 6;

    doc.setFont("helvetica", "normal");
    const lines_en = doc.splitTextToSize(TEXTS.statement_en, 170);
    doc.text(lines_en, 20, y);
    y += lines_en.length * 5;

    doc.setFont("helvetica", "italic");
    const lines_sw = doc.splitTextToSize(TEXTS.statement_sw, 170);
    doc.text(lines_sw, 20, y + 2);
    y += lines_sw.length * 5;

    doc.setFont("helvetica", "normal");
    doc.text(TEXTS.validity_en, 20, y + 6);
    doc.text(TEXTS.validity_sw, 20, y + 10);

    // --- Footer ---
    doc.setFontSize(10);
    doc.text(TEXTS.fee_en, 20, 260);

    // --- Signature, Stamp, and QR ---
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.ward_exec_en, 130, 240);
    doc.text(TEXTS.ward_exec_sw, 130, 245);
    doc.line(130, 250, 190, 250); // Signature line

    // QR Code
    const qrData = `Verify Construction Permit: ${permitNo} - Owner: ${formData.ownerName}`;
    const qrCode = await QRCode.toDataURL(qrData, { width: 300 });
    doc.addImage(qrCode, "PNG", 20, 265, 30, 30);
    doc.setFontSize(8);
    doc.text(TEXTS.verify_qr, 35, 298, { align: "center" });

    doc.save(`Construction-Permit-${permitNo}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        await generatePDF();
        toast({
          title: "Permit Generated",
          description: "The Official Construction Permit (PDF) has been downloaded.",
        });
        setTimeout(() => navigate("/dashboard"), 2000);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Owner & Land Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Full Name *</Label>
                <Input id="ownerName" name="ownerName" required value={formData.ownerName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerNIDA">Owner NIDA Number *</Label>
                <Input id="ownerNIDA" name="ownerNIDA" required value={formData.ownerNIDA} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="landTitle">Land Title Number / Hati ya Ardhi *</Label>
              <Input id="landTitle" name="landTitle" required value={formData.landTitle} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleInputChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Project Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="constructionType">Construction Type *</Label>
                <Select value={formData.constructionType} onValueChange={(v) => handleSelectChange("constructionType", v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Residential">Residential / Makazi</SelectItem>
                    <SelectItem value="Commercial">Commercial / Biashara</SelectItem>
                    <SelectItem value="Fence">Fence / Uzio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plotSize">Plot Size (e.g., 500 sqm) *</Label>
                <Input id="plotSize" name="plotSize" required value={formData.plotSize} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floors">Number of Floors</Label>
                <Input id="floors" name="floors" type="number" min="1" value={formData.floors} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Project Site Address *</Label>
                <Textarea id="address" name="address" required value={formData.address} onChange={handleInputChange} />
              </div>
            </div>
            <Card className="bg-secondary/10 p-4">
              <p className="text-sm text-foreground">
                **Note:** Architectural plans and other documents must be submitted to the Ward Office for physical inspection.
              </p>
            </Card>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Finalize & Payment</h3>
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Document Language *
              </Label>
              <Select value={formData.language} onValueChange={(v) => handleSelectChange("language", v)} required>
                <SelectTrigger><SelectValue placeholder="Select language" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bilingual">Bilingual (English & Swahili)</SelectItem>
                  <SelectItem value="english">English Only</SelectItem>
                  <SelectItem value="swahili">Swahili Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card className="bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application Fee:</span>
                <span className="font-semibold text-foreground">TSh 100,000+</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Estimated Total:</span>
                <span className="font-bold text-primary">TSh 100,000</span>
              </div>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Construction Permit Request
          </h1>
          <p className="text-muted-foreground mb-4">
            Apply for the official permit required to begin construction.
          </p>
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
              {step > 1 && (<Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Previous</Button>)}
              <Button type="submit" className="flex-1">
                {step === totalSteps ? (<><Download className="w-4 h-4 mr-2" />Generate Permit</>) : "Next Step"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionPermit;