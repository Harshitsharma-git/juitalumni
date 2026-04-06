import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Briefcase, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const [stats, setStats] = useState({ alumni: 0, events: 0, jobs: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: alumni }, { count: events }, { count: jobs }] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }),
      ]);
      setStats({ alumni: alumni ?? 0, events: events ?? 0, jobs: jobs ?? 0 });
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Total Alumni", value: stats.alumni, icon: Users, color: "gradient-primary" },
    { label: "Active Events", value: stats.events, icon: Calendar, color: "bg-success" },
    { label: "Jobs Posted", value: stats.jobs, icon: Briefcase, color: "bg-accent" },
    { label: "Your Network", value: "Growing", icon: TrendingUp, color: "bg-secondary" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Welcome back, {profile?.name || "Alumni"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin ? "Here's your admin overview." : "Here's what's happening in your network."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="shadow-soft hover:shadow-glow transition-shadow animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-4 w-4 text-primary-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-display font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Update your profile", to: "/profile" },
                { label: "Browse alumni directory", to: "/directory" },
                { label: "View upcoming events", to: "/events" },
                { label: "Explore job opportunities", to: "/jobs" },
              ].map((action) => (
                <a
                  key={action.to}
                  href={action.to}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="w-2 h-2 rounded-full gradient-primary" />
                  <span className="text-sm font-medium">{action.label}</span>
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Your Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Department", value: profile?.department || "Not set" },
                { label: "Graduation Year", value: profile?.graduation_year?.toString() || "Not set" },
                { label: "Company", value: profile?.company || "Not set" },
                { label: "Job Title", value: profile?.job_title || "Not set" },
                { label: "Location", value: profile?.location || "Not set" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
