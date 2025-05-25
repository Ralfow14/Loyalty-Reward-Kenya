
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Home, Users, CreditCard, BarChart3, Gift } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, userRole, signOut } = useAuth();

  const businessNavItems = [
    { icon: Home, label: 'Dashboard', href: '/business-dashboard' },
    { icon: Users, label: 'Customers', href: '/business-dashboard#customers' },
    { icon: CreditCard, label: 'Payments', href: '/business-dashboard#payments' },
    { icon: BarChart3, label: 'Analytics', href: '/business-dashboard#analytics' },
  ];

  const customerNavItems = [
    { icon: Home, label: 'Dashboard', href: '/customer-dashboard' },
    { icon: Gift, label: 'Rewards', href: '/customer-dashboard#rewards' },
    { icon: CreditCard, label: 'Transactions', href: '/customer-dashboard#transactions' },
  ];

  const navItems = userRole === 'business_owner' ? businessNavItems : customerNavItems;

  const handleLinkClick = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  if (!user) return null;

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Gift className="h-6 w-6 text-green-600" />
                <span className="font-bold text-lg">LoyaltyKenya</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href.includes('#') && location.pathname === item.href.split('#')[0]);
                
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            <div className="border-t pt-4 mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
