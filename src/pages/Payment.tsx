import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, QrCode, MapPin, Edit } from 'lucide-react';
import { API_BASE } from '@/lib/backend';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);

  // Card payment state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');

  // UPI payment state
  const [upiId, setUpiId] = useState('');
  const [showQR, setShowQR] = useState(false);

  const [vehicle, setVehicle] = useState<any>(null);

  useEffect(() => {
    const savedVehicle = localStorage.getItem('selected_vehicle');
    const savedDelivery = localStorage.getItem('delivery_details');
    
    if (!savedVehicle || !savedDelivery) {
      navigate('/booking');
      return;
    }
    
    setVehicle(JSON.parse(savedVehicle));
    setDeliveryDetails(JSON.parse(savedDelivery));
  }, [navigate]);

  if (!vehicle || !deliveryDetails) {
    return null;
  }

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardName || !cardNumber || !expiry || !cvv || !billingAddress) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all card details.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prepare address in single string
      const fullAddress = `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state} - ${deliveryDetails.pincode}`;

      // Create order in backend
      const orderPayload = {
        vehicleName: vehicle.name,
        username: user?.username || 'guest',
        address: fullAddress,
        mobileNumber: deliveryDetails.mobile,
        paymentAmount: vehicle.price + 500,
        paymentStatus: 'COMPLETED',
        paymentMethod: 'Card Payment',
        startDate: deliveryDetails.startDate,
        endDate: deliveryDetails.endDate,
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const orderData = await response.json();
        
        // Notify other pages
        window.dispatchEvent(new CustomEvent('travelease:ordersUpdated', { detail: orderData }));
        
        // Navigate to success page
        navigate('/payment-success', { state: { order: orderData } });
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUPIPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upiId && !showQR) {
      toast({
        title: 'Validation Error',
        description: 'Please enter UPI ID or scan QR code.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Prepare address in single string
      const fullAddress = `${deliveryDetails.address}, ${deliveryDetails.city}, ${deliveryDetails.state} - ${deliveryDetails.pincode}`;

      // Create order in backend
      const orderPayload = {
        vehicleName: vehicle.name,
        username: user?.username || 'guest',
        address: fullAddress,
        mobileNumber: deliveryDetails.mobile,
        paymentAmount: vehicle.price + 500,
        paymentStatus: 'COMPLETED',
        paymentMethod: showQR ? 'UPI QR Code' : `UPI - ${upiId}`,
        startDate: deliveryDetails.startDate,
        endDate: deliveryDetails.endDate,
      };

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const orderData = await response.json();
        
        // Notify other pages
        window.dispatchEvent(new CustomEvent('travelease:ordersUpdated', { detail: orderData }));
        
        // Navigate to success page
        navigate('/payment-success', { state: { order: orderData } });
      } else {
        const errorText = await response.text();
        console.error('Backend error:', response.status, errorText);
        throw new Error(`Failed to create order: ${response.status}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to process payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Complete Payment</h1>
          <p className="text-muted-foreground">Choose your preferred payment method</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Order Summary */}
          <Card className="p-6 lg:col-span-1 h-fit space-y-4">
            <h2 className="text-xl font-bold">Order Summary</h2>
            <div className="space-y-3">
              <div className="aspect-video rounded-lg overflow-hidden">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                <p className="text-sm text-muted-foreground">{vehicle.type}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Base Price</span>
                  <span>₹{vehicle.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Service Fee</span>
                  <span>₹500</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{vehicle.price + 500}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Delivery Address
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/delivery-details')}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Modify
                </Button>
              </div>
              <div className="text-sm space-y-1 bg-muted/30 p-3 rounded-lg">
                <p className="font-semibold">{deliveryDetails.name}</p>
                <p className="text-muted-foreground">{deliveryDetails.mobile}</p>
                <p className="text-muted-foreground">{deliveryDetails.address}</p>
                <p className="text-muted-foreground">
                  {deliveryDetails.city}, {deliveryDetails.state} - {deliveryDetails.pincode}
                </p>
                {deliveryDetails.startDate && deliveryDetails.endDate && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Rental Period</p>
                    <p className="font-semibold">
                      {new Date(deliveryDetails.startDate).toLocaleDateString('en-IN')} — {new Date(deliveryDetails.endDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Payment Methods */}
          <Card className="p-6 lg:col-span-2">
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'card' | 'upi')}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Card Payment</span>
                  <span className="sm:hidden">Card</span>
                </TabsTrigger>
                <TabsTrigger value="upi" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">UPI Payment</span>
                  <span className="sm:hidden">UPI</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="card">
                <form onSubmit={handleCardPayment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      autoComplete="cc-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        autoComplete="cc-exp"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="password"
                        autoComplete="cc-csc"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Billing Address</Label>
                    <Input
                      id="billingAddress"
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="123 Main St, City, State, ZIP"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay ₹${vehicle.price + 500}`}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="upi">
                <form onSubmit={handleUPIPayment} className="space-y-6">
                  {!showQR ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="upiId">UPI ID</Label>
                        <Input
                          id="upiId"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="username@upi"
                          required={!showQR}
                        />
                      </div>

                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-4">OR</div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowQR(true)}
                          className="w-full"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Scan QR Code Instead
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-4">Scan this QR code with any UPI app</p>
                          <div className="bg-muted p-6 rounded-lg inline-block">
                            <div className="w-48 h-48 bg-white flex items-center justify-center">
                              <div className="text-center text-xs text-muted-foreground">
                                [QR Code Placeholder]<br/>
                                Amount: ₹{vehicle.price + 500}
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowQR(false)}
                          className="w-full"
                        >
                          Enter UPI ID Instead
                        </Button>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero hover:opacity-90"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : `Pay ₹${vehicle.price + 500}`}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Payment;
