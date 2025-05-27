
// Main dashboard and registration page for LoyaltyPro Kenya

import NavBar from "@/components/NavBar";
import CustomerRegistration from "@/components/CustomerRegistration";
import DashboardCards from "@/components/DashboardCards";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-white pb-8">
      <NavBar />
      <main className="pt-20 max-w-4xl mx-auto px-2">
        <h1 className="text-4xl font-extrabold mb-2 text-cyan-800 text-center mt-2">
          Loyalty Reward Points System
        </h1>
        <p className="text-md text-gray-700 text-center max-w-xl mx-auto mb-6">
          Quickly register customers, award points for M-PESA payments, and generate rewards for Kenya's favorite local businesses.
        </p>
        <CustomerRegistration />
        <DashboardCards />
        <div className="text-center text-xs mt-8 text-gray-400 mb-2">
          &copy; {new Date().getFullYear()} LoyaltyPro Kenya &mdash; All Rights Reserved.
        </div>
      </main>
    </div>
  );
};

export default Index;
