import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Menu, X, LogOut, Car, User, Package, Shield } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = isAuthenticated
    ? user?.isAdmin
      ? [
          { name: 'Admin Dashboard', path: '/admin' },
          { name: 'Vehicles', path: '/admin/vehicles' },
          { name: 'Orders', path: '/admin/orders' },
          { name: 'Customers', path: '/admin/customers' },
          { name: 'Feedback', path: '/admin/feedback' },
        ]
      : [
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Vehicles Booking', path: '/booking' },
          { name: 'About Us', path: '/about' },
          { name: 'My Bookings', path: '/my-bookings' },
          { name: 'Feedback', path: '/feedback' },
        ]
    : [
        { name: 'About Us', path: '/about' },
      ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-hero p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Car className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              TravelEase
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant={isActive(link.path) ? 'default' : 'ghost'}
                  className={`${isActive(link.path) ? 'bg-gradient-hero text-white' : ''} font-semibold`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-muted">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profilePic} alt={user?.username} />
                      <AvatarFallback className="bg-gradient-hero text-white font-semibold">
                        {user?.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Removed Admin Panel and My Bookings entries from avatar menu per request */}
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/signin">
                  <Button variant="ghost" className="font-semibold">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-hero hover:opacity-90 font-semibold">Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-in slide-in-from-top">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant={isActive(link.path) ? 'default' : 'ghost'}
                    className={`w-full justify-start font-semibold ${isActive(link.path) ? 'bg-gradient-hero text-white' : ''}`}
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 border-t border-border">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.profilePic} alt={user?.username} />
                      <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">{user?.username}</span>
                  </div>
                  <Button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full justify-start font-semibold"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-start bg-gradient-hero hover:opacity-90 font-semibold">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
