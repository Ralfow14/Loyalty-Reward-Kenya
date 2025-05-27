
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Role = "business_owner" | "customer";

const AuthPage: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();

  // Session sync
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && session.user) {
      // Check user role and redirect accordingly (simplified)
      navigate("/");
    }
  }, [session, navigate]);

  // Email/password signup (business owner)
  async function handleOwnerSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast({ title: "Provide a valid email and password" });
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    if (error) {
      toast({ title: error.message });
      setLoading(false);
      return;
    }
    // Insert into user_profiles for role
    if (!data.user) {
      toast({ title: "Signup failed. Try checking your email for confirmation." });
      setLoading(false);
      return;
    }
    const { error: upError } = await supabase.from("user_profiles").insert([
      { id: data.user.id, role: "business_owner" },
    ]);
    if (upError) toast({ title: "Error linking role: " + upError.message });
    toast({
      title: "Signup successful. Please check your email to confirm.",
    });
    setLoading(false);
  }

  // Login (business owner)
  async function handleOwnerLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: error.message });
    setLoading(false);
  }

  // Customer: Request OTP & verify
  async function handleCustomerOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (!phone) {
      toast({ title: "Enter a valid phone number" });
      setLoading(false);
      return;
    }
    // Remove leading zero and always use E.164: +254XXXX...
    let formattedPhone = phone.trim();
    if (/^0\d{9}$/.test(formattedPhone)) formattedPhone = "+254" + formattedPhone.substring(1);
    if (/^7\d{8}$/.test(formattedPhone)) formattedPhone = "+254" + formattedPhone;
    if (!formattedPhone.startsWith("+254")) {
      toast({ title: "Phone must start with +254." });
      setLoading(false);
      return;
    }
    // Supabase OTP (requires phone auth enabled in Supabase Dashboard)
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    if (error) toast({ title: error.message });
    else toast({ title: "OTP sent to your phone." });
    setLoading(false);
  }

  async function handleCustomerVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    let formattedPhone = phone;
    if (/^0\d{9}$/.test(formattedPhone)) formattedPhone = "+254" + formattedPhone.substring(1);
    if (/^7\d{8}$/.test(formattedPhone)) formattedPhone = "+254" + formattedPhone;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: "sms",
    });
    if (error) {
      toast({ title: error.message });
      setLoading(false);
      return;
    }
    // Insert into user_profiles for role
    if (!data.user) {
      toast({ title: "OTP verification failed." });
      setLoading(false);
      return;
    }
    await supabase.from("user_profiles").upsert([
      { id: data.user.id, role: "customer" },
    ]);
    // Optionally prefill full name
    setLoading(false);
    toast({ title: "Login successful!" });
  }

  if (!role)
    return (
      <main className="min-h-screen flex justify-center items-center bg-cyan-50">
        <div className="bg-white p-8 rounded-xl shadow space-y-6 w-full max-w-sm">
          <h2 className="text-2xl font-bold text-cyan-700 mb-2">Choose your role</h2>
          <Button className="w-full" onClick={() => setRole("business_owner")}>
            I am a Business Owner
          </Button>
          <Button className="w-full" onClick={() => setRole("customer")}>
            I am a Customer
          </Button>
        </div>
      </main>
    );

  if (role === "business_owner")
    return (
      <main className="min-h-screen flex justify-center items-center bg-cyan-50">
        <form
          onSubmit={handleOwnerSignup}
          className="bg-white p-8 rounded-xl shadow space-y-5 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold text-cyan-700 mb-2">Business Owner Signup</h2>
          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm mt-4 text-cyan-700 cursor-pointer" onClick={() => setRole(null)}>
            ← Go back
          </div>
        </form>
        <form
          onSubmit={handleOwnerLogin}
          className="ml-6 bg-white p-8 rounded-xl shadow space-y-5 w-full max-w-sm"
        >
          <h2 className="text-xl font-bold text-cyan-700 mb-2">Or Login</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </main>
    );

  // Customer
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-cyan-50">
      <form
        onSubmit={handleCustomerOtp}
        className="bg-white p-8 rounded-xl shadow space-y-5 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-cyan-700 mb-2">Customer Login via Phone</h2>
        <Input
          type="tel"
          placeholder="Phone (e.g. 0712345678)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>
      <form
        onSubmit={handleCustomerVerifyOtp}
        className="mt-4 bg-white p-8 rounded-xl shadow space-y-5 w-full max-w-sm"
      >
        <h2 className="text-xl font-bold text-cyan-700 mb-2">Enter OTP</h2>
        <Input
          type="text"
          placeholder="OTP Code"
          value={otp}
          onChange={e => setOtp(e.target.value)}
        />
        <Button
          type="submit"
          className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify & Login"}
        </Button>
        <div className="text-center text-sm mt-4 text-cyan-700 cursor-pointer" onClick={() => setRole(null)}>
          ← Go back
        </div>
      </form>
    </main>
  );
};

export default AuthPage;
