import { useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your email and password to access your account"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
