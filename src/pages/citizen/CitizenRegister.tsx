import React, { useState } from "react";
import { useCitizenAuth } from "@/contexts/citizen-AuthContext";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const CitizenRegister = () => {
  const { signUp } = useCitizenAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      toast.success("Registration successful", {
        description: "Redirecting to login...",
      });
      setTimeout(() => (window.location.href = "/login"), 1500);
    } catch (err: any) {
      toast.error("Registration failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-700 to-cyan-500 text-white">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-semibold text-center mb-6">Citizen Registration</h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full p-3 rounded-xl bg-white/20 focus:outline-none text-white placeholder:text-white/70"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition-all text-white py-3 rounded-xl font-semibold flex items-center justify-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-300 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CitizenRegister;
