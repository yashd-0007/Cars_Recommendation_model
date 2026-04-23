import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import CONFIG from "@/config";
import { 
  Users, 
  Calendar, 
  Heart, 
  ArrowLeftRight, 
  Activity, 
  TrendingUp, 
  MapPin, 
  Car, 
  CheckCircle, 
  XCircle, 
  Clock,
  ShieldCheck,
  Search,
  Filter,
  BarChart3,
  List,
  User as UserIcon,
  RefreshCw,
  MessageSquare,
  Trash2,
  Check,
  X,
  Star
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { reviewApi, Review } from "@/services/reviewApi";

interface SummaryStats {
  totalUsers: number;
  totalBookings: number;
  totalWishlist: number;
  totalCompare: number;
  totalActivity: number;
  totalReviews: number;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
  };
}

interface BookingReportItem {
  id: number;
  status: string;
  date: string;
  timeSlot: string;
  createdAt: string;
  carId: string;
  user: { name: string; email: string };
  dealer: { name: string; city: string };
}

interface ActivityLogItem {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  user: { name: string; email: string } | null;
}

interface UserReportItem {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    bookings: number;
    wishlists: number;
    compares: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SummaryStats | null>(null);
  const [bookings, setBookings] = useState<BookingReportItem[]>([]);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [users, setUsers] = useState<UserReportItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const headers = { "x-user-id": user?.id.toString() || "" };
      
      const [statsRes, bookingsRes, activityRes, usersRes, reviewsData] = await Promise.all([
        fetch(`${CONFIG.NODE_API_URL}/admin/summary`, { headers }),
        fetch(`${CONFIG.NODE_API_URL}/admin/bookings-report`, { headers }),
        fetch(`${CONFIG.NODE_API_URL}/admin/activity-report`, { headers }),
        fetch(`${CONFIG.NODE_API_URL}/admin/users-report`, { headers }),
        reviewApi.getAdminReviews()
      ]);

      const [statsData, bookingsData, activityData, usersData] = await Promise.all([
        statsRes.json(),
        bookingsRes.json(),
        activityRes.json(),
        usersRes.json()
      ]);

