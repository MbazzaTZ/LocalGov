import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Users,
  Zap,
  Lock,
  Leaf,
  Globe,
  Star,
  ZapIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  const corePillars = [
    {
      icon: Users,
      title: "Citizen Inclusion",
      description:
        "Ensuring every citizen, regardless of location, has equal access to local government services.",
    },
    {
      icon: ZapIcon,
      title: "Digital-First Efficiency",
      description:
        "Streamlining all application processes, reducing paperwork, and cutting down processing times.",
    },
    {
      icon: Lock,
      title: "Security & Trust",
      description:
        "Employing end-to-end encryption and NIDA verification to secure personal data and prevent fraud.",
    },
    {
      icon: Globe,
      title: "Transparency",
      description:
        "Providing real-time application tracking and clear fee structures for all services.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
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
            <Shield className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-4xl font-extrabold text-foreground mb-4">
              About SmartGov
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              **NIDA is All You Need** – One Portal, All Services, Full Digital Inclusion.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card p-8 border-border/50 shadow-lg hover:shadow-xl transition">
              <Star className="w-6 h-6 text-primary mb-3" />
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Our Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the leading national digital platform for local government services, achieving 100% digital transformation and citizen satisfaction across all districts and wards of Tanzania.
              </p>
            </Card>
            <Card className="glass-card p-8 border-border/50 shadow-lg hover:shadow-xl transition">
              <Leaf className="w-6 h-6 text-secondary mb-3" />
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The Tanzania Local Government Portal is a national, inclusive, digital-first platform that simplifies access to essential services, fostering transparency, efficiency, and direct accountability between local government and its citizens.
              </p>
            </Card>
          </div>

          {/* Core Pillars Section */}
          <section>
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              Core Pillars of the Portal
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {corePillars.map((pillar, index) => (
                <Card
                  key={index}
                  className="p-6 text-center border-border/50 hover:bg-muted/10 transition-colors"
                >
                  <pillar.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pillar.description}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <Card className="glass-card p-8 border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Need More Information?</h2>
            <p className="text-muted-foreground mb-6">
              Visit our Information Center or contact us directly for assistance.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/info")}>
                Information Center
              </Button>
              <Button variant="outline" onClick={() => navigate("/contact")}>
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;