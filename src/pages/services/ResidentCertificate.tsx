import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Download, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import { Progress } from "@/components/ui/progress";

// --- Logo and Bilingual Content Definitions ---
const LOGO_URL = "https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png";

const TEXTS = {
  header_en: "UNITED REPUBLIC OF TANZANIA",
  header_sw: "JAMHURI YA MUUNGANO WA TANZANIA",
  title_en: "OFFICIAL RESIDENT CERTIFICATE",
  title_sw: "CHETI RASMI CHA UKAAJI",
  issued_en: "Issued by the Ward Executive Office",
  issued_sw: "Imetolewa na Ofisi ya Mtendaji wa Kata",
  cert_no_en: "Certificate Serial No:",
  cert_no_sw: "Namba ya Cheti:",
  resident_en: "This is to certify that:",
  resident_sw: "Hii ni kuthibitisha kuwa:",
  name_en: "Full Name / Jina Kamili:",
  nida_en: "NIDA Number / Namba ya NIDA:",
  dob_en: "Date of Birth / Tarehe ya Kuzaliwa:",
  gender_en: "Gender / Jinsia:",
  phone_en: "Phone / Simu:",
  address_en: "Resident of / Anakaa:",
  region_en: "Region / Mkoa:",
  district_en: "District / Wilaya:",
  ward_en: "Ward / Kata:",
  village_en: "Village/Street / Kijiji/Mtaa:",
  reason_en: "Residency Reason / Sababu ya Ukaaji:",
  duration_en: "Duration / Muda:",
  statement_en: "The person named above is a verified resident of this Ward. This certificate is issued for official purposes only and is valid for 12 months.",
  statement_sw: "Mtu aliyetajwa hapo juu ni mkazi halali wa Kata hii. Cheti hiki kimetolewa kwa matumizi rasmi pekee na ni halali kwa miezi 12.",
  ward_exec_en: "WARD EXECUTIVE OFFICER (Signature & Stamp)",
  ward_exec_sw: "MTENDAJI WA KATA (Sahihi na Muhuri)",
  fee_en: "Service Fee Paid: TSh 7,000",
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

const ResidentCertificate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    fullName: "",
    nidaNumber: "",
    dob: "",
    gender: "",
    phone: "",
    region: "",
    district: "",
    ward: "",
    village: "",
    residencyReason: "",
    durationType: "",
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
    if (step === 1 && (!formData.fullName || !formData.nidaNumber || !formData.dob || !formData.gender)) {
      toast({ title: "Validation Error", description: "Please complete all Personal Details.", variant: "destructive" });
      return false;
    }
    if (step === 2 && (!formData.region || !formData.district || !formData.ward || !formData.village)) {
      toast({ title: "Validation Error", description: "Please complete all Location Details.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const serialNumber = `RC-${Date.now()}`;
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

    // --- Title and Certificate No ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.title_en, 105, 60, { align: "center" });
    doc.setFontSize(12);
    doc.text(TEXTS.title_sw, 105, 66, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`${TEXTS.cert_no_en} ${serialNumber}`, 20, 78);
    doc.text(`Date Issued / Tarehe Imetolewa: ${dateIssued}`, 130, 78);

    // --- Core Statement ---
    let y = 88;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.resident_en, 20, y);
    doc.text(TEXTS.resident_sw, 105, y);
    doc.line(20, y + 2, 190, y + 2);

    // --- Personal Details ---
    y += 8;
    doc.setFont("helvetica", "normal");
    const personalData = [
      [TEXTS.name_en, formData.fullName],
      [TEXTS.nida_en, formData.nidaNumber],
      [TEXTS.dob_en, formData.dob],
      [TEXTS.gender_en, formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)],
      [TEXTS.phone_en, formData.phone],
    ];

    personalData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Address Details ---
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.address_en, 20, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const addressData = [
      [TEXTS.region_en, formData.region],
      [TEXTS.district_en, formData.district],
      [TEXTS.ward_en, formData.ward],
      [TEXTS.village_en, formData.village],
      [TEXTS.reason_en, formData.residencyReason],
      [TEXTS.duration_en, formData.durationType],
    ];

    addressData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Official Statement ---
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATION STATEMENT / TAARIFA YA UTHIBITISHO", 105, y, { align: "center" });
    doc.line(20, y + 2, 190, y + 2);
    y += 6;

    doc.setFont("helvetica", "normal");
    const lines_en = doc.splitTextToSize(TEXTS.statement_en, 170);
    doc.text(lines_en, 20, y);
    y += lines_en.length * 5;

    doc.setFont("helvetica", "italic");
    const lines_sw = doc.splitTextToSize(TEXTS.statement_sw, 170);
    doc.text(lines_sw, 20, y + 2);

    // --- Footer ---
    doc.setFontSize(10);
    doc.text(TEXTS.fee_en, 20, 260);

    // --- Signature, Stamp, and QR ---
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.ward_exec_en, 130, 240);
    doc.text(TEXTS.ward_exec_sw, 130, 245);
    doc.line(130, 250, 190, 250); // Signature line

    // QR Code
    const qrData = `Verify Resident Certificate: ${serialNumber} - Resident: ${formData.fullName}`;
    const qrCode = await QRCode.toDataURL(qrData, { width: 300 });
    doc.addImage(qrCode, "PNG", 20, 265, 30, 30);
    doc.setFontSize(8);
    doc.text(TEXTS.verify_qr, 35, 298, { align: "center" });

    doc.save(`Resident_Certificate_${serialNumber}.pdf`);
    
    toast({
      title: "Certificate Downloaded",
      description: "Your resident certificate has been generated successfully.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        await generatePDF();
        setTimeout(() => navigate("/services"), 2000);
      }
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-lg font-semibold text-foreground mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input id="fullName" required value={formData.fullName} 
                  onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nidaNumber">NIDA Number *</Label>
                <Input id="nidaNumber" required value={formData.nidaNumber}
                  onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input id="dob" type="date" required value={formData.dob}
                  onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" type="tel" required value={formData.phone}
                  onChange={handleInputChange} />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-lg font-semibold text-foreground mb-4">Location Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="village">Village/Street *</Label>
                <Input id="village" required value={formData.village}
                  onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="residencyReason">Residency Reason</Label>
                <Select value={formData.residencyReason} onValueChange={(v) => handleSelectChange("residencyReason", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent Residence">Permanent Residence</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationType">Duration</Label>
                <Select value={formData.durationType} onValueChange={(v) => handleSelectChange("durationType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Permanent">Permanent</SelectItem>
                    <SelectItem value="1 Year">1 Year</SelectItem>
                    <SelectItem value="6 Months">6 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-lg font-semibold text-foreground mb-4">Payment & Confirmation</h2>
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
                <span className="text-muted-foreground">Processing Fee:</span>
                <span className="font-semibold text-foreground">TSh 5,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee:</span>
                <span className="font-semibold text-foreground">TSh 2,000</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total:</span>
                <span className="font-bold text-primary">TSh 7,000</span>
              </div>
            </Card>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Processing Time:</strong> Instant after payment confirmation
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button variant="ghost" onClick={() => navigate("/services")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>

        <Card className="glass-card p-8 border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Resident Certificate</h1>
              <p className="text-sm text-muted-foreground">Cheti cha Ukaaji</p>
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
                {step === 3 ? (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Generate Certificate
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

export default ResidentCertificate;