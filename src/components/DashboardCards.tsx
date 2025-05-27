
import React from "react";
import { ArrowRight } from "lucide-react";

type Customer = {
  name: string;
  phone: string;
  visits: number;
  points: number;
  lastVisit: string;
  hasReward: boolean;
};

const mockCustomers: Customer[] = [
  {
    name: "Wanjiku Mwangi",
    phone: "+254712345678",
    visits: 12,
    points: 87,
    lastVisit: "2024-05-25",
    hasReward: false,
  },
  {
    name: "John Otieno",
    phone: "+254799876543",
    visits: 25,
    points: 110,
    lastVisit: "2024-05-24",
    hasReward: true,
  },
];

const DashboardCards: React.FC = () => {
  return (
    <section className="py-8 px-2" id="customers">
      <h2 className="text-2xl font-bold text-cyan-800 mb-4">Customer Loyalty Dashboard</h2>
      <div className="flex flex-col gap-6">
        {mockCustomers.map(cust => (
          <div
            key={cust.phone}
            className="bg-white rounded-xl shadow-lg px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-2xl transition group border border-cyan-50"
          >
            <div>
              <h3 className="text-xl font-semibold mb-1">{cust.name}</h3>
              <p className="text-gray-600 mb-1">Phone: <span className="font-mono">{cust.phone}</span></p>
              <p className="text-gray-500 text-sm">Visits: <span className="font-bold">{cust.visits}</span> &middot; Last: {cust.lastVisit}</p>
            </div>
            <div className="mt-3 md:mt-0 flex gap-4 items-center">
              <span className="text-lg font-bold text-cyan-700">{cust.points} pts</span>
              {cust.hasReward ? (
                <span className="px-3 py-1 bg-amber-400 text-white text-sm rounded-lg font-semibold flex items-center gap-1 animate-pulse shadow">
                  10% Reward <ArrowRight size={16} className="inline ml-1" />
                </span>
              ) : (
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-xl font-semibold">No reward yet</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DashboardCards;
