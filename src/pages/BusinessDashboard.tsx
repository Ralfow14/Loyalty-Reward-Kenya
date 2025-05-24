
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Gift, 
  Search, 
  UserPlus, 
  Phone, 
  User, 
  LogOut,
  BarChart3,
  Settings
} from "lucide-react";

const BusinessDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock data - in real app this would come from Supabase
  const businessData = {
    businessName: "Elegant Salon",
    totalCustomers: 156,
    totalPointsIssued: 12430,
    activeRewards: 23,
    monthlyRevenue: 145000,
    customers: [
      { id: 1, name: "John Doe", phone: "+254700000000", points: 87, visits: 12, lastVisit: "2024-01-15" },
      { id: 2, name: "Jane Smith", phone: "+254700000001", points: 156, visits: 8, lastVisit: "2024-01-14" },
      { id: 3, name: "Peter Kimani", phone: "+254700000002", points: 43, visits: 5, lastVisit: "2024-01-13" },
      { id: 4, name: "Mary Wanjiku", phone: "+254700000003", points: 201, visits: 15, lastVisit: "2024-01-12" },
    ],
    recentTransactions: [
      { customer: "John Doe", amount: 1500, points: 15, timestamp: "2024-01-15 14:30" },
      { customer: "Jane Smith", amount: 2200, points: 22, timestamp: "2024-01-15 12:15" },
      { customer: "Peter Kimani", amount: 800, points: 8, timestamp: "2024-01-15 10:45" },
    ]
  };

  const filteredCustomers = businessData.customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{businessData.businessName}</h1>
              <p className="text-sm text-gray-600">Business Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Total Customers</span>
                <Users className="h-5 w-5 text-blue-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{businessData.totalCustomers}</div>
              <p className="text-sm text-gray-600">+12 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Points Issued</span>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{businessData.totalPointsIssued.toLocaleString()}</div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Active Rewards</span>
                <Gift className="h-5 w-5 text-purple-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{businessData.activeRewards}</div>
              <p className="text-sm text-gray-600">Ready to redeem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Revenue</span>
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">KES {businessData.monthlyRevenue.toLocaleString()}</div>
              <p className="text-sm text-gray-600">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="customers">Customer Management</TabsTrigger>
            <TabsTrigger value="register">Register New Customer</TabsTrigger>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Directory</CardTitle>
                <CardDescription>Search and manage your loyalty customers</CardDescription>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{customer.name}</h4>
                            <p className="text-sm text-gray-600">{customer.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{customer.points}</p>
                            <p className="text-xs text-gray-600">Points</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold">{customer.visits}</p>
                            <p className="text-xs text-gray-600">Visits</p>
                          </div>
                          <Badge variant={customer.points >= 100 ? "default" : "secondary"}>
                            {customer.points >= 100 ? "Reward Available" : "Active"}
                          </Badge>
                          <Button size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register New Customer</CardTitle>
                <CardDescription>Add a new customer to your loyalty program</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="customerName" 
                        placeholder="Full Name"
                        className="pl-10"
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        id="customerPhone" 
                        placeholder="+254700000000"
                        className="pl-10"
                        required 
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      This should match their M-PESA number for automatic point tracking
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register Customer
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest M-PESA payments and points awarded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessData.recentTransactions.map((transaction, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{transaction.customer}</h4>
                          <p className="text-sm text-gray-600">{transaction.timestamp}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {transaction.amount.toLocaleString()}</p>
                          <p className="text-sm text-green-600">+{transaction.points} points awarded</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
