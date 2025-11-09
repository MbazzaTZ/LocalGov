import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft,
  FileText,
  HelpCircle,
  BookOpen,
  Download,
  ShieldCheck,
  Clock,
  Wallet,
  Globe,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InfoCenter = () => {
  const navigate = useNavigate();

  // ✅ Consolidated and expanded FAQs
  const faqs = [
    {
      question: "What is NIDA and why do I need it?",
      answer:
        "NIDA (National Identification Authority) is your national ID number. It is the primary identification required for all government services. It streamlines your application process, verifies your identity, and ensures faster approval times. If you don't have NIDA, the verification process will guide you on using alternative IDs like TIN, Driver License, or Passport.",
      icon: ShieldCheck,
    },
    {
      question: "How long does it take to process my application?",
      answer:
        "Processing times vary by service: **Resident Certificate** (1-3 hrs), **Introduction Letter** (2-4 hrs), **Business Permit** (48 hrs), **Construction Permit** (7-14 days). You can track your application status in real-time on your dashboard.",
      icon: Clock,
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major mobile money platforms (M-Pesa, Tigo Pesa, Airtel Money) and bank cards. All payments are processed securely, and you will receive an instant digital receipt. Outstanding payments can be viewed on the **Payment Services** page.",
      icon: Wallet,
    },
    {
      question: "Can I apply from anywhere in Tanzania?",
      answer:
        "Yes! Our portal is 100% digital. You can apply for services from anywhere with internet access. Your application will be automatically routed and processed by your registered local ward or district office.",
      icon: Globe,
    },
    {
      question: "Who manages this portal?",
      answer:
        "The SmartGov platform is managed by the **President's Office - Regional Administration and Local Government (PO-RALG)**, ensuring compliance with national policies and standards.",
      icon: MessageCircle,
    },
  ];

  // ✅ New section for guides/resources
  const guides = [
    {
      title: "Citizen Account Creation Manual",
      description: "A step-by-step guide on registering and verifying your citizen account.",
      icon: FileText,
      downloadLink: "#",
    },
    {
      title: "Service Application Guide",
      description: "Detailed instructions for applying for the top 5 most common services.",
      icon: BookOpen,
      downloadLink: "#",
    },
    {
      title: "Payment and Fee Structure",
      description: "A comprehensive document outlining all service fees and payment procedures.",
      icon: Wallet,
      downloadLink: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-secondary mx-auto mb-3" />
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              Information Center
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your source for quick answers, guides, and manuals for navigating all local government services.
            </p>
          </div>

          {/* FAQs */}
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Frequently Asked Questions (FAQs)
            </h2>
            <Card className="glass-card p-6 border-border/50 shadow-lg">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, idx) => (
                  <AccordionItem key={idx} value={`item-${idx}`}>
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      <faq.icon className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pl-7">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>

          {/* Guides and Resources */}
          <div className="pt-4">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-secondary" />
              Guides and Resources
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {guides.map((guide, idx) => (
                <Card
                  key={idx}
                  className="glass-card p-6 border-border/50 hover:shadow-xl transition flex justify-between items-start"
                >
                  <div className="flex items-start gap-4">
                    <guide.icon className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {guide.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="ml-4 flex-shrink-0"
                  >
                    <a href={guide.downloadLink} download>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <Card className="glass-card p-8 border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Still Need Personalized Help?
            </h2>
            <p className="text-muted-foreground mb-6">
              If your question isn't answered here, our support team is ready to assist you.
            </p>
            <Button onClick={() => navigate("/contact")}>
              <MessageCircle className="w-4 h-4 mr-2" /> Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InfoCenter;