
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

function formatE164(phone: string): string | null {
  // Kenyan numbers: Ensure +254XXXXXXXXX, Accept 07XXXXXXXX or 254XXXXXXXXX
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) cleaned = "254" + cleaned.slice(1);
  if (cleaned.startsWith("7") && cleaned.length === 9) cleaned = "254" + cleaned;
  if (cleaned.length === 12 && cleaned.startsWith("254")) return "+" + cleaned;
  if (cleaned.length === 13 && cleaned.startsWith("254")) return "+" + cleaned;
  if (cleaned.startsWith("+254") && cleaned.length === 13) return cleaned;
  return null;
}

const CustomerRegistration: React.FC<{ onRegister?: (c: { phone: string, name: string }) => void }> = ({ onRegister }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [visits, setVisits] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const validPhone = formatE164(phone);
    if (!name.trim()) {
      toast({ title: "Enter the customer's full name" });
      return;
    }
    if (!validPhone) {
      toast({ title: "Invalid phone number. Use a valid Kenyan mobile phone." });
      return;
    }
    setLoading(true);
    // Simulate API call/DB save
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Customer Registered!",
        description: `Welcome, ${name}. Visit logged.`,
      });
      onRegister?.({ phone: validPhone, name });
      setName("");
      setPhone("");
      setVisits(1);
    }, 800);
  };

  return (
    <form onSubmit={handleRegister} className="bg-white rounded-xl shadow-md p-6 space-y-4 max-w-lg w-full mx-auto mt-4">
      <h2 className="text-lg font-semibold text-cyan-800 mb-2">Register Customer</h2>
      <div className="flex flex-col gap-3">
        <Input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="rounded-lg"
        />
        <Input
          type="tel"
          placeholder="Phone (e.g. 0712345678)"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
          className="rounded-lg"
        />
        <Input
          type="number"
          min={1}
          placeholder="Visits (default 1)"
          value={visits}
          onChange={e => setVisits(Number(e.target.value))}
          className="rounded-lg"
        />
        <Button
          type="submit"
          className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold rounded-lg py-2 mt-2"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register & Log Visit"}
        </Button>
      </div>
    </form>
  );
};

export default CustomerRegistration;
