import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, FileText, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";

// --- Logo and Bilingual Content Definitions ---
const LOGO_URL =
  "https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png";

const TEXTS = {
  header_en: "UNITED REPUBLIC OF TANZANIA",
  header_sw: "JAMHURI YA MUUNGANO WA TANZANIA",
  title_en: "OFFICIAL BURIAL PERMIT",
  title_sw: "KIBALI RASMI CHA MAZISHI",
  issued_en: "Issued by the Office of the Ward Executive Officer",
  issued_sw: "Imetolewa na Ofisi ya Mtendaji wa Kata",
  permit_no_en: "Permit Serial No:",
  permit_no_sw: "Namba ya Kibali:",
  deceased_en: "DECEASED INFORMATION",
  deceased_sw: "TAARIFA ZA MAREHEMU",
  burial_en: "BURIAL DETAILS",
  burial_sw: "TAARIFA ZA MAZISHI",
  applicant_en: "APPLICANT/REQUESTER",
  applicant_sw: "MWOMBAJI/MWENYE OMBI",
  name_en: "Name / Jina Kamili:",
  nida_en: "NIDA / Kitambulisho cha NIDA:",
  dod_en: "Date of Death / Tarehe ya Kifo:",
  cause_en: "Cause of Death / Chanzo cha Kifo:",
  cemetery_en: "Cemetery Name / Jina la Makaburi:",
  location_en: "Location / Eneo:",
  plot_en: "Plot No. / Namba ya Kaburi:",
  date_time_en: "Date & Time / Tarehe na Muda:",
  relation_en: "Relationship / Uhusiano:",
  statement_en: "PERMISSION GRANTED: The Ward Executive Office authorizes the burial of the deceased named above, provided all health and local regulations are strictly adhered to.",
  statement_sw: "RUHUSA IMETOLEWA: Ofisi ya Mtendaji wa Kata inaruhusu mazishi ya marehemu aliyetajwa hapo juu, kwa masharti kwamba kanuni zote za afya na za mitaa zitafuatwa kikamilifu.",
  validity_en: "This permit is valid for burial within 24 hours of the specified burial date.",
  validity_sw: "Kibali hiki ni halali kwa mazishi ndani ya masaa 24 kuanzia tarehe iliyotajwa ya mazishi.",
  ward_exec_en: "WARD EXECUTIVE OFFICER (Signature & Stamp)",
  ward_exec_sw: "MTENDAJI WA KATA (Sahihi na Muhuri)",
  fee_en: "Service Fee Paid: TSh 5,000",
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

const BurialPermit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState({
    deceasedName: "",
    deceasedNIDA: "",
    dateOfDeath: "",
    causeOfDeath: "",
    graveyardName: "",
    graveyardLocation: "",
    plotNumber: "",
    applicantName: "",
    applicantPhone: "",
    applicantRelation: "",
    familyConsent: false,
    burialDate: "",
    burialTime: "",
    language: "bilingual", // New field for language preference
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep = () => {
    // Implement simple validation before moving to the next step
    if (step === 1 && (!formData.deceasedName || !formData.dateOfDeath)) {
      toast({ title: "Error", description: "Please complete all deceased details.", variant: "destructive" });
      return false;
    }
    if (step === 2 && (!formData.graveyardName || !formData.burialDate)) {
      toast({ title: "Error", description: "Please complete all burial details.", variant: "destructive" });
      return false;
    }
    if (step === 3 && (!formData.applicantName || !formData.applicantRelation || !formData.familyConsent)) {
      toast({ title: "Error", description: "Please complete applicant details and confirm consent.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const permitNo = `BP-${Date.now()}`;

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
    doc.text(`Date Issued / Tarehe Imetolewa: ${new Date().toLocaleDateString()}`, 130, 78);

    // --- Deceased Information ---
    let y = 88;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.deceased_en, 20, y);
    doc.text(TEXTS.deceased_sw, 105, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const deceasedData = [
      [TEXTS.name_en, formData.deceasedName],
      [TEXTS.nida_en, formData.deceasedNIDA || "N/A"],
      [TEXTS.dod_en, formData.dateOfDeath],
      [TEXTS.cause_en, formData.causeOfDeath],
    ];

    deceasedData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Burial Details ---
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.burial_en, 20, y);
    doc.text(TEXTS.burial_sw, 105, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const burialData = [
      [TEXTS.cemetery_en, formData.graveyardName],
      [TEXTS.location_en, formData.graveyardLocation],
      [TEXTS.plot_en, formData.plotNumber || "N/A"],
      [TEXTS.date_time_en, `${formData.burialDate} at ${formData.burialTime}`],
    ];

    burialData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Applicant Information ---
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.applicant_en, 20, y);
    doc.text(TEXTS.applicant_sw, 105, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const applicantData = [
      [TEXTS.name_en, formData.applicantName],
      [TEXTS.relation_en, formData.applicantRelation],
      ["Phone / Simu:", formData.applicantPhone],
    ];

    applicantData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Official Statement (Permission) ---
    y += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PERMISSION STATEMENT / TAARIFA YA RUHUSA", 105, y, { align: "center" });
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
    const qrData = `Verify Permit: ${permitNo} - Deceased: ${formData.deceasedName}`;
    const qrCode = await QRCode.toDataURL(qrData, { width: 300 });
    doc.addImage(qrCode, "PNG", 20, 265, 30, 30);
    doc.setFontSize(8);
    doc.text(TEXTS.verify_qr, 35, 298, { align: "center" });

    doc.save(`Burial-Permit-${permitNo}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        // Final Step: Generate PDF and provide confirmation
        await generatePDF();
        toast({
          title: "Permit Generated",
          description: "The Official Burial Permit (PDF) has been downloaded.",
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
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Deceased Information (Taarifa za Marehemu)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deceasedName">Full Name *</Label>
                <Input id="deceasedName" name="deceasedName" required value={formData.deceasedName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deceasedNIDA">NIDA Number (if known)</Label>
                <Input id="deceasedNIDA" name="deceasedNIDA" value={formData.deceasedNIDA} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfDeath">Date of Death *</Label>
              <Input id="dateOfDeath" name="dateOfDeath" type="date" required value={formData.dateOfDeath} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="causeOfDeath">Cause of Death (Requires Doctor's Note/Police Report)</Label>
              <Textarea id="causeOfDeath" name="causeOfDeath" value={formData.causeOfDeath} onChange={handleInputChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Burial Details (Taarifa za Mazishi)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="graveyardName">Cemetery/Graveyard Name *</Label>
                <Input id="graveyardName" name="graveyardName" required value={formData.graveyardName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graveyardLocation">Cemetery Location (Ward/Village) *</Label>
                <Input id="graveyardLocation" name="graveyardLocation" required value={formData.graveyardLocation} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plotNumber">Plot Number (if known)</Label>
                <Input id="plotNumber" name="plotNumber" value={formData.plotNumber} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="burialDate">Burial Date *</Label>
                <Input id="burialDate" name="burialDate" type="date" required value={formData.burialDate} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="burialTime">Burial Time *</Label>
                <Input id="burialTime" name="burialTime" type="time" required value={formData.burialTime} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Applicant Details (Taarifa za Mwombaji)
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="applicantName">Applicant Full Name *</Label>
                <Input id="applicantName" name="applicantName" required value={formData.applicantName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applicantRelation">Relationship to Deceased *</Label>
                <Input id="applicantRelation" name="applicantRelation" required value={formData.applicantRelation} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="applicantPhone">Applicant Phone Number *</Label>
              <Input id="applicantPhone" name="applicantPhone" type="tel" required value={formData.applicantPhone} onChange={handleInputChange} />
            </div>

            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="familyConsent"
                name="familyConsent"
                checked={formData.familyConsent}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <Label htmlFor="familyConsent" className="cursor-pointer">
                I confirm that I have obtained consent from immediate family members *
              </Label>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              Final Review & Payment (Mapitio ya Mwisho)
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                Document Language *
              </Label>
              <select
                value={formData.language}
                onChange={(e) => handleSelectChange("language", e.target.value)}
                className="p-2 border rounded-md w-full"
              >
                <option value="bilingual">Bilingual (English & Swahili)</option>
                <option value="english">English Only</option>
                <option value="swahili">Swahili Only</option>
              </select>
            </div>

            <Card className="bg-muted/50 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee:</span>
                <span className="font-semibold text-foreground">TSh 5,000</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total Payable:</span>
                <span className="font-bold text-primary">TSh 5,000</span>
              </div>
            </Card>
            <div className="bg-secondary/10 p-4 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Processing Note:</strong> Once the fee is paid, the permit is instantly issued and downloaded.
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Services
        </Button>
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Burial Permit Request
          </h1>
          <p className="text-muted-foreground mb-4">
            Apply for the official permit required to conduct a burial.
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Step {step} of {totalSteps}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progress} className="h-2" />
              </div>
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
                    Generate Permit
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

export default BurialPermit;