import { ReactNode } from "react";
import { motion } from "framer-motion";
import logo from "@/assets/dreamdrive-logo.png";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-8 overflow-hidden">
      {/* Background Orbs to match existing Theme Aesthetic */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <motion.div 
              className="flex items-center justify-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src={logo} alt="DreamDrive Logo" className="w-12 h-12" />
              <span className="text-2xl font-bold tracking-tight font-sans">
                Dream<span className="text-gradient-golden">Drive</span>
              </span>
            </motion.div>
          </Link>

          <h1 className="text-3xl font-bold font-sans mb-2 text-foreground">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          {children}
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DreamDrive. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
