import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Car, CheckCircle, Clock3, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TestDriveBooking {
  id: number;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
  carName?: string;
  dealer: {
    name: string;
    city: string;
    address: string;
  };
}

export default function MyTestDrives() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<TestDriveBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/bookings/my/${user?.id}`);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this test drive booking?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user?.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh list
      } else {
        toast.error(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Failed to cancel booking", error);
      toast.error("An error occurred while cancelling the booking");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "PENDING":
        return <Clock3 className="w-5 h-5 text-amber-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "CONFIRMED":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "PENDING":
        return "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
      case "CANCELLED":
        return "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            My Test Drives
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your upcoming and past dealership appointments.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground bg-card border border-border rounded-3xl shadow-sm">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium">No test drives scheduled.</p>
            <p className="mt-2 text-sm mb-6">Explore our curated collection and book a test drive.</p>
            <Button onClick={() => navigate("/dealers")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Find Dealerships
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center hover:shadow-md transition-shadow"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusStyles(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span>{booking.status}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      • Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground">
                    {booking.dealer.name}
                  </h3>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-muted-foreground text-sm">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-primary shrink-0" />
                      <span>{booking.carName || "Vehicle"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{booking.dealer.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      <span>{booking.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 shrink-0">
                  {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 h-10 px-4 rounded-xl font-semibold"
                    >
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
