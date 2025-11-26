import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Package, MapPin, Clock, CheckCircle } from 'lucide-react';

const Tracking = () => {
  const location = useLocation();
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();

  // Auto-load order if orderId is passed via navigation state
  useEffect(() => {
    const stateOrderId = (location.state as any)?.orderId;
    if (stateOrderId) {
      setOrderId(stateOrderId);
      setIsInitialLoad(true);
      // Automatically track the order
      fetchOrder(stateOrderId);
    } else {
      setIsInitialLoad(false);
    }
  }, [location.state]);

  // Auto-refresh order details every 10 seconds when tracking
  useEffect(() => {
    if (!orderDetails) return;

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9097/api/orders/${orderDetails.orderId}`);
        if (response.ok) {
          const order = await response.json();
          setOrderDetails(order);
        }
      } catch (error) {
        console.error('Error refreshing order:', error);
      }
    };

    const interval = setInterval(fetchOrderDetails, 10000);
    return () => clearInterval(interval);
  }, [orderDetails?.orderId]);

  // Listen for order updates from admin
  useEffect(() => {
    if (!orderDetails) return;

    const handleOrderUpdate = () => {
      // Immediately refresh when admin updates
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`http://localhost:9097/api/orders/${orderDetails.orderId}`);
          if (response.ok) {
            const order = await response.json();
            setOrderDetails(order);
          }
        } catch (error) {
          console.error('Error refreshing order:', error);
        }
      };
      fetchOrderDetails();
    };

    window.addEventListener('travelease:ordersUpdated', handleOrderUpdate);
    return () => window.removeEventListener('travelease:ordersUpdated', handleOrderUpdate);
  }, [orderDetails?.orderId]);

  const fetchOrder = async (orderIdToFetch: string) => {
    setLoading(true);
    
    try {
      const response = await fetch(`http://localhost:9097/api/orders/${orderIdToFetch}`);
      
      if (response.ok) {
        const order = await response.json();
        setOrderDetails(order);
        setIsInitialLoad(false);
      } else if (response.status === 404) {
        toast({
          title: 'Order Not Found',
          description: 'No order found with this ID. Please check and try again.',
          variant: 'destructive',
        });
        setOrderDetails(null);
        setIsInitialLoad(false);
      } else {
        throw new Error('Failed to fetch order');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: 'Failed to track order. Please try again.',
        variant: 'destructive',
      });
      setOrderDetails(null);
      setIsInitialLoad(false);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an order ID.',
        variant: 'destructive',
      });
      return;
    }

    fetchOrder(orderId);
  };

  const getStatusStep = (status: string) => {
    const statusMap: { [key: string]: number } = {
      'BOOKING_CONFIRMED': 1,
      'VEHICLE_PREPARED': 2,
      'ON_THE_WAY': 3,
      'DELIVERED': 4
    };
    return statusMap[status] || 0;
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'BOOKING_CONFIRMED': 'Booking Confirmed',
      'VEHICLE_PREPARED': 'Vehicle Prepared',
      'ON_THE_WAY': 'On The Way',
      'DELIVERED': 'Delivered'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen py-12 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        {loading && isInitialLoad && (
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Loading...</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Please wait while we fetch your order details
            </p>
          </div>
        )}
        
        {!loading && !orderDetails && !isInitialLoad && (
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Please navigate from My Bookings page to track your order
            </p>
          </div>
        )}

        {orderDetails && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
            <Card className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold mb-6">Order Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-semibold">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-semibold">{orderDetails.vehicleName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Booking Date</p>
                  <p className="font-semibold">
                    {new Date(orderDetails.bookingDate).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Status</p>
                  <p className="font-semibold text-primary">{getStatusLabel(orderDetails.orderStatus)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <p className="font-semibold">
                    {new Date(orderDetails.startDate).toLocaleDateString('en-IN', {
                      dateStyle: 'medium'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <p className="font-semibold">
                    {new Date(orderDetails.endDate).toLocaleDateString('en-IN', {
                      dateStyle: 'medium'
                    })}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-bold mb-6">Tracking Progress</h3>
                
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border"></div>
                  <div 
                    className="absolute left-6 top-8 w-0.5 bg-gradient-hero transition-all duration-1000"
                    style={{ height: `calc(${((getStatusStep(orderDetails.orderStatus) - 1) / 3) * 100}% - 2rem)` }}
                  ></div>

                  {/* Steps */}
                  <div className="space-y-8">
                    <div className="flex items-start gap-4 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        getStatusStep(orderDetails.orderStatus) >= 1 
                          ? 'bg-gradient-hero text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-lg">Booking Confirmed</h4>
                        <p className="text-sm text-muted-foreground">Your booking has been confirmed and payment processed</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        getStatusStep(orderDetails.orderStatus) >= 2 
                          ? 'bg-gradient-hero text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-lg">Vehicle Prepared</h4>
                        <p className="text-sm text-muted-foreground">Vehicle has been prepared and ready for dispatch</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        getStatusStep(orderDetails.orderStatus) >= 3 
                          ? 'bg-gradient-hero text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-lg">On The Way</h4>
                        <p className="text-sm text-muted-foreground">Vehicle is on the way to your delivery location</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                        getStatusStep(orderDetails.orderStatus) >= 4 
                          ? 'bg-gradient-hero text-white' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pt-2">
                        <h4 className="font-semibold text-lg">Delivered</h4>
                        <p className="text-sm text-muted-foreground">Vehicle has been delivered to your location</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Need Help?</h4>
                  <p className="text-sm text-muted-foreground">
                    Contact our 24/7 support team at <span className="text-primary font-semibold">+91 7995762616</span> or email us at{' '}
                    <span className="text-primary font-semibold">support@travelease.com</span>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tracking;
