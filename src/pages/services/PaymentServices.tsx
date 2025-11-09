import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Receipt, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

// --- Logo and Bilingual Content Definitions ---
const LOGO_URL = "https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png";

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

const PaymentServices = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    paymentType: "Resident Certificate", // Sample default
    amount: "7000", // Sample default
    payerName: "John Doe", // Sample default
    nidaNumber: "19900101-12345-00", // Sample default
    phone: "0712345678", // Sample default
    paymentMethod: "M-Pesa", // Sample default
    referenceNumber: "MP20251109ABC123", // Sample default
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };


  const generateReceipt = async () => {
    const doc = new jsPDF({ unit: "mm", format: "a5" });
    const receiptNo = `REC-${Date.now()}`;
    const dateIssued = new Date().toLocaleDateString('en-GB');

    // --- Header and Logo ---
    const tanzaniaLogo = await loadImage(LOGO_URL);
    doc.addImage(tanzaniaLogo, "PNG", 75, 5, 15, 15);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("WARD EXECUTIVE OFFICE", 105, 25, { align: "center" });
    doc.text("RISITI YA MALIPO YA HUDUMA", 105, 30, { align: "center" });
    doc.setFontSize(10);
    doc.line(20, 35, 190, 35); // Separator

    // --- Receipt Details ---
    let y = 45;
    doc.setFont("helvetica", "normal");
    doc.text(`RECEIPT NO:`, 20, y);
    doc.setFont("helvetica", "bold");
    doc.text(receiptNo, 60, y);
    doc.setFont("helvetica", "normal");
    doc.text(`DATE:`, 130, y);
    doc.setFont("helvetica", "bold");
    doc.text(dateIssued, 160, y);

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("PAYMENT DETAILS", 105, y, { align: "center" });
    doc.line(20, y + 2, 190, y + 2); // Separator

    // --- Itemized Details Table ---
    y += 10;
    doc.setFontSize(10);
    const tableData = [
        ["Service Type / Aina ya Huduma:", formData.paymentType],
        ["Amount Paid / Kiasi Kilicholipwa:", `TSh ${new Intl.NumberFormat().format(parseInt(formData.amount))} / =`],
        ["Payer Name / Jina la Mlipaji:", formData.payerName],
        ["NIDA Number / Namba ya NIDA:", formData.nidaNumber],
        ["Payment Method / Njia ya Malipo:", formData.paymentMethod],
        ["Reference Number / Namba ya Kumbukumbu:", formData.referenceNumber],
        ["Ward / Kata:", "Kijitonyama"],
        ["District / Wilaya:", "Kinondoni"],
    ];

    tableData.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "bold");
      doc.text(value, 100, y);
      y += 7;
    });

    // --- Total Box ---
    y += 5;
    doc.setDrawColor(0);
    doc.setFillColor(200, 200, 200);
    doc.rect(19, y, 172, 10, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL (JUMLA):", 25, y + 6);
    doc.text(`TSh ${new Intl.NumberFormat().format(parseInt(formData.amount))} / =`, 175, y + 6, { align: "right" });

    // --- Footer ---
    y += 20;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("This is an official receipt and does not require a physical signature.", 105, y, { align: "center" });
    y += 4;
    doc.text("Uthibitisho wa malipo unaweza kuthibitishwa mtandaoni kwa kutumia namba ya kumbukumbu.", 105, y, { align: "center" });


    doc.save(`Payment_Receipt_${receiptNo}.pdf`);
    
    toast({
      title: "Receipt Generated",
      description: "Your sample payment receipt has been downloaded successfully.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paymentType || !formData.amount || !formData.payerName || !formData.referenceNumber) {
        toast({ title: "Validation Error", description: "Please fill in all required fields.", variant: "destructive" });
        return;
    }
    await generateReceipt();
    setTimeout(() => navigate("/services"), 1500);
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
            <Receipt className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Payment Services</h1>
              <p className="text-sm text-muted-foreground">Risiti ya Malipo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentType">Service Paid For *</Label>
                <Select value={formData.paymentType} onValueChange={(v) => handleSelectChange("paymentType", v)} required>
                  <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Resident Certificate">Resident Certificate (TSh 7,000)</SelectItem>
                    <SelectItem value="Introduction Letter">Introduction Letter (TSh 3,000)</SelectItem>
                    <SelectItem value="Business Permit">Business Permit (TSh 50,000)</SelectItem>
                    <SelectItem value="Other">Other Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount Paid (TSh) *</Label>
                <Input id="amount" type="number" required placeholder="e.g. 7000"
                  value={formData.amount}
                  onChange={handleInputChange} />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground pt-4">Payer Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payerName">Payer Full Name *</Label>
                <Input id="payerName" required value={formData.payerName}
                  onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nidaNumber">NIDA Number</Label>
                <Input id="nidaNumber" value={formData.nidaNumber}
                  onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" value={formData.phone}
                  onChange={handleInputChange} />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground pt-4">Transaction Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={(v) => handleSelectChange("paymentMethod", v)} required>
                  <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Tigo Pesa">Tigo Pesa</SelectItem>
                    <SelectItem value="Airtel Money">Airtel Money</SelectItem>
                    <SelectItem value="Bank Card">Bank Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Payment Reference Number *</Label>
                <Input id="referenceNumber" required placeholder="Transaction ID"
                  value={formData.referenceNumber}
                  onChange={handleInputChange} />
              </div>

              <Card className="bg-secondary/10 p-4">
                <p className="text-sm text-foreground">
                  <strong>Payment Instructions:</strong><br/>
                  1. Complete payment via selected method<br/>
                  2. Enter the transaction reference number<br/>
                  3. Submit to generate receipt<br/>
                  4. Receipt will be verified within 1 hour
                </p>
              </Card>
            </div>

            <Button type="submit" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Generate Sample Receipt
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PaymentServices;