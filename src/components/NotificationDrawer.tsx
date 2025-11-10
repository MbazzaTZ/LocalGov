import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { X, Bell, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  role: string;
  created_at: string;
  read?: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  role?: string;
}

const NotificationDrawer: React.FC<Props> = ({ open, onClose, role }) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ✅ Fetch initial notifications
  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data);
    }
    setLoading(false);
  };

  // ✅ Subscribe to real-time changes
  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel("realtime:notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotification = payload.new as Notification;
          if (!role || newNotification.role === role || newNotification.role === "All") {
            setNotifications((prev) => [newNotification, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [role]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl transform transition-transform duration-300 z-50 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10 text-white">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-yellow-300" />
          </div>
        ) : notifications.length === 0 ? (
          <p className="text-center text-white/60 py-6">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 mb-3 rounded-lg border ${
                n.role === "Admin"
                  ? "border-red-400/40 bg-red-400/10"
                  : n.role === "Staff"
                  ? "border-blue-400/40 bg-blue-400/10"
                  : "border-green-400/40 bg-green-400/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {n.role === "Admin" ? (
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                )}
                <h4 className="font-semibold">{n.title}</h4>
              </div>
              <p className="text-sm text-white/80">{n.message}</p>
              <p className="text-xs text-white/50 mt-1">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDrawer;
