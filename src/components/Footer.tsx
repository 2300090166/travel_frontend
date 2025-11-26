import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { user, isAuthenticated } = useAuth();
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">TravelEase</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for seamless travel experiences. Book, travel, and explore with confidence.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {isAuthenticated ? (
                user?.isAdmin ? (
                  <>
                    <li>
                      <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors">Admin Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/admin/vehicles" className="text-muted-foreground hover:text-primary transition-colors">Vehicles</Link>
                    </li>
                    <li>
                      <Link to="/admin/orders" className="text-muted-foreground hover:text-primary transition-colors">Orders</Link>
                    </li>
                    <li>
                      <Link to="/admin/customers" className="text-muted-foreground hover:text-primary transition-colors">Customers</Link>
                    </li>
                    <li>
                      <Link to="/admin/feedback" className="text-muted-foreground hover:text-primary transition-colors">Feedback</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                    </li>
                    <li>
                      <Link to="/booking" className="text-muted-foreground hover:text-primary transition-colors">Vehicles Booking</Link>
                    </li>
              
                    <li>
                      <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                    </li>
              
                    <li>
                      <Link to="/my-bookings" className="text-muted-foreground hover:text-primary transition-colors">My Bookings</Link>
                    </li>
                      <li>
                      <Link to="/feedback" className="text-muted-foreground hover:text-primary transition-colors">Feedback</Link>
                    </li>
                  </>
                )
              ) : (
                <li>
                  <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
                </li>
              )}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">Near KL University, Vijayawada, Andhra Pradesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">+91 7995762616</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">support@travelease.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TravelEase. All rights reserved. Built with passion for travelers.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