      if (statsData.success) setStats(statsData.data);
      if (bookingsData.success) setBookings(bookingsData.data);
      if (activityData.success) setActivities(activityData.data);
      if (usersData.success) setUsers(usersData.data);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReviewStatus = async (id: number, status: string) => {
    try {
      await reviewApi.updateReviewStatus(id, status);
      toast.success(`Review ${status.toLowerCase()} successfully`);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status: status as any } : r));
    } catch (error) {
      toast.error("Failed to update review status");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await reviewApi.deleteReview(id);
      toast.success("Review deleted successfully");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "approved": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "cancelled":
      case "rejected": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "completed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const pieData = stats ? [
    { name: "Confirmed", value: stats.statusBreakdown.confirmed },
    { name: "Pending", value: stats.statusBreakdown.pending },
    { name: "Cancelled", value: stats.statusBreakdown.cancelled },
    { name: "Completed", value: stats.statusBreakdown.completed },
  ].filter(d => d.value > 0) : [];

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <RefreshCw className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background flex flex-col font-sans">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary font-bold">
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Platform Analytics</h1>
            <p className="text-muted-foreground">Monitor platform growth, user engagement, and booking performance.</p>
          </div>
          <Button 
            onClick={fetchAllData} 
            variant="outline" 
            className="flex items-center gap-2 bg-card border-border shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Total Users" 
            value={stats?.totalUsers || 0} 
            icon={<Users className="w-5 h-5 text-blue-500" />} 
            description="Active accounts registered"
          />
          <StatsCard 
            title="Total Bookings" 
            value={stats?.totalBookings || 0} 
            icon={<Calendar className="w-5 h-5 text-emerald-500" />} 
            description="Test drive appointments"
          />
          <StatsCard 
            title="Platform Reviews" 
            value={stats?.totalReviews || 0} 
            icon={<MessageSquare className="w-5 h-5 text-purple-500" />} 
            description="User submitted ratings"
          />
          <StatsCard 
            title="Platform Activity" 
            value={stats?.totalActivity || 0} 
            icon={<Activity className="w-5 h-5 text-amber-500" />} 
            description="Actions logged in 30 days"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="bg-card border border-border p-1 h-12 gap-1 shadow-sm rounded-xl overflow-x-auto justify-start sm:justify-center">
            <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0">
              <Calendar className="w-4 h-4 mr-2" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0">
              <MessageSquare className="w-4 h-4 mr-2" /> Reviews
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0">
              <Users className="w-4 h-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground shrink-0">
              <Activity className="w-4 h-4 mr-2" /> Activity Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Status Breakdown Chart */}
              <Card className="lg:col-span-1 shadow-sm border-border rounded-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">Booking Status</CardTitle>
                  <CardDescription>Distribution of test drive states</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-muted-foreground text-sm">No booking data yet</div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity List (Mini) */}
              <Card className="lg:col-span-2 shadow-sm border-border rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Recent User Activity</CardTitle>
                    <CardDescription>Latest actions on the platform</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("activity")}>View All</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <Activity className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">
                            {log.action.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {log.user?.name || "Guest User"} • {log.details}
                          </p>
                        </div>
                        <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
             <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">All Test Drive Bookings</CardTitle>
                  <CardDescription>Comprehensive report of all dealership appointments</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="pl-6">Booking ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Dealer</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="pl-6 font-mono text-xs">#DRIVE-{b.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{b.user.name}</span>
                            <span className="text-[10px] text-muted-foreground">{b.user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{b.dealer.name}</TableCell>
                        <TableCell>{b.dealer.city}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{b.date}</span>
                            <span className="text-xs text-muted-foreground">{b.timeSlot}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${getStatusColor(b.status)} border px-2 py-0.5 rounded-full`}>
                            {b.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Review Moderation</CardTitle>
                <CardDescription>Approve or reject user-submitted testimonials</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="pl-6">Reviewer</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="w-[40%]">Comment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right pr-6">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                          No reviews submitted yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      reviews.map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="pl-6">
                            <div className="flex flex-col">
                              <span className="font-medium">{r.displayName || r.user?.name}</span>
                              <span className="text-[10px] text-muted-foreground">{r.user?.email}</span>
                              <span className="text-[9px] text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            <p className="line-clamp-2" title={r.comment}>{r.comment}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${getStatusColor(r.status)} border px-2 py-0.5 rounded-full`}>
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex items-center justify-end gap-2">
                              {r.status === "PENDING" && (
                                <>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="w-8 h-8 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => handleUpdateReviewStatus(r.id, "APPROVED")}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    size="icon" 
                                    variant="outline" 
                                    className="w-8 h-8 rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleUpdateReviewStatus(r.id, "REJECTED")}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="w-8 h-8 rounded-full text-slate-400 hover:text-red-600 hover:bg-slate-50"
                                onClick={() => handleDeleteReview(r.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">User Directory</CardTitle>
                <CardDescription>Management and engagement metrics per user</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="pl-6">Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right pr-6">Stats</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{u.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                        </TableCell>
                        <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-foreground">{u._count.bookings}</span>
                              <span>Bookings</span>
                            </div>
                            <div className="w-px h-4 bg-border"></div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-foreground">{u._count.wishlists}</span>
                              <span>Saves</span>
                            </div>
                            <div className="w-px h-4 bg-border"></div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-foreground">{u._count.compares}</span>
                              <span>Compare</span>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Platform Activity Log</CardTitle>
                <CardDescription>Full audit trail of all significant user interactions</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="pl-6">Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="pl-6 text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{log.user?.name || "Anonymous"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">
                          {log.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, description }: { title: string, value: string | number, icon: React.ReactNode, description: string }) {
  return (
    <Card className="shadow-sm border-border rounded-2xl hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-border/50">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}
