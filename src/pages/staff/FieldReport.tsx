import React, { useState } from "react";
import { useStaffAuth } from "@/contexts/staff-AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

export default function FieldReport() {
  const { profile } = useStaffAuth();
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [form, setForm] = useState({ report_type: "", report_details: "" });
  const [photo, setPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const handleSubmit = async () => {
    if (!form.report_type) return toast.error("Select report type first");
    setUploading(true);

    let photoUrl = null;
    if (photo) {
      const filename = `${profile?.id}-${Date.now()}.jpg`;
      const { data: fileData, error: fileError } = await supabase.storage
        .from("staff-reports")
        .upload(filename, photo);
      if (fileError) return toast.error(fileError.message);
      photoUrl = supabase.storage.from("staff-reports").getPublicUrl(filename).data.publicUrl;
    }

    const { error } = await supabase.from("staff_reports").insert([
      {
        staff_id: profile?.id,
        full_name: profile?.full_name,
        district: profile?.district,
        ward: profile?.ward,
        report_type: form.report_type,
        report_details: form.report_details,
        latitude: location.lat,
        longitude: location.lon,
        photo_url: photoUrl,
        synced: navigator.onLine,
      },
    ]);

    if (error) {
      toast.error("Report submission failed (offline cache saved)");
      localStorage.setItem("offlineReports", JSON.stringify([{ ...form, photoUrl, location }]));
    } else {
      toast.success("Report submitted successfully!");
    }

    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-cyan-700 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📋 Field Report</h1>

      <div className="bg-white/10 p-6 rounded-2xl space-y-4">
        <select
          className="w-full p-2 rounded bg-white/20 text-white"
          value={form.report_type}
          onChange={(e) => setForm((f) => ({ ...f, report_type: e.target.value }))}
        >
          <option value="">Select Report Type</option>
          <option value="Inspection">Inspection</option>
          <option value="Verification">Verification</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <textarea
          className="w-full p-2 rounded bg-white/20 text-white"
          rows={4}
          placeholder="Report details..."
          value={form.report_details}
          onChange={(e) => setForm((f) => ({ ...f, report_details: e.target.value }))}
        />

        <div>
          <label>Upload Photo:</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </div>

        <button onClick={getLocation} className="bg-blue-600 px-4 py-2 rounded-lg">
          Get My Location
        </button>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="bg-green-600 px-4 py-2 rounded-lg ml-2"
        >
          {uploading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );
}
