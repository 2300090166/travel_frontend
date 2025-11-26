import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Navigation } from 'lucide-react';
import { formatDateDDMMYYYY } from '@/lib/date';
import { API_BASE } from '@/lib/backend';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      if (!user?.username) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/orders/my-orders?username=${encodeURIComponent(user.username)}`);
        
        if (response.ok) {
          const orders = await response.json();
          setBookings(orders);
        } else {
          console.error('Failed to fetch bookings');
          setBookings([]);
        }
      } catch (err) {
        console.error('Error loading bookings:', err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();

    // Auto-refresh every 15 seconds to show updated order status
    const interval = setInterval(loadBookings, 15000);
    return () => clearInterval(interval);
  }, [user]);

  // Listen for orders added elsewhere (e.g., payment page) and reload
  useEffect(() => {
    function onOrdersUpdated() {
      if (user?.username) {
        fetch(`${API_BASE}/api/orders/my-orders?username=${encodeURIComponent(user.username)}`)
          .then(res => res.ok ? res.json() : [])
          .then(orders => setBookings(orders))
          .catch(err => console.error('Error reloading bookings:', err));
      }
    }

    window.addEventListener('travelease:ordersUpdated', onOrdersUpdated);
    return () => window.removeEventListener('travelease:ordersUpdated', onOrdersUpdated);
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success';
      case 'on-the-way':
        return 'bg-accent';
      case 'arriving':
        return 'bg-secondary';
      default:
        return 'bg-primary';
    }
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

  const handleTrackOrder = (orderId: string) => {
    navigate('/tracking', { state: { orderId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-8 px-4">
      <div className="container mx-auto" style={{ maxWidth: '1600px' }}>
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">My Bookings</h1>
              <p className="text-muted-foreground">Track and manage your vehicle bookings</p>
            </div>
            {user && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome,</p>
                <p className="text-xl font-semibold">{user.username}</p>
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading your bookings...</p>
            </CardContent>
          </Card>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
              <p className="text-muted-foreground">Start by booking a vehicle from our collection</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Vehicle Name</TableHead>
                      <TableHead>Mobile Number</TableHead>
                      <TableHead>Payment Amount</TableHead>
                      <TableHead>Payment Status</TableHead>
                      <TableHead>Order Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Booking Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.orderId || booking.id}</TableCell>
                        <TableCell>{booking.vehicleName}</TableCell>
                        <TableCell>{booking.mobileNumber || 'N/A'}</TableCell>
                        <TableCell>₹{booking.paymentAmount || booking.amount}</TableCell>
                        <TableCell>
                          <Badge className={
                            booking.paymentStatus === 'COMPLETED' || booking.paymentStatus === 'SUCCESS' 
                              ? 'bg-success' 
                              : booking.paymentStatus === 'PENDING' 
                              ? 'bg-warning' 
                              : 'bg-primary'
                          }>
                            {booking.paymentStatus || 'COMPLETED'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-primary text-primary">
                            {getStatusLabel(booking.orderStatus || 'BOOKING_CONFIRMED')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDateDDMMYYYY(booking.startDate || booking.start_date)}</TableCell>
                        <TableCell>{formatDateDDMMYYYY(booking.endDate || booking.end_date)}</TableCell>
                        <TableCell>{formatDateDDMMYYYY(booking.bookingDate || booking.booking_date)}</TableCell>
                        <TableCell>
                          <Button 
                            onClick={() => handleTrackOrder(booking.orderId)}
                            size="sm"
                            className="bg-gradient-hero hover:opacity-90"
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Track
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
