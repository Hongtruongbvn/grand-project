// pages/ForgotPassword.tsx
import { useState } from "react";
// import { forgotPassword } from "../Api/auth";
import AuthFormWrapper from "../Components/AuthFormWrapper";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
    //   await forgotPassword(email);
      setMsg("Reset link sent to your email.");
    } catch (err: any) {
      setErr(err.message || "Request failed");
    }
  };

  return (
    <AuthFormWrapper title="Forgot Password?">
      <form onSubmit={handleSubmit} className="space-y-4">
        {err && <p className="text-red-500 text-sm">{err}</p>}
        {msg && <p className="text-green-600 text-sm">{msg}</p>}
        <input
          className="w-full border px-4 py-2 rounded"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">
          Send reset link
        </button>
      </form>
    </AuthFormWrapper>
  );
}
