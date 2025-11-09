import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: "Home",
      services: "Services",
      about: "About",
      contact: "Contact",
      infoCenter: "Information Center",
      myDashboard: "My Dashboard",
      logout: "Logout",
      login: "Login",
      signUp: "Sign Up",
      
      // Auth
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      welcomeBack: "Welcome Back",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      
      // Verification
      verifyIdentity: "Verify Your Identity",
      nidaNumber: "NIDA Number",
      nidaPlaceholder: "Enter your 20-digit NIDA number",
      verify: "Verify",
      alternativeVerification: "Don't have NIDA? Use alternative ID",
      verifyWith: "Verify with",
      tinNumber: "TIN Number",
      driverLicense: "Driver License",
      passport: "Passport",
      guardianConsent: "Guardian Consent",
      
      // Dashboard
      myApplications: "My Applications",
      trackApplications: "Track and manage all your service applications",
      total: "Total",
      approved: "Approved",
      pending: "Pending",
      declined: "Declined",
      escalated: "Escalated",
      inProgress: "In Progress",
      callToOffice: "Call to Office",
      searchPlaceholder: "Search by application ID or type...",
      noApplicationsFound: "No Applications Found",
      startApplying: "Start by applying for a service",
      browseServices: "Browse Services",
      viewDetails: "View Details",
      downloadCertificate: "Download Certificate",
      reapply: "Reapply",
      feePaid: "Fee Paid",
      lastUpdate: "Last Update",
      escalatedTo: "Escalated To",
      reason: "Reason",
      actionRequired: "Action Required",
      status: "Status",
      
      // Services
      applyNow: "Apply Now",
      backToServices: "Back to Services",
      submitApplication: "Submit Application",
      openCase: "Open Case",
      reportIncident: "Report Incident",
      
      // Common
      submit: "Submit",
      cancel: "Cancel",
      next: "Next",
      back: "Back",
      loading: "Loading...",
      success: "Success",
      error: "Error",
    }
  },
  sw: {
    translation: {
      // Navigation
      home: "Nyumbani",
      services: "Huduma",
      about: "Kuhusu",
      contact: "Wasiliana",
      infoCenter: "Kituo cha Habari",
      myDashboard: "Dashibodi Yangu",
      logout: "Toka",
      login: "Ingia",
      signUp: "Jisajili",
      
      // Auth
      email: "Barua Pepe",
      password: "Neno la Siri",
      fullName: "Jina Kamili",
      welcomeBack: "Karibu Tena",
      createAccount: "Fungua Akaunti",
      alreadyHaveAccount: "Una akaunti tayari?",
      dontHaveAccount: "Huna akaunti?",
      
      // Verification
      verifyIdentity: "Thibitisha Utambulisho Wako",
      nidaNumber: "Nambari ya NIDA",
      nidaPlaceholder: "Weka nambari yako ya NIDA yenye tarakimu 20",
      verify: "Thibitisha",
      alternativeVerification: "Huna NIDA? Tumia kitambulisho kingine",
      verifyWith: "Thibitisha kwa",
      tinNumber: "Nambari ya TIN",
      driverLicense: "Leseni ya Udereva",
      passport: "Pasipoti",
      guardianConsent: "Idhini ya Mlezi",
      
      // Dashboard
      myApplications: "Maombi Yangu",
      trackApplications: "Fuatilia na kusimamia maombi yako yote ya huduma",
      total: "Jumla",
      approved: "Imeidhinishwa",
      pending: "Inasubiri",
      declined: "Imekataliwa",
      escalated: "Imepelekwa",
      inProgress: "Inaendelea",
      callToOffice: "Piga Simu Ofisini",
      searchPlaceholder: "Tafuta kwa nambari ya maombi au aina...",
      noApplicationsFound: "Hakuna Maombi Yaliyopatikana",
      startApplying: "Anza kwa kuomba huduma",
      browseServices: "Angalia Huduma",
      viewDetails: "Angalia Maelezo",
      downloadCertificate: "Pakua Cheti",
      reapply: "Omba Tena",
      feePaid: "Ada Iliyolipwa",
      lastUpdate: "Sasisho la Mwisho",
      escalatedTo: "Imepelekwa kwa",
      reason: "Sababu",
      actionRequired: "Hatua Inahitajika",
      status: "Hali",
      
      // Services
      applyNow: "Omba Sasa",
      backToServices: "Rudi kwa Huduma",
      submitApplication: "Wasilisha Maombi",
      openCase: "Fungua Kesi",
      reportIncident: "Ripoti Tukio",
      
      // Common
      submit: "Wasilisha",
      cancel: "Ghairi",
      next: "Ifuatayo",
      back: "Rudi",
      loading: "Inapakia...",
      success: "Imefaulu",
      error: "Hitilafu",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
