import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, Building, Plus, Search, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Job = Tables<"jobs">;

export default function Jobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [form, setForm] = useState({ title: "", company: "", location: "", description: "", role_type: "" });

  const fetchJobs = async () => {
    setLoading(true);
    let q = supabase.from("jobs").select("*").order("created_at", { ascending: false });
    if (search) q = q.ilike("title", `%${search}%`);
    if (filterCompany) q = q.ilike("company", `%${filterCompany}%`);
    if (filterLocation) q = q.ilike("location", `%${filterLocation}%`);
    const { data } = await q;
    setJobs(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, [search, filterCompany, filterLocation]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("jobs").insert({
      title: form.title, company: form.company, location: form.location || null,
      description: form.description || null, role_type: form.role_type || null, posted_by: user!.id,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Job posted!" });
    setOpen(false);
    setForm({ title: "", company: "", location: "", description: "", role_type: "" });
    fetchJobs();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display">Job Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Opportunities from the JUIT network</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-navy text-primary-foreground" size="sm"><Plus className="h-4 w-4 mr-1.5" />Post Job</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Post a Job</DialogTitle></DialogHeader>
              <form onSubmit={handlePost} className="space-y-4">
                <div className="space-y-1.5"><Label className="text-xs">Job Title *</Label><Input value={form.title} onChange={(e) => setForm(f => ({...f, title: e.target.value}))} required /></div>
                <div className="space-y-1.5"><Label className="text-xs">Company *</Label><Input value={form.company} onChange={(e) => setForm(f => ({...f, company: e.target.value}))} required /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label className="text-xs">Location</Label><Input value={form.location} onChange={(e) => setForm(f => ({...f, location: e.target.value}))} /></div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Type</Label>
                    <Select value={form.role_type} onValueChange={(v) => setForm(f => ({...f, role_type: v}))}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} rows={4} /></div>
                <Button type="submit" className="w-full gradient-navy text-primary-foreground">Post Job</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Input placeholder="Company" value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} />
          <Input placeholder="Location" value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} />
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No jobs posted yet.</div>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job) => (
              <Card key={job.id} className="shadow-card border-border animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{job.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Building className="h-3 w-3" />{job.company}</span>
                        {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</span>
                      </div>
                      {job.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{job.description}</p>}
                    </div>
                    {job.role_type && <Badge variant="secondary" className="text-[10px] shrink-0">{job.role_type}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
