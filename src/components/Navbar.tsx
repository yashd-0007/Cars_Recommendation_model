import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X, CarFront, Zap, TrendingUp, Sparkles, HelpCircle, FileText, Calculator, Star, Phone, User, LogOut, Heart, ArrowLeftRight, MapPin, Calendar, ShieldCheck } from "lucide-react";
import logo from "@/assets/dreamdrive-logo.png";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isHome = location.pathname === "/";

  // Handles smooth scrolling for same-page anchors
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setIsMobileMenuOpen(false);
    if (isHome) {
      e.preventDefault();
      const element = document.getElementById(targetId.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        // Fallback for edge cases where element is missing (e.g., search-section)
        const fallback = document.querySelector(targetId);
        if (fallback) fallback.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const NavItemStyles = "flex items-center gap-1.5 py-2 sm:py-0 hover:text-primary transition-colors text-sm font-medium";
  const DropdownItemStyles = "flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors rounded-md";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/85 border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logo} alt="DreamDrive" className="w-8 h-8" />
          <span className="text-xl font-bold tracking-tight font-sans">
            Dream<span className="text-gradient-golden">Drive</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-muted-foreground">
          
          {/* New Cars Dropdown */}
          <div className="relative group py-5">
            <button className={`${NavItemStyles} outline-none`}>
              New Cars <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-card border border-border shadow-elevated rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex flex-col">
                <Link to="/cars/upcoming" className={DropdownItemStyles}>
                  <Sparkles className="w-4 h-4" /> Upcoming Cars
                </Link>
                <Link to="/cars/popular" className={DropdownItemStyles}>
                  <TrendingUp className="w-4 h-4" /> Popular Cars
                </Link>
                <Link to="/cars/latest" className={DropdownItemStyles}>
                  <CarFront className="w-4 h-4" /> Latest Cars
                </Link>
                <Link to="/cars/electric" className={DropdownItemStyles}>
                  <Zap className="w-4 h-4 text-emerald-500" /> Electric Cars
                </Link>
              </div>
            </div>
          </div>

          <Link to="/dealers" className={NavItemStyles}>
            Dealers
          </Link>

          <Link to="/cars/variant-explained" className={NavItemStyles}>
            Variant Explained
          </Link>

          <Link to="/#reviews" onClick={(e) => handleAnchorClick(e, "#reviews")} className={NavItemStyles}>
            Reviews
          </Link>

          {/* More Dropdown */}
          <div className="relative group py-5">
            <button className={`${NavItemStyles} outline-none`}>
              More <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full right-0 w-64 bg-card border border-border shadow-elevated rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex flex-col">
                <Link to="/#emi-calculator" onClick={(e) => handleAnchorClick(e, "#emi-calculator")} className={DropdownItemStyles}>
                  <Calculator className="w-4 h-4" /> Car Loan EMI Calculator
                </Link>
                <Link to="/#top-recommended" onClick={(e) => handleAnchorClick(e, "#top-recommended")} className={DropdownItemStyles}>
                  <Star className="w-4 h-4 text-amber-500" /> Top Recommended Cars
                </Link>
                <Link to="/#contact" onClick={(e) => handleAnchorClick(e, "#contact")} className={DropdownItemStyles}>
                  <Phone className="w-4 h-4" /> Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-border/80"></div>

          {/* Action Links */}
          <Link to="/#search-section" onClick={(e) => handleAnchorClick(e, "#search-section")} className={NavItemStyles}>
            Find Cars
          </Link>

          {isAuthenticated && user ? (
            <div className="relative group py-5">
              <button className={`${NavItemStyles} outline-none flex items-center gap-2`}>
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>Hi, {user.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full right-0 w-48 bg-card border border-border shadow-elevated rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex flex-col">
                  {user.role === "ADMIN" && (
                    <Link to="/admin" className={DropdownItemStyles} onClick={() => setIsMobileMenuOpen(false)}>
                      <ShieldCheck className="w-4 h-4 text-primary" /> 
                      <span className="font-bold text-primary">Admin Dashboard</span>
                    </Link>
                  )}
                  <Link to="/profile" className={DropdownItemStyles}>
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link to="/wishlist" className={DropdownItemStyles}>
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link to="/compare" className={DropdownItemStyles}>
                    <ArrowLeftRight className="w-4 h-4" /> Compare
                  </Link>
                  <Link to="/my-test-drives" className={DropdownItemStyles}>
                    <Calendar className="w-4 h-4" /> My Test Drives
                  </Link>
                  <button 
                    onClick={() => { logout(); navigate("/login"); }} 
                    className={`${DropdownItemStyles} text-red-500 hover:text-red-600 hover:bg-red-50/50 w-full text-left`}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg pointer-events-auto">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="lg:hidden z-50 p-2 text-foreground focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-background border-b border-border p-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto z-40">
          <div className="flex flex-col gap-4">
            
            <div className="space-y-2 pb-3 border-b border-border/50">
              <p className="text-xs uppercase font-bold text-muted-foreground ml-2 mb-2">New Cars</p>
              <Link to="/cars/upcoming" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
                <Sparkles className="w-4 h-4" /> Upcoming Cars
              </Link>
              <Link to="/cars/latest" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
                <CarFront className="w-4 h-4" /> Latest Cars
              </Link>
              <Link to="/cars/popular" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
                <TrendingUp className="w-4 h-4" /> Popular Cars
              </Link>
              <Link to="/cars/electric" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-emerald-600 dark:text-emerald-400" onClick={() => setIsMobileMenuOpen(false)}>
                <Zap className="w-4 h-4" /> Electric Cars
              </Link>
            </div>

            <div className="space-y-1 pb-3 border-b border-border/50">
              <Link to="/dealers" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <MapPin className="w-4 h-4" /> Dealers & Test Drives
              </Link>
              <Link to="/cars/variant-explained" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                <FileText className="w-4 h-4" /> Variant Explained
              </Link>
              <Link to="/#reviews" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted font-medium" onClick={(e) => handleAnchorClick(e, "#reviews")}>
                <HelpCircle className="w-4 h-4" /> Reviews
              </Link>
            </div>

            <div className="space-y-2 pb-3 border-b border-border/50">
              <p className="text-xs uppercase font-bold text-muted-foreground ml-2 mb-2">More Tools</p>
              <Link to="/#emi-calculator" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted" onClick={(e) => handleAnchorClick(e, "#emi-calculator")}>
                <Calculator className="w-4 h-4" /> EMI Calculator
              </Link>
              <Link to="/#top-recommended" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted" onClick={(e) => handleAnchorClick(e, "#top-recommended")}>
                <Star className="w-4 h-4 text-amber-500" /> Top Recommended Cars
              </Link>
              <Link to="/#contact" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted" onClick={(e) => handleAnchorClick(e, "#contact")}>
                <Phone className="w-4 h-4" /> Contact Us
              </Link>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <Link to="/#search-section" className="text-center font-medium py-2 text-muted-foreground hover:text-foreground" onClick={(e) => handleAnchorClick(e, "#search-section")}>
                Find Cars
              </Link>
              {isAuthenticated && user ? (
                <>
                  {user.role === "ADMIN" && (
                    <Link to="/admin" className="bg-primary/10 text-primary text-center font-bold py-3 rounded-lg w-full flex items-center justify-center gap-2 border border-primary/20 mb-1" onClick={() => setIsMobileMenuOpen(false)}>
                      <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="bg-secondary text-secondary-foreground text-center font-semibold py-3 rounded-lg w-full flex items-center justify-center gap-2 border border-border" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link to="/wishlist" className="bg-secondary/50 text-secondary-foreground text-center font-semibold py-3 rounded-lg w-full flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="w-4 h-4" /> Wishlist
                  </Link>
                  <Link to="/compare" className="bg-secondary/30 text-secondary-foreground text-center font-semibold py-3 rounded-lg w-full flex items-center justify-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <ArrowLeftRight className="w-4 h-4" /> Compare Cars
                  </Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false); navigate("/login"); }} className="bg-destructive/10 text-destructive hover:bg-destructive/20 text-center font-semibold py-3 rounded-lg w-full flex items-center justify-center gap-2 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-primary text-primary-foreground text-center font-semibold py-3 rounded-lg w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
