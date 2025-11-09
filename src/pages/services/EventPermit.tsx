import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Download, Calendar, Shield, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import QRCode from "qrcode";

// --- Logo and Bilingual Content Definitions ---
const LOGO_URL = "https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png";

const TEXTS = {
  header_en: "UNITED REPUBLIC OF TANZANIA",
  header_sw: "JAMHURI YA MUUNGANO WA TANZANIA",
  title_en: "OFFICIAL EVENT PERMIT",
  title_sw: "KIBALI RASMI CHA TUKIO",
  issued_en: "Issued by the Ward Executive Office",
  issued_sw: "Imetolewa na Ofisi ya Mtendaji wa Kata",
  permit_no_en: "Permit Serial No:",
  permit_no_sw: "Namba ya Kibali:",
  event_en: "EVENT DETAILS / TAARIFA ZA TUKIO",
  organizer_en: "ORGANIZER DETAILS / TAARIFA ZA MWAANDAaji",
  event_name_en: "Event Name / Jina la Tukio:",
  event_type_en: "Event Type / Aina ya Tukio:",
  venue_en: "Venue Name / Jina la Eneo:",
  address_en: "Venue Address / Anuani ya Eneo:",
  date_time_en: "Date & Time / Tarehe na Muda:",
  attendees_en: "Expected Attendees / Idadi ya Washiriki:",
  organizer_name_en: "Organizer Name / Jina la Mwaandaaji:",
  organizer_phone_en: "Phone / Simu:",
  statement_en: "PERMISSION GRANTED: The Ward Executive Office authorizes the named event, subject to strict adherence to all stated conditions, safety regulations, and local peace and order mandates. Security and noise control plans must be enforced.",
  statement_sw: "RUHUSA IMETOLEWA: Ofisi ya Mtendaji wa Kata inaruhusu tukio lililotajwa, kwa masharti ya kuzingatia kikamilifu masharti yote yaliyotajwa, kanuni za usalama, na amri za amani na utulivu za mitaa. Mipango ya usalama na udhibiti wa kelele lazima itekelezwe.",
  ward_exec_en: "WARD EXECUTIVE OFFICER (Signature & Stamp)",
  ward_exec_sw: "MTENDAJI WA KATA (Sahihi na Muhuri)",
  fee_en: "Application Fee Paid: TSh 5,000", // Assuming a fee for all permits
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

const EventPermit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venueName: "",
    venueAddress: "",
    expectedAttendees: "",
    organizerName: "",
    organizerPhone: "",
    organizerEmail: "",
    eventDescription: "",
    securityPlan: "",
    noiseControl: false,
    publicSafety: false,
    language: "bilingual",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (step === 1 && (!formData.eventName || !formData.eventDate || !formData.venueAddress)) {
      toast({ title: "Error", description: "Please complete all basic event details.", variant: "destructive" });
      return false;
    }
    if (step === 2 && (!formData.organizerName || !formData.organizerPhone)) {
      toast({ title: "Error", description: "Please complete all organizer details.", variant: "destructive" });
      return false;
    }
    if (step === 3 && (!formData.securityPlan || !formData.noiseControl || !formData.publicSafety)) {
      toast({ title: "Error", description: "You must detail your plans and confirm adherence to safety.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const generatePDF = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const permitNo = `EPR-${Date.now()}`;
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

    // --- Title and Permit No ---
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.title_en, 105, 60, { align: "center" });
    doc.setFontSize(12);
    doc.text(TEXTS.title_sw, 105, 66, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.text(`${TEXTS.permit_no_en} ${permitNo}`, 20, 78);
    doc.text(`Date Issued / Tarehe Imetolewa: ${dateIssued}`, 130, 78);

    // --- Event Details ---
    let y = 88;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.event_en, 20, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const eventData = [
      [TEXTS.event_name_en, formData.eventName],
      [TEXTS.event_type_en, formData.eventType || "General"],
      [TEXTS.venue_en, formData.venueName || "N/A"],
      [TEXTS.address_en, formData.venueAddress],
      [TEXTS.date_time_en, `${formData.eventDate} @ ${formData.eventTime}`],
      [TEXTS.attendees_en, formData.expectedAttendees],
    ];

    eventData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 110, y);
      y += 6;
    });

    // --- Organizer Details ---
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.organizer_en, 20, y);
    doc.line(20, y + 2, 190, y + 2);

    y += 8;
    doc.setFont("helvetica", "normal");
    const organizerData = [
      [TEXTS.organizer_name_en, formData.organizerName],
      [TEXTS.organizer_phone_en, formData.organizerPhone],
      ["Email / Barua Pepe:", formData.organizerEmail],
    ];

    organizerData.forEach(([label, value]) => {
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

    // --- Footer ---
    doc.setFontSize(10);
    doc.text(TEXTS.fee_en, 20, 260);

    // --- Signature, Stamp, and QR ---
    doc.setFont("helvetica", "bold");
    doc.text(TEXTS.ward_exec_en, 130, 240);
    doc.text(TEXTS.ward_exec_sw, 130, 245);
    doc.line(130, 250, 190, 250); // Signature line

    // QR Code
    const qrData = `Verify Event Permit: ${permitNo} - Event: ${formData.eventName}`;
    const qrCode = await QRCode.toDataURL(qrData, { width: 300 });
    doc.addImage(qrCode, "PNG", 20, 265, 30, 30);
    doc.setFontSize(8);
    doc.text(TEXTS.verify_qr, 35, 298, { align: "center" });

    doc.save(`Event-Permit-${permitNo}.pdf`);
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
          description: "The Official Event Permit (PDF) has been downloaded.",
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
            <h3 className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> Event Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name *</Label>
                <Input id="eventName" name="eventName" required value={formData.eventName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Input id="eventType" name="eventType" value={formData.eventType} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date *</Label>
                <Input id="eventDate" name="eventDate" type="date" required value={formData.eventDate} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime">Time (Start) *</Label>
                <Input id="eventTime" name="eventTime" type="time" required value={formData.eventTime} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueName">Venue Name (e.g., Ward Hall, Street Name)</Label>
              <Input id="venueName" name="venueName" value={formData.venueName} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venueAddress">Complete Venue Address (Ward, Village/Street) *</Label>
              <Textarea id="venueAddress" name="venueAddress" required value={formData.venueAddress} onChange={handleInputChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Globe className="w-4 h-4" /> Organizer & Scope</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizerName">Organizer Full Name/Organization *</Label>
                <Input id="organizerName" name="organizerName" required value={formData.organizerName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expectedAttendees">Expected Attendees *</Label>
                <Input id="expectedAttendees" name="expectedAttendees" type="number" min="1" required value={formData.expectedAttendees} onChange={handleInputChange} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizerPhone">Organizer Phone Number *</Label>
                <Input id="organizerPhone" name="organizerPhone" type="tel" required value={formData.organizerPhone} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizerEmail">Organizer Email</Label>
                <Input id="organizerEmail" name="organizerEmail" type="email" value={formData.organizerEmail} onChange={handleInputChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Brief Description of Activities</Label>
              <Textarea id="eventDescription" name="eventDescription" value={formData.eventDescription} onChange={handleInputChange} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2"><Shield className="w-4 h-4" /> Safety & Compliance</h3>
            <div className="space-y-2">
              <Label htmlFor="securityPlan">Security Plan Details (Describe your security/crowd control measures) *</Label>
              <Textarea id="securityPlan" name="securityPlan" required value={formData.securityPlan} onChange={handleInputChange} />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="noiseControl" name="noiseControl" checked={formData.noiseControl} onChange={handleInputChange} className="w-4 h-4" />
                <Label htmlFor="noiseControl" className="cursor-pointer">I will ensure compliance with local noise control ordinances *</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="publicSafety" name="publicSafety" checked={formData.publicSafety} onChange={handleInputChange} className="w-4 h-4" />
                <Label htmlFor="publicSafety" className="cursor-pointer">I have a public safety and emergency response plan *</Label>
              </div>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                **Note:** Large public events may require further review and approval from Police or Health Departments.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Finalize & Payment</h3>
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
                <span className="text-muted-foreground">Application Fee:</span>
                <span className="font-semibold text-foreground">TSh 5,000</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between">
                <span className="font-semibold text-foreground">Total Payable:</span>
                <span className="font-bold text-primary">TSh 5,000</span>
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
            <Calendar className="w-6 h-6" />
            Event Permit Request
          </h1>
          <p className="text-muted-foreground mb-4">
            Apply for an official permit to hold a public event.
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

export default EventPermit;