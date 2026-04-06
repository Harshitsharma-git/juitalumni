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
import { Calendar, MapPin, Plus, Users, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

export default function Events() {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [rsvps, setRsvps] = useState<Record<string, string>>({});
  const [rsvpCounts, setRsvpCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "" });

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true });
    setEvents(data ?? []);
    if (user) {
      const { data: userRsvps } = await supabase.from("event_rsvps").select("*").eq("user_id", user.id);
      const rsvpMap: Record<string, string> = {};
      userRsvps?.forEach((r) => { rsvpMap[r.event_id] = r.status; });
      setRsvps(rsvpMap);
    }
    const { data: allRsvps } = await supabase.from("event_rsvps").select("event_id, status").eq("status", "going");
    const counts: Record<string, number> = {};
    allRsvps?.forEach((r) => { counts[r.event_id] = (counts[r.event_id] || 0) + 1; });
    setRsvpCounts(counts);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("events").insert({
      title: form.title, description: form.description, date: new Date(form.date).toISOString(),
      location: form.location, created_by: user!.id,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Event created!" });
    setOpen(false);
    setForm({ title: "", description: "", date: "", location: "" });
    fetchEvents();
  };

  const handleRsvp = async (eventId: string, status: string) => {
    if (rsvps[eventId]) {
      await supabase.from("event_rsvps").update({ status }).eq("event_id", eventId).eq("user_id", user!.id);
    } else {
      await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user!.id, status });
    }
    setRsvps((prev) => ({ ...prev, [eventId]: status }));
    fetchEvents();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display">Events</h1>
            <p className="text-sm text-muted-foreground mt-1">Reunions, webinars & workshops</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-navy text-primary-foreground" size="sm"><Plus className="h-4 w-4 mr-1.5" />Create</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">New Event</DialogTitle></DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={form.title} onChange={(e) => setForm(f => ({...f, title: e.target.value}))} required /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={form.description} onChange={(e) => setForm(f => ({...f, description: e.target.value}))} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Date & Time</Label><Input type="datetime-local" value={form.date} onChange={(e) => setForm(f => ({...f, date: e.target.value}))} required /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Location</Label><Input value={form.location} onChange={(e) => setForm(f => ({...f, location: e.target.value}))} /></div>
                  <Button type="submit" className="w-full gradient-navy text-primary-foreground">Create Event</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">No events yet.</div>
        ) : (
          <div className="grid gap-3">
            {events.map((event) => {
              const isPast = new Date(event.date) < new Date();
              return (
                <Card key={event.id} className="shadow-card border-border animate-fade-in">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 rounded-md gradient-navy flex flex-col items-center justify-center text-primary-foreground">
                        <span className="text-[10px] font-medium uppercase">{format(new Date(event.date), "MMM")}</span>
                        <span className="text-lg font-display leading-none">{format(new Date(event.date), "dd")}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">{event.title}</h3>
                          {isPast && <Badge variant="secondary" className="text-[10px]">Past</Badge>}
                        </div>
                        {event.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{event.description}</p>}
                        <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(event.date), "PPp")}</span>
                          {event.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>}
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{rsvpCounts[event.id] || 0} going</span>
                        </div>
                      </div>
                      {!isPast && (
                        <div className="flex gap-2 shrink-0">
                          <Button size="sm" variant={rsvps[event.id] === "going" ? "default" : "outline"} onClick={() => handleRsvp(event.id, "going")}
                            className={rsvps[event.id] === "going" ? "gradient-gold text-accent-foreground" : ""}>
                            <Check className="h-3 w-3 mr-1" />Going
                          </Button>
                          <Button size="sm" variant={rsvps[event.id] === "not_going" ? "destructive" : "outline"} onClick={() => handleRsvp(event.id, "not_going")}>
                            <X className="h-3 w-3 mr-1" />Can't
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
