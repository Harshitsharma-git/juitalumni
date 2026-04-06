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
    { label: "Total Alumni", value: stats.alumni, icon: Users, cls: "gradient-navy text-primary-foreground" },
    { label: "Active Events", value: stats.events, icon: Calendar, cls: "bg-success text-success-foreground" },
    { label: "Jobs Posted", value: stats.jobs, icon: Briefcase, cls: "gradient-gold text-accent-foreground" },
    { label: "Your Network", value: "Growing", icon: TrendingUp, cls: "bg-secondary text-secondary-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display">
            Welcome back, {profile?.name || "Alumni"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isAdmin ? "Admin overview" : "Here's what's happening in your JUIT network."}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="shadow-card border-border animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`p-2 rounded-md ${stat.cls}`}>
                  <stat.icon className="h-3.5 w-3.5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-display">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card className="shadow-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Update your profile", to: "/profile" },
                { label: "Browse alumni directory", to: "/directory" },
                { label: "View upcoming events", to: "/events" },
                { label: "Explore job opportunities", to: "/jobs" },
              ].map((action) => (
                <a key={action.to} href={action.to} className="flex items-center gap-3 p-3 rounded-md border border-border hover:bg-muted transition-colors text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {action.label}
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Profile Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Department", value: profile?.department },
                { label: "Graduation Year", value: profile?.graduation_year?.toString() },
                { label: "Company", value: profile?.company },
                { label: "Job Title", value: profile?.job_title },
                { label: "Location", value: profile?.location },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value || "—"}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
