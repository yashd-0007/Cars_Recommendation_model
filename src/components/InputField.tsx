import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  isPassword?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, isPassword, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = isPassword ? (showPassword ? "text" : "password") : props.type || "text";

    return (
      <div className="space-y-2 w-full">
        <Label className={`text-sm font-medium ${error ? "text-destructive" : ""}`}>
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            className={`bg-background border-border w-full py-2.5 transition-colors focus-visible:ring-1 focus-visible:ring-primary ${error ? "border-destructive focus-visible:ring-destructive" : ""} ${isPassword ? "pr-10" : ""} ${className || ""}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs font-medium text-destructive mt-1.5">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
