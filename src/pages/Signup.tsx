import { useEffect } from "react";
import AuthLayout from "@/components/AuthLayout";
import SignupForm from "@/components/SignupForm";

const Signup = () => {
  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthLayout
      title="Create an Account"
      subtitle="Enter your details below to get started securely"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
