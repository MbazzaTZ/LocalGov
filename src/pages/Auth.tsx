import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/utils/supabaseClient";

const Auth: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nida, setNida] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Sign Up with Auto-Verify + Auto-Redirect to Dashboard
  const signUpEmail = async () => {
    if (!email || !password) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create account without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: null,
          data: { nida_id: nida, phone },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setIsLogin(true);
          setMessage("⚠️ User already exists. Please log in.");
        } else {
          setMessage(`❌ ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // Step 2: Auto-login user immediately
      if (data?.user) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          setMessage(`⚠️ Account created but login failed: ${loginError.message}`);
        } else {
          setMessage("✅ Welcome! You’re logged in.");
          // Step 3: Redirect to Dashboard after short delay
          setTimeout(() => navigate("/dashboard"), 800);
        }
      }
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Sign In with Auto-Redirect
  const signInEmail = async () => {
    if (!email || !password) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      setMessage(`❌ ${error.message}`);
      return;
    }

    setMessage("✅ Welcome back! You’re logged in.");
    setTimeout(() => navigate("/dashboard"), 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-white p-6">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          {isLogin ? "Log In" : "Sign Up"}
        </h1>

        <>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Phone Number (e.g., 255712345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="NIDA/National ID (Optional)"
                value={nida}
                onChange={(e) => setNida(e.target.value)}
                className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </>
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full mb-4 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          {/* Action Buttons */}
          {!isLogin ? (
            <>
              <button
                onClick={signUpEmail}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 text-white w-full py-3 rounded-lg font-semibold transition duration-150"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
              <p
                className="text-sm text-center text-gray-600 mt-4 cursor-pointer hover:underline"
                onClick={() => {
                  setIsLogin(true);
                  setMessage("");
                }}
              >
                Already have an account? Log in
              </p>
            </>
          ) : (
            <>
              <button
                onClick={signInEmail}
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 text-white w-full py-3 rounded-lg font-semibold transition duration-150"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
              <p
                className="text-sm text-center text-gray-600 mt-4 cursor-pointer hover:underline"
                onClick={() => {
                  setIsLogin(false);
                  setMessage("");
                }}
              >
                Don’t have an account? Sign up
              </p>
            </>
          )}
        </>

        {message && (
          <p
            className={`text-center text-sm mt-4 p-2 rounded ${
              message.includes("✅")
                ? "bg-green-100 text-green-800"
                : message.includes("⚠️")
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
