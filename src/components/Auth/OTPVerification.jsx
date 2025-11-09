import React, { useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

const OTPVerification = ({ phone, onSuccess }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const verifyOTP = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    setLoading(false);
    if (error) setError(error.message);
    else onSuccess();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-3 text-center">Enter OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit code"
        className="border p-2 w-full mb-4 rounded"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={verifyOTP}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
    </div>
  );
};

export default OTPVerification;
