
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Users, Gift, TrendingUp, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">LoyaltyKenya</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/business-login" className="text-gray-600 hover:text-blue-600">For Business</Link>
            <Link to="/customer-login" className="text-gray-600 hover:text-blue-600">For Customers</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link to="/customer-login">
              <Button variant="outline" size="sm">Customer Login</Button>
            </Link>
            <Link to="/business-login">
              <Button size="sm">Business Login</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
          🇰🇪 Built for Kenyan Businesses
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Boost Customer Loyalty with
          <span className="text-blue-600"> M-PESA Integration</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Automatically reward customers for every shilling spent. Perfect for barbershops, salons, 
          restaurants, and small businesses across Kenya.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/business-signup">
            <Button size="lg" className="w-full sm:w-auto">
              <Users className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
          </Link>
          <Link to="/demo">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Demo
            </Button>
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          No setup fees • Cancel anytime • 14-day free trial
        </p>
      </section>

      {/* Key Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Reward Loyal Customers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center border-2 hover:border-blue-200 transition-colors">
            <CardHeader>
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>M-PESA Auto-Sync</CardTitle>
              <CardDescription>
                Automatically award points when customers pay via M-PESA. No manual entry required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">1 KES = 1 Point</Badge>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-green-200 transition-colors">
            <CardHeader>
              <Gift className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Rewards</CardTitle>
              <CardDescription>
                Auto-generate 10% discount vouchers when customers reach 100 points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">100 Points = 10% Off</Badge>
            </CardContent>
          </Card>

          <Card className="text-center border-2 hover:border-purple-200 transition-colors">
            <CardHeader>
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>
                Instant SMS alerts when rewards are earned or redeemed via Twilio integration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Real-time Updates</Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple 3-Step Process
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register Customers</h3>
              <p className="text-gray-600">Add customers using their phone number and name. Track visit history.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accept M-PESA</h3>
              <p className="text-gray-600">Customer pays via M-PESA. Points automatically added to their account.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rewards Generated</h3>
              <p className="text-gray-600">Customer receives SMS when they earn rewards. Easy redemption process.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Types */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Perfect for Every Business Type
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Barbershops", icon: "✂️", description: "Track regular customers and haircut frequency" },
            { name: "Salons", icon: "💅", description: "Reward beauty services and treatments" },
            { name: "Restaurants", icon: "🍽️", description: "Encourage repeat dining and larger orders" },
            { name: "Retail Shops", icon: "🛍️", description: "Build customer loyalty for repeat purchases" }
          ].map((business, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-4xl mb-2">{business.icon}</div>
                <CardTitle className="text-lg">{business.name}</CardTitle>
                <CardDescription>{business.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Increase Customer Loyalty?</h2>
          <p className="text-xl mb-8 opacity-90">Join hundreds of Kenyan businesses already using LoyaltyKenya</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/business-signup">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Gift className="h-6 w-6" />
                <span className="text-xl font-bold">LoyaltyKenya</span>
              </div>
              <p className="text-gray-400">Empowering Kenyan businesses with smart loyalty solutions.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-white">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link to="/api-docs" className="hover:text-white">API Docs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LoyaltyKenya. Made with ❤️ for Kenyan businesses.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
