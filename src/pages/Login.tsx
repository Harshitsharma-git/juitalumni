import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import juitLogo from "@/assets/juit-logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<"alumni" | "admin">("alumni");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // If admin tab selected, verify the user actually has admin role
    if (loginType === "admin" && data.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      const isAdmin = roles?.some((r) => r.role === "admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast({
          title: "Access denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate(loginType === "admin" ? "/admin" : "/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-sm shadow-soft animate-fade-in border-border">
        <CardHeader className="text-center pb-4">
          <Link to="/" className="inline-flex items-center justify-center gap-3 mb-2">
            <img src={juitLogo} alt="JUIT" className="h-12 w-12" />
          </Link>
          <CardTitle className="text-xl font-display">Welcome Back</CardTitle>
          <CardDescription className="text-xs">Sign in to JUIT Alumni Network</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={(v) => setLoginType(v as "alumni" | "admin")} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alumni" className="flex items-center gap-1.5 text-xs">
                <GraduationCap className="h-3.5 w-3.5" />
                Alumni
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={loginType === "admin" ? "admin@juit.ac.in" : "you@juit.ac.in"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full gradient-navy text-primary-foreground" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : loginType === "admin" ? (
                "Sign In as Admin"
              ) : (
                "Sign In as Alumni"
              )}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
