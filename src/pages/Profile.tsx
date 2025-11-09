import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Edit3,
  Save,
  XCircle,
  Upload,
  Loader2,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const { user, profile, isVerified, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(profile?.photoURL || "");
  
  // Use profile data as initial form state
  const [formData, setFormData] = useState({
    name: profile?.fullName || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    nida: profile?.nida || "",
  });

  // Keep original NIDA for comparison/display
  const originalNida = profile?.nida;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    if (isVerified && formData.nida !== originalNida) {
      toast.error("NIDA/National ID cannot be changed once verified.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          fullName: formData.name, // Map 'name' state to 'fullName' column
          phone: formData.phone,
          // NIDA is only updated if not yet verified
          nida: isVerified ? originalNida : formData.nida, 
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
      
      // Update the context state immediately
      await refreshProfile(); 
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for photo upload (needs Supabase Storage implementation)
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    toast.info("Uploading photo... (Functionality not fully implemented)");
    
    // Simulate successful upload and update URL
    setTimeout(() => {
        const mockURL = `https://picsum.photos/seed/${Math.random()}/100/100`;
        setPhotoURL(mockURL);
        setUploading(false);
        toast.success("Photo uploaded!");
    }, 1500); 
  };

  // Revert changes and exit editing mode
  const handleCancel = () => {
    setFormData({
      name: profile?.fullName || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phone || "",
      nida: profile?.nida || "",
    });
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Button
          variant="link"
          className="text-muted-foreground mb-6 flex items-center gap-1 p-0"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>

        <Card className="glass-card border-border/50 p-6 shadow-xl">
          <div className="flex justify-between items-start mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <Badge
              variant={isVerified ? "success" : "destructive"}
              className={`text-sm ${isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} font-semibold border`}
            >
              {isVerified ? (
                <ShieldCheck className="w-4 h-4 mr-1" />
              ) : (
                <ShieldAlert className="w-4 h-4 mr-1" />
              )}
              {isVerified ? "ID Verified" : "Unverified"}
            </Badge>
          </div>

          {/* Photo and Upload Section */}
          <div className="flex items-center gap-6 mb-8">
            <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-primary/50">
              {photoURL ? (
                <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            {editing && (
              <div className="flex items-center gap-3">
                <Input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <Button
                  onClick={() => document.getElementById("profile-photo")?.click()}
                  disabled={uploading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Change Photo"}
                </Button>
                {photoURL && (
                    <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => setPhotoURL('')}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
              </div>
            )}
          </div>


          <div className="space-y-4">
            {/* Full Name */}
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  readOnly={!editing}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  readOnly
                  disabled
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-4">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <Input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  readOnly={!editing}
                  className="mt-1"
                />
              </div>
            </div>

            {/* NIDA / National ID */}
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">NIDA/National ID</label>
                <Input
                  type="text"
                  name="nida"
                  value={formData.nida}
                  onChange={handleChange}
                  // IMMUTABILITY FIX: Read-only if already verified
                  readOnly={isVerified} 
                  disabled={isVerified && !editing}
                  className={`mt-1 ${isVerified ? 'bg-green-50/50 cursor-not-allowed' : ''}`}
                />
                {isVerified && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3"/> This ID has been verified and cannot be changed.
                    </p>
                )}
                {!isVerified && !editing && (
                    <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 h-auto text-primary text-xs mt-1"
                        onClick={() => navigate("/verify")}
                    >
                        Click here to verify your NIDA/National ID.
                    </Button>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
            {editing ? (
              <>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-gray-600"
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4" /> Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-primary text-white flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </Button>
            )}
          </div>
        </Card>

        <div className="max-w-3xl mx-auto mt-8">
          <Card className="glass-card border-border/50 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Account Information
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              <strong>Account Created:</strong>{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Account ID:</strong> {user?.id || "N/A"}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};


export default Profile;
