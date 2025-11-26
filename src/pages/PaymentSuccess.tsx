import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Download } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/booking');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-6 sm:p-8 md:p-10">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-success/10 p-4 rounded-full">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-success" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Payment Successful!</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Your booking has been confirmed. Get ready for an amazing journey!
            </p>
          </div>

          <Card className="p-6 bg-muted/30 text-left space-y-4">
            <h2 className="text-xl font-bold text-center mb-4">Order Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-semibold">{order.orderId}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <p className="font-semibold">{order.vehicleName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-semibold">{order.paymentMethod}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-primary text-lg">₹{order.paymentAmount}</p>
              </div>
              
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Booking Date</p>
                <p className="font-semibold">
                  {new Date(order.bookingDate).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Delivery Address</p>
                <p className="font-semibold whitespace-pre-line">
                  {order.address}
                  {order.mobileNumber && (
                    <>
                      {'\n'}Mobile: {order.mobileNumber}
                    </>
                  )}
                </p>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link to="/my-bookings" className="flex-1">
              <Button className="w-full bg-gradient-hero hover:opacity-90">
                View My Bookings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link to="/tracking" state={{ orderId: order.orderId }} className="flex-1">
              <Button variant="outline" className="w-full">
                Track Order
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
