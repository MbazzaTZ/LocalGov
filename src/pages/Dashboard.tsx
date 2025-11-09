import React, { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [nida, setNida] = useState("");
  // ❌ REMOVED: [otp, setOtp] & [otpSent, setOtpSent] - since we are using email auth flow
  const [isLogin, setIsLogin] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Email Sign-Up
  const signUpEmail = async () => {
    if (!email || !password) {
      setMessage("⚠️ Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // This link points to the verification page
        emailRedirectTo: "http://localhost:5173/verify", 
        data: { nida_id: nida }, // Store NIDA ID as part of user metadata
      },
    });
    setLoading(false);

    // ⚠️ Handle existing user case
    if (error) {
      if (error.message.toLowerCase().includes("already registered")) {
        alert("⚠️ User already registered, please log in instead.");
        setIsLogin(true);
        setMessage("User already exists. Please log in.");
      } else {
        setMessage(`❌ ${error.message}`);
      }
      return;
    }

    if (data?.user) {
      setMessage(`✅ Success! Please check your email (${email}) to confirm your account and proceed to NIDA verification.`);
      // Note: User must click the email link, which redirects them to /verify
    }
  };

  // ✅ Email Sign-In
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
    // On successful login, the AuthContext listener will redirect to dashboard
  };

  // ❌ REMOVED: verifyOtp function

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">
          {isLogin ? "Log In" : "Sign Up"}
        </h1>

        {/* 💡 SIMPLIFIED: Only show the form until the user is signed in */}
        {/* We rely on the AuthContext redirect after successful login/signup confirmation */}
        <>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Sign Up Fields */}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Phone Number (e.g., 255712345678)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="NIDA/National ID (Optional)"
                value={nida}
                onChange={(e) => setNida(e.target.value)}
                className="border p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-semibold transition duration-150"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <p
                className="text-sm text-center text-gray-600 mt-4 cursor-pointer hover:underline"
                onClick={() => {
                    setIsLogin(true);
                    setMessage('');
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
                    setMessage('');
                }}
              >
                Don’t have an account? Sign up
              </p>
            </>
          )}
        </>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4 bg-gray-50 p-2 rounded">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Auth;