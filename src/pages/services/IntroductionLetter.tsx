import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

// --- Logo and Bilingual Content Definitions ---
const LOGO_URL = "https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png";

const TEXTS = {
  header_en: "UNITED REPUBLIC OF TANZANIA",
  header_sw: "JAMHURI YA MUUNGANO WA TANZANIA",
  title_en: "OFFICIAL INTRODUCTION LETTER",
  title_sw: "BARUA RASMI YA UTAMBULISHO",
  issued_en: "Issued by the Ward Executive Office",
  issued_sw: "Imetolewa na Ofisi ya Mtendaji wa Kata",
  ref_no_en: "Reference No:",
  ref_no_sw: "Namba ya Kumbukumbu:",
  ward_exec_en: "WARD EXECUTIVE OFFICER (Signature & Stamp)",
  ward_exec_sw: "MTENDAJI WA KATA (Sahihi na Muhuri)",
  verify_qr: "Scan to Verify / Changanua ili Kuthibitisha",
  applicant_en: "Applicant Details:",
  recipient_en: "Recipient Information:",
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

const IntroductionLetter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, user } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 3; 
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState({
    reason: "",
    customReason: "",
    recipientName: "",
    recipientOrg: "",
    recipientAddress: "",
    language: "bilingual", // Added language setting
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const validateStep = () => {
    if (step === 1 && (!formData.reason || (!formData.recipientName || !formData.recipientOrg))) {
      toast({ title: "Validation Error", description: "Please select a purpose and fill in recipient details.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const letterRef = `IL-${Date.now()}`;
    const dateIssued = new Date().toLocaleDateString();

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

    // --- Reference and Date ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`${TEXTS.ref_no_en} ${letterRef}`, 20, 55);
    doc.text(`Date / Tarehe: ${dateIssued}`, 160, 55, { align: "right" });

    // --- Recipient Info ---
    let y = 65;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.recipient_en, 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`${formData.recipientName}`, 20, y);
    y += 6;
    doc.text(`${formData.recipientOrg}`, 20, y);
    y += 6;
    doc.text(`${formData.recipientAddress}`, 20, y);

    // --- Applicant Info (Self-Introduction) ---
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.applicant_en, 20, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(`Name / Jina: ${profile?.fullName || user?.email}`, 20, y);
    y += 6;
    doc.text(`NIDA ID: ${profile?.nida || "Not Provided"}`, 20, y);
    y += 6;
    doc.text(`Address / Anuani: ${profile?.address || "Registered Ward"}`, 20, y);
    y += 6;

    // --- Letter Body ---
    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text(`RE: OFFICIAL INTRODUCTION LETTER FOR ${formData.reason.toUpperCase()}`, 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");

    const purpose =
      formData.reason === "Other"
        ? formData.customReason
        : formData.reason;

    const introText = `Dear Sir/Madam,

This is to officially introduce the bearer of this letter, Mr./Ms. ${profile?.fullName || "[Applicant Name]"}, a verified resident within our jurisdiction, for the purpose of seeking ${purpose.toLowerCase()}. The individual is known to the local government authorities.

We kindly request your assistance and cooperation in facilitating this matter.

Yours faithfully,`;

    const lines = doc.splitTextToSize(introText, 170);
    doc.text(lines, 20, y + 4);

    // 🖋️ Signature Area
    y = 230;
    doc.text("Ward Executive Officer", 20, y);
    doc.text(TEXTS.ward_exec_en, 130, y);
    doc.text(TEXTS.ward_exec_sw, 130, y + 5);
    doc.line(130, y + 15, 190, y + 15); // Signature line
    doc.text("Signature & Stamp", 130, y + 22);

    // 💰 Service Fee
    doc.setFont("helvetica", "bold");
    doc.text("Service Fee Paid: TSh 3,000", 20, 260);

    // 🔐 QR Code (Verification)
    const qrData = `Verify Letter: ${letterRef} - Recipient: ${formData.recipientOrg}`;
    const qrCode = await QRCode.toDataURL(qrData, { width: 300 });
    doc.addImage(qrCode, "PNG", 20, 265, 30, 30);
    doc.setFontSize(8);
    doc.text(TEXTS.verify_qr, 35, 298, { align: "center" });

    doc.save(`Introduction_Letter_${letterRef}.pdf`);

    toast({
      title: "Letter Generated",
      description: "Letter downloaded successfully.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        await generatePDF();
        setTimeout(() => navigate("/services"), 1500);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Letter Purpose (Step 1 of 3)</h3>
            <div className="space-y-2">
              <Label htmlFor="reason">Purpose of Letter *</Label>
              <Select
                value={formData.reason}
                onValueChange={(v) => handleSelectChange("reason", v)}
                required
              >
                <SelectTrigger><SelectValue placeholder="Select purpose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Job Application">Job Application / Kuomba Kazi</SelectItem>
                  <SelectItem value="Financial Services">Financial Services / Huduma za Kifedha</SelectItem>
                  <SelectItem value="Health Services">Health Services / Huduma za Afya</SelectItem>
                  <SelectItem value="Business Registration">Business Registration / Usajili wa Biashara</SelectItem>
                  <SelectItem value="Other">Other / Nyingine</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.reason === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="customReason">Specify Purpose *</Label>
                <Textarea
                  id="customReason"
                  required
                  value={formData.customReason}
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Recipient Details (Step 2 of 3)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name/Title *</Label>
                <Input id="recipientName" required value={formData.recipientName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipientOrg">Organization *</Label>
                <Input id="recipientOrg" required value={formData.recipientOrg} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Recipient Address *</Label>
              <Textarea id="recipientAddress" required value={formData.recipientAddress} onChange={handleInputChange} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Finalize & Payment (Step 3 of 3)</h3>
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
                <span className="text-muted-foreground">Service Fee:</span>
                <span className="font-bold text-primary">TSh 3,000</span>
              </div>
            </Card>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Confirmation:</strong> Your letter will be instantly generated and downloaded as a PDF upon payment.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/services")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <Card className="glass-card p-8 border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Introduction Letter
              </h1>
              <p className="text-sm text-muted-foreground">
                Barua ya Utambulisho
              </p>
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
                    <Download className="w-4 h-4 mr-2" />
                    Generate Letter
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

export default IntroductionLetter;