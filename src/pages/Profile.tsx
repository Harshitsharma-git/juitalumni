import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const departments = ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Arts & Humanities", "Medicine", "Law", "Science", "Other"];

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: profile?.name ?? "",
    bio: profile?.bio ?? "",
    graduation_year: profile?.graduation_year?.toString() ?? "",
    department: profile?.department ?? "",
    job_title: profile?.job_title ?? "",
    company: profile?.company ?? "",
    location: profile?.location ?? "",
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      name: form.name,
      bio: form.bio || null,
      graduation_year: form.graduation_year ? parseInt(form.graduation_year) : null,
      department: form.department || null,
      job_title: form.job_title || null,
      company: form.company || null,
      location: form.location || null,
    }).eq("user_id", user!.id);
    setSaving(false);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Profile updated!" });
    refreshProfile();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (upErr) { toast({ title: "Upload failed", description: upErr.message, variant: "destructive" }); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ profile_image: publicUrl }).eq("user_id", user.id);
    setUploading(false);
    toast({ title: "Photo updated!" });
    refreshProfile();
  };

  const initials = profile?.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-display font-bold">My Profile</h1>

        {/* Avatar */}
        <Card className="shadow-soft">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={profile?.profile_image ?? undefined} />
                <AvatarFallback className="gradient-primary text-primary-foreground font-display text-xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 rounded-full gradient-primary text-primary-foreground shadow-soft"
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg">{profile?.name || "Your Name"}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Form */}
        <Card className="shadow-soft">
          <CardHeader><CardTitle className="font-display">Edit Profile</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
                <div className="space-y-2"><Label>Graduation Year</Label><Input type="number" value={form.graduation_year} onChange={(e) => update("graduation_year", e.target.value)} min={1950} max={2030} /></div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select value={form.department} onValueChange={(v) => update("department", v)}>
                    <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                    <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Job Title</Label><Input value={form.job_title} onChange={(e) => update("job_title", e.target.value)} /></div>
                <div className="space-y-2"><Label>Company</Label><Input value={form.company} onChange={(e) => update("company", e.target.value)} /></div>
                <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} placeholder="Tell us about yourself..." /></div>
              <Button type="submit" className="gradient-primary" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
