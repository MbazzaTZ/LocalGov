import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/* 🧭 TYPE DEFINITIONS                                                         */
/* -------------------------------------------------------------------------- */
interface LocationSelectorProps {
  onChange: (location: {
    region: string;
    district: string;
    ward: string;
  }) => void;
  defaultRegion?: string;
  defaultDistrict?: string;
  defaultWard?: string;
  compact?: boolean; // For mobile/responsive UIs
}

/* -------------------------------------------------------------------------- */
/* 🧠 COMPONENT                                                               */
/* -------------------------------------------------------------------------- */
const LocationSelector: React.FC<LocationSelectorProps> = ({
  onChange,
  defaultRegion = "",
  defaultDistrict = "",
  defaultWard = "",
  compact = false,
}) => {
  const [regions, setRegions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const [selectedRegion, setSelectedRegion] = useState(defaultRegion);
  const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
  const [selectedWard, setSelectedWard] = useState(defaultWard);

  const [loading, setLoading] = useState({
    regions: false,
    districts: false,
    wards: false,
  });

  /* -------------------------------------------------------------------------- */
  /* 🗺️ LOAD REGIONS FROM SUPABASE                                              */
  /* -------------------------------------------------------------------------- */
  const fetchRegions = async () => {
    setLoading((prev) => ({ ...prev, regions: true }));
    const { data, error } = await supabase.from("regions").select("*").order("name");

    if (error) {
      toast.error("Failed to load regions", { description: error.message });
    } else if (data) {
      setRegions(data);
      localStorage.setItem("cachedRegions", JSON.stringify(data));
    }
    setLoading((prev) => ({ ...prev, regions: false }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🏢 LOAD DISTRICTS BASED ON REGION                                          */
  /* -------------------------------------------------------------------------- */
  const fetchDistricts = async (regionName: string) => {
    if (!regionName) return;

    const region = regions.find((r) => r.name === regionName);
    if (!region) return;

    setLoading((prev) => ({ ...prev, districts: true }));
    const { data, error } = await supabase
      .from("districts")
      .select("*")
      .eq("region_id", region.id)
      .order("name");

    if (error) {
      toast.error("Failed to load districts", { description: error.message });
    } else if (data) {
      setDistricts(data);
      localStorage.setItem(`cachedDistricts_${region.id}`, JSON.stringify(data));
    }
    setLoading((prev) => ({ ...prev, districts: false }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🏘️ LOAD WARDS BASED ON DISTRICT                                           */
  /* -------------------------------------------------------------------------- */
  const fetchWards = async (districtName: string) => {
    if (!districtName) return;

    const district = districts.find((d) => d.name === districtName);
    if (!district) return;

    setLoading((prev) => ({ ...prev, wards: true }));
    const { data, error } = await supabase
      .from("wards")
      .select("*")
      .eq("district_id", district.id)
      .order("name");

    if (error) {
      toast.error("Failed to load wards", { description: error.message });
    } else if (data) {
      setWards(data);
      localStorage.setItem(`cachedWards_${district.id}`, JSON.stringify(data));
    }
    setLoading((prev) => ({ ...prev, wards: false }));
  };

  /* -------------------------------------------------------------------------- */
  /* 🔄 INITIAL LOAD (AND CACHED FALLBACKS)                                     */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const cachedRegions = localStorage.getItem("cachedRegions");
    if (cachedRegions) {
      setRegions(JSON.parse(cachedRegions));
    } else {
      fetchRegions();
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /* 🔁 AUTO UPDATE ON SELECTION CHANGE                                         */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    onChange({ region: selectedRegion, district: selectedDistrict, ward: selectedWard });
  }, [selectedRegion, selectedDistrict, selectedWard]);

  /* -------------------------------------------------------------------------- */
  /* 🧩 RENDER                                                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      className={`grid gap-3 ${
        compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-3"
      } transition-all`}
    >
      {/* 🌍 Region */}
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">
          Region
        </label>
        <select
          className="w-full p-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedDistrict("");
            setSelectedWard("");
            setDistricts([]);
            setWards([]);
            fetchDistricts(e.target.value);
          }}
        >
          <option value="">Select Region</option>
          {regions.map((r) => (
            <option key={r.id} value={r.name}>
              {r.name}
            </option>
          ))}
        </select>
        {loading.regions && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
      </div>

      {/* 🏢 District */}
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">
          District
        </label>
        <select
          className="w-full p-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
          value={selectedDistrict}
          onChange={(e) => {
            setSelectedDistrict(e.target.value);
            setSelectedWard("");
            setWards([]);
            fetchWards(e.target.value);
          }}
          disabled={!selectedRegion}
        >
          <option value="">Select District</option>
          {districts.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
        {loading.districts && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
      </div>

      {/* 🏘️ Ward */}
      <div>
        <label className="block text-sm font-medium mb-1 text-muted-foreground">Ward</label>
        <select
          className="w-full p-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary"
          value={selectedWard}
          onChange={(e) => setSelectedWard(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">Select Ward</option>
          {wards.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
        {loading.wards && <p className="text-xs text-muted-foreground mt-1">Loading...</p>}
      </div>
    </div>
  );
};

export default LocationSelector;
