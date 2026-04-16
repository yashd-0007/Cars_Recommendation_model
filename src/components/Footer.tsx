import { Link, useLocation } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/dreamdrive-logo.png";

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  // Handles smooth scrolling for same-page anchors
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (isHome && targetId.startsWith("#")) {
      e.preventDefault();
      const element = document.getElementById(targetId.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        const fallback = document.querySelector(targetId);
        if (fallback) fallback.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const FooterLinkStyles = "text-muted-foreground hover:text-primary transition-colors text-sm flex items-center";

  return (
    <footer id="contact" className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Section 1: Brand / About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3" onClick={(e) => handleAnchorClick(e, "#home")}>
              <img src={logo} alt="DreamDrive" className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight font-sans text-foreground">
                Dream<span className="text-gradient-golden">Drive</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed pr-4">
              Helping users discover the perfect car based on budget, lifestyle, and preferences using smart recommendations.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold tracking-wide">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/#home" onClick={(e) => handleAnchorClick(e, "#home")} className={FooterLinkStyles}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#about" onClick={(e) => handleAnchorClick(e, "#about")} className={FooterLinkStyles}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/#search-section" onClick={(e) => handleAnchorClick(e, "#search-section")} className={FooterLinkStyles}>
                  Find Cars
                </Link>
              </li>
              <li>
                <Link to="/#reviews" onClick={(e) => handleAnchorClick(e, "#reviews")} className={FooterLinkStyles}>
                  Reviews
                </Link>
              </li>
              <li>
                <Link to="/cars/electric" className={FooterLinkStyles}>
                  Electric Cars
                </Link>
              </li>
              <li>
                <Link to="/cars/variant-explained" className={FooterLinkStyles}>
                  Variant Explained
                </Link>
              </li>
              <li>
                <Link to="/#contact" onClick={(e) => handleAnchorClick(e, "#contact")} className={FooterLinkStyles}>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Features / Services */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold tracking-wide">Features & Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/#emi-calculator" onClick={(e) => handleAnchorClick(e, "#emi-calculator")} className={FooterLinkStyles}>
                  Car Loan EMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/#top-recommended" onClick={(e) => handleAnchorClick(e, "#top-recommended")} className={FooterLinkStyles}>
                  Top Recommended Cars
                </Link>
              </li>
              <li>
                <Link to="/#search-section" onClick={(e) => handleAnchorClick(e, "#search-section")} className={FooterLinkStyles}>
                  Smart AI Recommendations
                </Link>
              </li>
              <li>
                <Link to="/#search-section" onClick={(e) => handleAnchorClick(e, "#search-section")} className={FooterLinkStyles}>
                  Budget-Based Suggestions
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold tracking-wide">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Pune, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  +91 XXXXX XXXXX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  contact@dreamdrive.com
                </span>
              </li>
            </ul>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 DreamDrive. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
