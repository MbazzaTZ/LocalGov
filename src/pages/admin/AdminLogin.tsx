import React, { useState } from "react";
import { useAdminAuth } from "@/contexts/admin-AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Welcome Admin!", { description: "Redirecting to dashboard..." });
    } catch (err: any) {
      toast.error("Login failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-700 text-white">
      <div className="bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Administrator Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 transition-all text-white py-3 rounded-xl font-semibold flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
