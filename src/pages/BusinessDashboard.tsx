
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, CreditCard, Gift, TrendingUp, Plus, LogOut } from 'lucide-react';
import { useBusiness } from '@/hooks/useBusiness';
import { useCustomers } from '@/hooks/useCustomers';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentForm from '@/components/PaymentForm';
import TransactionTable from '@/components/TransactionTable';
import MobileNavigation from '@/components/mobile/MobileNavigation';
import { useNavigate } from 'react-router-dom';

const BusinessDashboard = () => {
  const { business, isLoading: businessLoading } = useBusiness();
  const { customers, isLoading: customersLoading } = useCustomers();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Set up realtime subscriptions
  useRealtime();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (businessLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Business Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              No business profile found. Please contact support.
            </p>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats
  const totalCustomers = customers.length;
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalPointsAwarded = transactions.reduce((sum, t) => sum + t.points_awarded, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <MobileNavigation />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {business.name}
                </h1>
                <p className="text-sm text-gray-500">Business Dashboard</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Mobile tabs */}
          <div className="md:hidden">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop tabs */}
          <div className="hidden md:block">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Accept Payments</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    Registered customers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">KES {totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {totalTransactions} transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Points Awarded</CardTitle>
                  <Gift className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPointsAwarded.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Total points given
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    KES {totalTransactions > 0 ? Math.round(totalRevenue / totalTransactions) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Average amount
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionTable 
                transactions={transactions.slice(0, 5)} 
                isLoading={transactionsLoading}
                showCustomer={true}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => setActiveTab('payments')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Accept New Payment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('customers')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View All Customers
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PaymentForm />
              <TransactionTable 
                transactions={transactions.slice(0, 10)} 
                isLoading={transactionsLoading}
                showCustomer={true}
              />
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer List</CardTitle>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : customers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No customers found. Start accepting payments to build your customer base!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map((customer) => (
                      <Card key={customer.id} className="relative">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.phone}</div>
                            {customer.email && (
                              <div className="text-sm text-gray-500">{customer.email}</div>
                            )}
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary">
                                {customer.available_points} pts available
                              </Badge>
                              <Badge variant="outline">
                                {customer.total_visits} visits
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Points per Shilling</label>
                    <p className="text-2xl font-bold">{business.points_per_shilling}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reward Threshold</label>
                    <p className="text-2xl font-bold">{business.reward_threshold} points</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Reward Value</label>
                    <p className="text-2xl font-bold">KES {business.reward_value}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Customer Retention</label>
                    <p className="text-2xl font-bold">
                      {customers.filter(c => c.total_visits > 1).length} / {totalCustomers}
                    </p>
                    <p className="text-sm text-gray-500">Repeat customers</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Average Points per Customer</label>
                    <p className="text-2xl font-bold">
                      {totalCustomers > 0 ? Math.round(totalPointsAwarded / totalCustomers) : 0}
                    </p>
                    <p className="text-sm text-gray-500">Points per customer</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;
