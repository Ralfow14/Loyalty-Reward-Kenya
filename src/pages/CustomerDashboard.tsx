
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, Trophy, Clock, Smartphone, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerDashboard = () => {
  // Mock data - in real app this would come from Supabase
  const customerData = {
    name: "John Doe",
    phone: "+254700000000",
    totalPoints: 87,
    pointsToReward: 13,
    totalVisits: 12,
    activeRewards: 1,
    recentTransactions: [
      { date: "2024-01-15", amount: 1500, points: 15, business: "Elegant Salon" },
      { date: "2024-01-10", amount: 800, points: 8, business: "Elegant Salon" },
      { date: "2024-01-05", amount: 1200, points: 12, business: "Elegant Salon" },
    ],
    rewards: [
      { id: 1, type: "10% Discount", business: "Elegant Salon", expiryDate: "2024-02-15", status: "active" }
    ]
  };

  const progressPercentage = (customerData.totalPoints / 100) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-6 w-6 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">LoyaltyKenya</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {customerData.name}</span>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Points Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Points</span>
                <Trophy className="h-6 w-6" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{customerData.totalPoints}</div>
              <p className="text-green-100">{customerData.pointsToReward} points to next reward</p>
              <Progress value={progressPercentage} className="mt-3 bg-green-400" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Total Visits</span>
                <Clock className="h-6 w-6 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{customerData.totalVisits}</div>
              <p className="text-gray-600">Across all businesses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Rewards</span>
                <Gift className="h-6 w-6 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{customerData.activeRewards}</div>
              <p className="text-gray-600">Ready to redeem</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Active Rewards */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
              <CardDescription>Available discounts and vouchers</CardDescription>
            </CardHeader>
            <CardContent>
              {customerData.rewards.length > 0 ? (
                <div className="space-y-4">
                  {customerData.rewards.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-100 text-purple-800">
                          {reward.type}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Active
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{reward.business}</h4>
                      <p className="text-sm text-gray-600">Expires: {reward.expiryDate}</p>
                      <Button size="sm" className="mt-3 w-full">
                        Redeem Now
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active rewards yet</p>
                  <p className="text-sm">Earn {customerData.pointsToReward} more points for your first reward!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest M-PESA payments and points earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerData.recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-full">
                        <Smartphone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{transaction.business}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KES {transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-green-600">+{transaction.points} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex-col">
                <Smartphone className="h-6 w-6 mb-2" />
                View QR Code
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Clock className="h-6 w-6 mb-2" />
                Transaction History
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Gift className="h-6 w-6 mb-2" />
                Find Businesses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDashboard;
