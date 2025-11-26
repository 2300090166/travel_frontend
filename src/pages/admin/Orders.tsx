import { useEffect, useState } from 'react';
import { formatDateDDMMYYYY } from '@/lib/date';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ErrorBoundary from '@/components/ErrorBoundary';
import { API_BASE } from '@/lib/backend';
import { Search } from 'lucide-react';

interface Order {
  id: number;
  orderId: string;
  vehicleName: string;
  username: string;
  address: string;
  mobileNumber: string;
  paymentAmount: number;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  bookingDate: string;
  paymentMethod?: string;
  orderStatus: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Filter orders based on search query
  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.mobileNumber.includes(searchQuery)
  );

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('travelease_token');
      const response = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setErrorMsg(null);
      } else {
        setErrorMsg('Failed to load orders from server');
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setErrorMsg('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  // Listen for new orders created in other pages
  useEffect(() => {
    function onOrdersUpdated() {
      loadOrders();
    }

    window.addEventListener('travelease:ordersUpdated', onOrdersUpdated);
    return () => window.removeEventListener('travelease:ordersUpdated', onOrdersUpdated);
  }, []);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('travelease_token');
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      // Optimistically update the UI
      setOrders(prevOrders => 
        prevOrders.map(o => 
          o.id === orderId ? { ...o, orderStatus: newStatus } : o
        )
      );

      const response = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...order,
          orderStatus: newStatus,
          startDate: order.startDate,
          endDate: order.endDate
        })
      });

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: 'Order status has been updated successfully',
        });
        // Notify other pages about the update
        window.dispatchEvent(new CustomEvent('travelease:ordersUpdated'));
        // Reload to ensure consistency
        await loadOrders();
      } else {
        // Revert on failure
        await loadOrders();
        toast({
          title: 'Update Failed',
          description: 'Failed to update order status',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      // Revert on error
      await loadOrders();
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
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

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Orders & Bookings</h1>
              <p className="text-muted-foreground">Manage customer orders</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by order ID, vehicle, username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {errorMsg && (
          <Card className="mb-4">
            <div className="p-4 text-sm text-red-600">{errorMsg}</div>
          </Card>
        )}

        {loading ? (
          <Card>
            <div className="p-8 text-center text-muted-foreground">Loading orders...</div>
          </Card>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? 'No orders found matching your search' : 'No orders found'}
            </div>
          </Card>
        ) : (
          <Card>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Vehicle Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Mobile Number</TableHead>
                    <TableHead>Payment Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Booking Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{order.vehicleName}</TableCell>
                      <TableCell>{order.username}</TableCell>
                      <TableCell>{order.mobileNumber}</TableCell>
                      <TableCell>₹{order.paymentAmount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          order.paymentStatus === 'COMPLETED' || order.paymentStatus === 'SUCCESS' 
                            ? 'bg-green-100 text-green-800' 
                            : order.paymentStatus === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.orderStatus || 'BOOKING_CONFIRMED'}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue>
                              {getStatusLabel(order.orderStatus || 'BOOKING_CONFIRMED')}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="BOOKING_CONFIRMED">Booking Confirmed</SelectItem>
                            <SelectItem value="VEHICLE_PREPARED">Vehicle Prepared</SelectItem>
                            <SelectItem value="ON_THE_WAY">On The Way</SelectItem>
                            <SelectItem value="DELIVERED">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{formatDateDDMMYYYY(order.startDate)}</TableCell>
                      <TableCell>{formatDateDDMMYYYY(order.endDate)}</TableCell>
                      <TableCell>{formatDateDDMMYYYY(order.bookingDate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default AdminOrders;
