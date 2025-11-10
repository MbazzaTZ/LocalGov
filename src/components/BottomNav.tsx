import React from "react";
import { Home, FileText, CreditCard, Settings } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { label: "Home", icon: <Home className="w-5 h-5" />, href: "/citizen/dashboard" },
    { label: "Services", icon: <FileText className="w-5 h-5" />, href: "/services" },
    { label: "Payments", icon: <CreditCard className="w-5 h-5" />, href: "/payments" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/citizen/settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-900/90 border-t border-blue-700 backdrop-blur-lg flex justify-around py-2 text-white md:hidden z-40">
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="flex flex-col items-center text-xs hover:text-yellow-300 transition-all"
        >
          {item.icon}
          <span className="mt-1">{item.label}</span>
        </a>
      ))}
    </div>
  );
};

export default BottomNav;
