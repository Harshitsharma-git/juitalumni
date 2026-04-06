import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Briefcase, TrendingUp, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Event = Tables<"events">;
type Job = Tables<"jobs">;

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ alumni: 0, events: 0, jobs: 0 });
  const [alumni, setAlumni] = useState<Profile[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tab, setTab] = useState<"overview" | "alumni" | "events" | "jobs">("overview");

  const fetchAll = async () => {
    const [{ data: a, count: ac }, { data: e, count: ec }, { data: j, count: jc }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      supabase.from("events").select("*", { count: "exact" }).order("date", { ascending: false }),
      supabase.from("jobs").select("*", { count: "exact" }).order("created_at", { ascending: false }),
    ]);
    setAlumni(a ?? []);
    setEvents(e ?? []);
    setJobs(j ?? []);
    setStats({ alumni: ac ?? 0, events: ec ?? 0, jobs: jc ?? 0 });
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted" });
    fetchAll();
  };

  const deleteJob = async (id: string) => {
    await supabase.from("jobs").delete().eq("id", id);
    toast({ title: "Job deleted" });
    fetchAll();
  };

  const statCards = [
    { label: "Total Alumni", value: stats.alumni, icon: Users, color: "gradient-primary" },
    { label: "Total Events", value: stats.events, icon: Calendar, color: "bg-success" },
    { label: "Jobs Posted", value: stats.jobs, icon: Briefcase, color: "bg-accent" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold">Admin Panel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="shadow-soft animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`p-2 rounded-lg ${s.color}`}><s.icon className="h-4 w-4 text-primary-foreground" /></div>
              </CardHeader>
              <CardContent><p className="text-3xl font-display font-bold">{s.value}</p></CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {(["overview", "alumni", "events", "jobs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="font-display">Recent Alumni</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Year</TableHead><TableHead>Company</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alumni.slice(0, 10).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.department || "-"}</TableCell>
                      <TableCell>{a.graduation_year || "-"}</TableCell>
                      <TableCell>{a.company || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tab === "alumni" && (
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="font-display">All Alumni ({stats.alumni})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead><TableHead>Year</TableHead><TableHead>Company</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alumni.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell className="text-muted-foreground">{a.email}</TableCell>
                      <TableCell>{a.department || "-"}</TableCell>
                      <TableCell>{a.graduation_year || "-"}</TableCell>
                      <TableCell>{a.company || "-"}</TableCell>
                      <TableCell>{a.location || "-"}</TableCell>
                      <TableCell><Badge variant={a.approved ? "default" : "secondary"}>{a.approved ? "Approved" : "Pending"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tab === "events" && (
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="font-display">All Events ({stats.events})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Location</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.title}</TableCell>
                      <TableCell>{new Date(e.date).toLocaleDateString()}</TableCell>
                      <TableCell>{e.location || "-"}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => deleteEvent(e.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tab === "jobs" && (
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="font-display">All Jobs ({stats.jobs})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead><TableHead>Company</TableHead><TableHead>Location</TableHead><TableHead>Type</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.title}</TableCell>
                      <TableCell>{j.company}</TableCell>
                      <TableCell>{j.location || "-"}</TableCell>
                      <TableCell>{j.role_type || "-"}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => deleteJob(j.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
