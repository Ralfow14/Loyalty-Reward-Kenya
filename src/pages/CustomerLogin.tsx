
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Gift, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'details'>('phone');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Check if customer exists in Supabase
    setTimeout(() => {
      setIsLoading(false);
      setStep('details'); // For demo, assume customer needs to complete registration
    }, 1500);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Complete customer registration in Supabase
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700">
            <Gift className="h-8 w-8" />
            <span className="text-2xl font-bold">LoyaltyKenya</span>
          </Link>
          <p className="text-gray-600 mt-2">Customer Portal</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Customer Access</CardTitle>
            <CardDescription>
              View your loyalty points and rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phone" 
                      type="tel"
                      placeholder="+254700000000"
                      className="pl-10"
                      required 
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter the phone number you use for M-PESA payments
                  </p>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Checking..." : "Continue"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">
                    Complete your profile to access your loyalty account
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="fullName" 
                      placeholder="Your Full Name"
                      className="pl-10"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneConfirm">Phone Number (Confirmed)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="phoneConfirm" 
                      value="+254700000000"
                      disabled
                      className="pl-10 bg-gray-50"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Complete Registration"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setStep('phone')}
                >
                  Use Different Number
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link to="/business-login" className="text-sm text-green-600 hover:underline">
                Are you a business owner? Login here
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
