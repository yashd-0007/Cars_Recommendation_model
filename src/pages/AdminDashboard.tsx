import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
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
  RefreshCw
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

interface SummaryStats {
  totalUsers: number;
  totalBookings: number;
  totalWishlist: number;
  totalCompare: number;
  totalActivity: number;
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const headers = { "x-user-id": user?.id.toString() || "" };
      
      const [statsRes, bookingsRes, activityRes, usersRes] = await Promise.all([
        fetch("http://localhost:5001/api/admin/summary", { headers }),
        fetch("http://localhost:5001/api/admin/bookings-report", { headers }),
        fetch("http://localhost:5001/api/admin/activity-report", { headers }),
        fetch("http://localhost:5001/api/admin/users-report", { headers })
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
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
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
            title="Wishlist Saves" 
            value={stats?.totalWishlist || 0} 
            icon={<Heart className="w-5 h-5 text-rose-500" />} 
            description="Cars saved by users"
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
          <TabsList className="bg-card border border-border p-1 h-12 gap-1 shadow-sm rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" /> Bookings
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="rounded-lg px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
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

            {/* Platform Metrics Table */}
            <Card className="shadow-sm border-border rounded-2xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">Recent Registrations</CardTitle>
                <CardDescription>New users joining DreamDrive</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead className="pl-6">User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.slice(0, 5).map((u) => (
                      <TableRow key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                        <TableCell className="pl-6 font-medium">{u.name}</TableCell>
                        <TableCell className="text-muted-foreground">{u.email}</TableCell>
                        <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-normal">{u._count.bookings} Bookings</Badge>
                            <Badge variant="outline" className="font-normal">{u._count.wishlists} Saves</Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
