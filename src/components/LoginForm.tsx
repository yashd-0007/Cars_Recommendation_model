import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/services/authApi";
import InputField from "./InputField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Connect to the actual Node.js HTTP backend natively via authApi wrapper
      const response = await authApi.login(email, password);
      
      if (response.success) {
        // Cache the entire verified payload exclusively via context
        login(response.user);
        toast.success(response.message);
        navigate("/profile");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password. Try yash@example.com / 123456";
      setErrors({ general: errorMessage });
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg"
        >
          {errors.general}
        </motion.div>
      )}

      <div className="space-y-4">
        <InputField
          label="Email address"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={isLoading}
        />

        <InputField
          label="Password"
          isPassword
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isLoading}
          />
          <Label htmlFor="remember" className="text-sm cursor-pointer font-normal text-muted-foreground hover:text-foreground transition-colors">
            Remember me
          </Label>
        </div>
        
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          Forgot password?
        </a>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-golden text-primary-foreground py-3 px-4 rounded-xl text-md font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-60 relative overflow-hidden"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            <span>Signing in...</span>
          </div>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            <span>Sign In</span>
          </>
        )}
      </motion.button>
      
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
