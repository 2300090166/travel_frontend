import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MapPin, ArrowRight } from 'lucide-react';

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const vehicle = localStorage.getItem('selected_vehicle');
    if (!vehicle) {
      navigate('/booking');
      return;
    }
    setSelectedVehicle(JSON.parse(vehicle));

    // Check if coming from payment page (has delivery_details) or fresh booking (no delivery_details)
    const savedDetails = localStorage.getItem('delivery_details');
    if (savedDetails) {
      // User navigated back from payment, keep their data
      const saved = JSON.parse(savedDetails);
      setFormData({
        name: saved.name || '',
        mobile: saved.mobile || '',
        address: saved.address || '',
        city: saved.city || '',
        state: saved.state || '',
        pincode: saved.pincode || '',
      });
      setStartDate(saved.startDate || '');
      setEndDate(saved.endDate || '');
      setAcceptedTerms(saved.acceptedTerms || false);
    } else {
      // Fresh booking - fetch user profile if user is logged in
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        fetchUserProfile(userData.username);
      }
    }
  }, [navigate]);

  const fetchUserProfile = async (username: string) => {
    try {
      const response = await fetch(`http://localhost:9097/api/user-profile/${username}`);
      if (response.ok) {
        const profile = await response.json();
        setFormData({
          name: profile.fullName || '',
          mobile: profile.mobileNumber || '',
          address: profile.address || '',
          city: profile.city || '',
          state: profile.state || '',
          pincode: profile.pincode || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const saveUserProfile = async () => {
    const user = localStorage.getItem('user');
    if (!user) return;

    const userData = JSON.parse(user);
    try {
      await fetch('http://localhost:9097/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          fullName: formData.name,
          mobileNumber: formData.mobile,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        }),
      });
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid 10-digit mobile number.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid 6-digit pincode.',
        variant: 'destructive',
      });
      return;
    }

    // validate dates and terms
    if (!startDate || !endDate) {
      toast({
        title: 'Date Required',
        description: 'Please select start and end dates for the booking.',
        variant: 'destructive',
      });
      return;
    }
    const s = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(end.getTime()) || s > end) {
      toast({
        title: 'Invalid Dates',
        description: 'Please ensure start date is before or equal to end date.',
        variant: 'destructive',
      });
      return;
    }
    if (!acceptedTerms) {
      toast({
        title: 'Terms Required',
        description: 'You must accept the terms and conditions to proceed to payment.',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('delivery_details', JSON.stringify(formData));
    
    // Save user profile to database
    setLoading(true);
    await saveUserProfile();
    setLoading(false);
    
    toast({
      title: 'Details Saved',
      description: 'Proceeding to payment...',
    });
    // save dates and terms as well
    const saved = { ...formData, startDate, endDate, acceptedTerms };
    localStorage.setItem('delivery_details', JSON.stringify(saved));
    navigate('/payment');
  };

  if (!selectedVehicle) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Delivery Details</h1>
          <p className="text-muted-foreground">Enter your delivery address for vehicle pickup</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your complete address"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                        min={getTodayDate()}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                        min={startDate || getTodayDate()}
                        required 
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <input id="terms" type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="w-4 h-4" />
                    <Label htmlFor="terms" className="m-0">I accept the <a href="/terms" className="text-primary underline">terms and conditions</a></Label>
                  </div>

                  <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90" disabled={!acceptedTerms}>
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg mb-1">{selectedVehicle.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{selectedVehicle.type}</p>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹{selectedVehicle.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
