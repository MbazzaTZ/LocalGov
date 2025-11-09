import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Mail,
  Briefcase,
  Building2,
  Users,
  Landmark,
  HeartHandshake,
  Gavel,
  ShieldCheck,
  ArrowLeft,
  CalendarClock,
  GraduationCap,
  Hospital,
  Car,
  AlertTriangle,
  Clock,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services: React.FC = () => {
  const navigate = useNavigate();

  // ✅ Core Service Categories
  const categories = [
    {
      title: "Citizen Services",
      icon: Users,
      color: "text-primary",
      services: [
        {
          name: "Resident Certificate",
          desc: "Proof of residence within your local ward or village.",
          path: "/services/resident-certificate",
          icon: FileText,
        },
        {
          name: "Introduction Letter",
          desc: "Official letter for employment, school, or personal use.",
          path: "/services/introduction-letter",
          icon: Mail,
        },
        {
          name: "Burial Permit",
          desc: "Obtain authorization for burial arrangements.",
          path: "/services/burial-permit",
          icon: HeartHandshake,
        },
        {
          name: "Open Case / Report Issue",
          desc: "Report community issues or request mediation.",
          path: "/services/open-case",
          icon: Gavel,
        },
      ],
    },
    {
      title: "Business & Permits",
      icon: Briefcase,
      color: "text-green-600",
      services: [
        {
          name: "Business License Application",
          desc: "Apply for a new license or renew an existing one.",
          path: "/services/business-license",
          icon: Building2,
        },
        {
          name: "Land Use Permit",
          desc: "Request approval for changes in land utilization.",
          path: "/services/land-use-permit",
          icon: Landmark,
        },
        {
          name: "Construction Permit",
          desc: "Submit plans for new construction or renovation.",
          path: "/services/construction-permit",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  // Other services (grouped for simpler rendering of misc items)
  const otherCategories = [
    {
      title: "Community & Welfare",
      icon: HeartHandshake,
      color: "text-pink-600",
      services: [
        {
          name: "Welfare Support Application",
          desc: "Apply for local government welfare and aid programs.",
          path: "/services/welfare",
          icon: AlertTriangle,
        },
        {
          name: "ID / NIDA Verification",
          desc: "Verify identity documents for official purposes.",
          path: "/services/id-verification",
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: "Education & Health",
      icon: GraduationCap,
      color: "text-indigo-600",
      services: [
        {
          name: "School Enrollment",
          desc: "Register new students for local public schools.",
          path: "/services/enrollment",
          icon: GraduationCap,
        },
        {
          name: "Health Facility Access",
          desc: "Apply for subsidized healthcare access.",
          path: "/services/health-access",
          icon: Hospital,
        },
      ],
    },
  ];

  // Services marked as 'Upcoming'
  const upcoming = [
    {
      name: "Vehicle Registration",
      desc: "Register a new vehicle or renew existing registration.",
      icon: Car,
    },
    {
      name: "Scheduled Appointments",
      desc: "Book a time slot to meet with a Ward Officer.",
      icon: CalendarClock,
    },
    {
      name: "Pension Fund Application",
      desc: "Submit application for local government pension funds.",
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="link"
          className="text-muted-foreground mb-6 flex items-center gap-1 p-0"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8 border-b pb-2">
          Available Digital Services
        </h1>

        {/* ✅ Render Core Service Categories */}
        {[...categories, ...otherCategories].map((cat, index) => (
          <section key={index} className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <cat.icon className={`w-6 h-6 ${cat.color}`} />
              <h2 className="text-2xl font-semibold text-foreground">
                {cat.title}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cat.services.map((srv, sIdx) => (
                <Card key={sIdx} className="p-6 hover:shadow-lg transition-shadow">
                  <srv.icon className={`w-8 h-8 ${cat.color} mb-3`} />
                  <h3 className="font-semibold text-foreground mb-2">
                    {srv.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{srv.desc}</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    // 📝 MODIFIED: Point all services to the generic application form
                    onClick={() => navigate("/submit-application", { state: { serviceName: srv.name } })} 
                    className="mt-4 flex items-center gap-2"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        ))}

        {/* ✅ Upcoming Services */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Rocket className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-semibold text-foreground">
              Upcoming Services
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {upcoming.map((srv, idx) => (
              <Card
                key={idx}
                className="p-6 border-dashed border-2 border-border/50 bg-muted/10 hover:shadow-sm"
              >
                <srv.icon className="w-8 h-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">
                  {srv.name}
                </h3>
                <p className="text-sm text-muted-foreground">{srv.desc}</p>
                <Button
                  disabled
                  variant="outline"
                  size="sm"
                  className="mt-4 opacity-70 cursor-not-allowed"
                >
                  Coming Soon
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer Line */}
        <p className="text-center text-xs text-muted-foreground mt-16">
          © {new Date().getFullYear()} Tanzania Local Government | Smart Digital
          Gateway
        </p>
      </div>
    </div>
  );
};

export default Services;