import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { User, Mail, ShieldCheck, LogOut, Calendar, Car } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserPayload {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5001/api/bookings/my/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) setBookings(data.data);
        })
        .catch(err => console.error("Failed to fetch bookings", err));
    }
  }, [user]);

  const handleLogout = () => {
    // Clear credentials via context
    logout();
    // Redirect cleanly
    navigate("/login");
  };

  if (!user) return null; // Protective fallback while redirecting

  // Format the ISO Date cleanly with a fallback
  let formattedDate = "Recently";
  if (user.createdAt) {
    const d = new Date(user.createdAt);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold font-sans tracking-tight mb-2">
            Welcome back, <span className="text-gradient-golden">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-lg text-muted-foreground whitespace-pre-wrap">
            Manage your automotive profile and saved preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main User Card */}
          <div className="md:col-span-2 bg-card border border-border p-8 rounded-3xl" style={{ boxShadow: "var(--shadow-card)" }}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <User className="mr-3 w-6 h-6 text-primary" />
              Account Details
            </h2>

            <div className="space-y-6">
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Full Name</span>
                <span className="text-lg font-semibold">{user.name}</span>
              </div>
              
              <div className="flex flex-col space-y-1">
                 <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Email Address</span>
                 <div className="flex items-center">
                   <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                   <span className="text-lg font-semibold">{user.email}</span>
                 </div>
              </div>

              <div className="flex flex-col space-y-1">
                 <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Account Status</span>
                 <div className="flex items-center text-green-500">
                   <ShieldCheck className="w-4 h-4 mr-2" />
                   <span className="text-base font-semibold">Logged in securely verified</span>
                 </div>
              </div>
            </div>
          </div>



          {/* Subsidiary Membership Tag */}
          <div className="space-y-8">
            <div className="bg-card border border-border p-6 rounded-3xl" style={{ boxShadow: "var(--shadow-card)" }}>
               <h3 className="font-semibold text-lg mb-4 text-gradient-golden">Membership</h3>
               <div className="space-y-3">
                 <div className="flex justify-between items-center text-sm">
                   <span className="text-muted-foreground">Tier</span>
                   <span className="font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">{user.role}</span>
                 </div>
                 <div className="flex items-center text-sm text-muted-foreground">
                   <Calendar className="w-4 h-4 mr-2" />
                   Joined {formattedDate}
                 </div>
               </div>
            </div>

            {/* Quick Actions Array */}
            <Button 
               onClick={() => navigate("/my-test-drives")} 
               variant="outline" 
               className="w-full py-6 text-base justify-start hover:border-primary/50 transition-colors bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary"
             >
               <Calendar className="mr-3 w-5 h-5" />
               View My Test Drives
            </Button>
            <Button 
               onClick={() => navigate("/")} 
               variant="outline" 
               className="w-full py-6 text-base justify-start hover:border-primary/50 transition-colors"
             >
               <Car className="mr-3 w-5 h-5 text-primary" />
               Browse Cars
            </Button>

            <Button 
               onClick={handleLogout} 
               variant="destructive" 
               className="w-full py-6 text-base shadow-xl"
             >
               <LogOut className="mr-3 w-5 h-5" />
               Sign Out Securely
            </Button>
          </div>

        </div>
      </main>

    </div>
  );
};

export default Profile;
