
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, CreditCard } from 'lucide-react';
import { useMpesa } from '@/hooks/useMpesa';
import { useBusiness } from '@/hooks/useBusiness';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    phone: '',
    amount: '',
    description: ''
  });
  const { business } = useBusiness();
  const { isLoading, initiatePayment } = useMpesa();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!business) {
      alert('Business information not found');
      return;
    }

    if (!formData.phone || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await initiatePayment({
        phone: formData.phone,
        amount: parseFloat(formData.amount),
        businessId: business.id,
        description: formData.description || `Payment to ${business.name}`
      });
      
      // Reset form on success
      setFormData({ phone: '', amount: '', description: '' });
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Accept M-PESA Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Customer Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+254700000000"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (KES)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="100"
              min="1"
              step="1"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Service description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Send M-PESA Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
