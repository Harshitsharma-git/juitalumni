import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import juitLogo from "@/assets/juit-logo.png";

const departments = [
  "Computer Science & Engineering", "Electronics & Communication", "Biotechnology",
  "Bioinformatics", "Civil Engineering", "Mathematics", "Physics", "Chemistry",
  "Humanities & Social Sciences", "Management", "Other"
];

export default function Signup() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", graduationYear: "", department: "", jobTitle: "", company: "", location: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name }, emailRedirectTo: window.location.origin },
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").update({
        name: form.name,
        graduation_year: form.graduationYear ? parseInt(form.graduationYear) : null,
        department: form.department || null,
        job_title: form.jobTitle || null,
        company: form.company || null,
        location: form.location || null,
      }).eq("user_id", data.user.id);
    }
    setLoading(false);
    toast({ title: "Account created!", description: "Check your email to verify." });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
      <Card className="w-full max-w-lg shadow-soft animate-fade-in border-border">
        <CardHeader className="text-center pb-4">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-2">
            <img src={juitLogo} alt="JUIT" className="h-12 w-12" />
          </Link>
          <CardTitle className="text-xl font-display">Join JUIT Alumni</CardTitle>
          <CardDescription className="text-xs">Create your alumni profile</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label className="text-xs">Full Name *</Label><Input value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Rahul Sharma" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Email *</Label><Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="you@juit.ac.in" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Password *</Label><Input type="password" value={form.password} onChange={(e) => update("password", e.target.value)} required placeholder="••••••••" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Graduation Year</Label><Input type="number" value={form.graduationYear} onChange={(e) => update("graduationYear", e.target.value)} placeholder="2020" min={2002} max={2030} /></div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Select value={form.department} onValueChange={(v) => update("department", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="text-xs">Job Title</Label><Input value={form.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Software Engineer" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Company</Label><Input value={form.company} onChange={(e) => update("company", e.target.value)} placeholder="Google" /></div>
              <div className="space-y-1.5"><Label className="text-xs">Location</Label><Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Bangalore" /></div>
            </div>
            <Button type="submit" className="w-full gradient-navy text-primary-foreground" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
