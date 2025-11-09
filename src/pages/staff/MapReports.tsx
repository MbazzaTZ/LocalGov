import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapReports() {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("staff_reports").select("*").then(({ data }) => setReports(data || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-cyan-700 p-4 text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">🗺️ Field Reports Map</h1>

      <MapContainer
        center={[-6.8, 39.28]} // Default: Dar es Salaam
        zoom={12}
        style={{ height: "80vh", borderRadius: "12px" }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((r) => (
          <Marker key={r.id} position={[r.latitude, r.longitude]}>
            <Popup>
              <strong>{r.report_type}</strong>
              <p>{r.report_details}</p>
              {r.photo_url && <img src={r.photo_url} alt="report" className="w-40 rounded" />}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
