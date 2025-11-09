import React, { useState, useEffect } from "react";
import { useStaffAuth } from "@/contexts/staff-AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function StaffProfile() {
  const { profile } = useStaffAuth();
  const [formData, setFormData] = useState(profile || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p: any) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: formData.full_name,
        phone: formData.phone,
        ward: formData.ward,
        district: formData.district,
        address: formData.address,
      })
      .eq("id", profile?.id);

    if (error) toast.error("Failed to update profile");
    else toast.success("Profile updated successfully");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-700 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="bg-white/10 p-6 rounded-2xl shadow-lg space-y-4">
        {["full_name", "phone", "district", "ward", "address"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-semibold capitalize">{field.replace("_", " ")}</label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field] || ""}
              onChange={handleChange}
              className="w-full p-2 rounded bg-white/20 text-white outline-none focus:ring focus:ring-cyan-300"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mt-4"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
