import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, Briefcase, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Event = Tables<"events">;
type Job = Tables<"jobs">;

export default function AdminDashboard() {
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
    setAlumni(a ?? []); setEvents(e ?? []); setJobs(j ?? []);
    setStats({ alumni: ac ?? 0, events: ec ?? 0, jobs: jc ?? 0 });
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteEvent = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted" }); fetchAll();
  };

  const deleteJob = async (id: string) => {
    await supabase.from("jobs").delete().eq("id", id);
    toast({ title: "Job deleted" }); fetchAll();
  };

  const statCards = [
    { label: "Total Alumni", value: stats.alumni, icon: Users, cls: "gradient-navy text-primary-foreground" },
    { label: "Total Events", value: stats.events, icon: Calendar, cls: "bg-success text-success-foreground" },
    { label: "Jobs Posted", value: stats.jobs, icon: Briefcase, cls: "gradient-gold text-accent-foreground" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display">Admin Panel</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statCards.map((s) => (
            <Card key={s.label} className="shadow-card border-border animate-fade-in">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`p-2 rounded-md ${s.cls}`}><s.icon className="h-3.5 w-3.5" /></div>
              </CardHeader>
              <CardContent><p className="text-2xl font-display">{s.value}</p></CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-1 border-b border-border">
          {(["overview", "alumni", "events", "jobs"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${tab === t ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <Card className="shadow-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">Recent Alumni</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Year</TableHead><TableHead>Company</TableHead></TableRow></TableHeader>
                <TableBody>
                  {alumni.slice(0, 10).map((a) => (
                    <TableRow key={a.id}><TableCell className="font-medium text-sm">{a.name}</TableCell><TableCell className="text-sm">{a.department || "—"}</TableCell><TableCell className="text-sm">{a.graduation_year || "—"}</TableCell><TableCell className="text-sm">{a.company || "—"}</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tab === "alumni" && (
          <Card className="shadow-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">All Alumni ({stats.alumni})</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Department</TableHead><TableHead>Year</TableHead><TableHead>Company</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {alumni.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium text-sm">{a.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.email}</TableCell>
                      <TableCell className="text-sm">{a.department || "—"}</TableCell>
                      <TableCell className="text-sm">{a.graduation_year || "—"}</TableCell>
                      <TableCell className="text-sm">{a.company || "—"}</TableCell>
                      <TableCell><Badge variant={a.approved ? "default" : "secondary"} className="text-[10px]">{a.approved ? "Approved" : "Pending"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tab === "events" && (
          <Card className="shadow-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">All Events ({stats.events})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Date</TableHead><TableHead>Location</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {events.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium text-sm">{e.title}</TableCell>
                      <TableCell className="text-sm">{new Date(e.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm">{e.location || "—"}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => deleteEvent(e.id)} className="h-7 w-7 p-0"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {tab === "jobs" && (
          <Card className="shadow-card border-border">
            <CardHeader><CardTitle className="font-display text-lg">All Jobs ({stats.jobs})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Company</TableHead><TableHead>Location</TableHead><TableHead>Type</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {jobs.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium text-sm">{j.title}</TableCell>
                      <TableCell className="text-sm">{j.company}</TableCell>
                      <TableCell className="text-sm">{j.location || "—"}</TableCell>
                      <TableCell className="text-sm">{j.role_type || "—"}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => deleteJob(j.id)} className="h-7 w-7 p-0"><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button></TableCell>
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
