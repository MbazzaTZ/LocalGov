import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
  LogOut,
  ShieldAlert,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { user, signOut, isVerified, profile } = useAuth();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  const stats = [
    {
      icon: Users,
      value: "100%",
      label: language === "en" ? "Inclusion" : "Ujumuishaji",
    },
    {
      icon: Clock,
      value: "< 48hrs",
      label: language === "en" ? "Processing" : "Usindikaji",
    },
    {
      icon: CheckCircle2,
      value: "95%",
      label: language === "en" ? "Digital" : "Kidijitali",
    },
  ];

  const getDashboardPath = () => {
    if (!profile) return "/dashboard";
    if (profile.is_admin) return "/admin-dashboard";
    if (profile.is_district_staff) return "/district-dashboard";
    if (profile.is_ward_staff) return "/ward-dashboard";
    if (profile.is_village_staff) return "/staff-dashboard";
    return "/dashboard";
  };

  const dashboardPath = getDashboardPath();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/70 to-green-50/60">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200/50 backdrop-blur-md bg-white/70 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-3 px-4 md:px-8">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="https://images.seeklogo.com/logo-png/31/1/coat-of-arms-of-tanzania-logo-png_seeklogo-311608.png"
              alt="Tanzania Logo"
              className="w-8 h-8 rounded-md border border-blue-400 bg-white shadow-sm"
            />
            <div>
              <h1 className="text-sm font-semibold text-gray-800">
                Tanzania Local Government
              </h1>
              <p className="text-xs text-gray-500">
                Digital Services Portal
              </p>
            </div>
            <Badge className="bg-green-500 text-white ml-2">BETA</Badge>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button
                  onClick={() => navigate(dashboardPath)}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> {t("Dashboard")}
                </Button>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="flex items-center gap-2 border-gray-300 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" /> {t("Sign Out")}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" /> {t("Log In / Sign Up")}
              </Button>
            )}

            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto py-16 px-6 text-center">
        {user && !isVerified && (
          <Card className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 mb-10 max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <ShieldAlert className="w-6 h-6 mr-3 flex-shrink-0" />
              <p className="text-sm font-medium text-left">
                {t(
                  "Your account is not yet verified. Please complete NIDA verification to access all services."
                )}
              </p>
            </div>
            <Button
              onClick={() => navigate("/verify")}
              className="bg-yellow-600 hover:bg-yellow-700 text-white ml-4"
            >
              {t("Verify Now")}
            </Button>
          </Card>
        )}

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          One Portal,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
            All Services
          </span>
        </h1>

        <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-8">
          Access every local government service digitally. No physical visits
          required. 100% inclusion guaranteed.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-green-600 text-white hover:opacity-90 shadow-md flex items-center gap-2"
            onClick={() => navigate("/services")}
          >
            <FileText className="w-5 h-5" /> {t("Explore Services")}
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </main>

      {/* Statistics Section */}
      <section className="py-10 bg-white/60 backdrop-blur-sm border-t border-gray-200/40">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-6 bg-white/80 rounded-xl shadow-md border border-gray-200/60 hover:shadow-lg transition-all"
            >
              <stat.icon className="w-8 h-8 mx-auto text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/70 backdrop-blur-md py-6 mt-10 text-sm text-gray-600">
        <div className="container mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3">
          <p>© {new Date().getFullYear()} Tanzania Local Government</p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="link"
              className="text-sm text-gray-700 hover:text-blue-600"
              onClick={() => navigate("/about")}
            >
              {t("About")}
            </Button>
            <Button
              variant="link"
              className="text-sm text-gray-700 hover:text-blue-600"
              onClick={() => navigate("/info")}
            >
              {t("Information Center")}
            </Button>
            <Button
              variant="link"
              className="text-sm text-gray-700 hover:text-blue-600"
              onClick={() => navigate("/contact")}
            >
              {t("Contact")}
            </Button>
            <Button
              variant="link"
              className="text-sm text-gray-700 hover:text-blue-600"
              onClick={() => navigate("/admin-login")}
            >
              {t("Admin")}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
