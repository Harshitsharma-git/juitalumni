import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building, GraduationCap } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

const departments = ["All", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Business Administration", "Arts & Humanities", "Medicine", "Law", "Science", "Other"];

export default function Directory() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [year, setYear] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let q = supabase.from("profiles").select("*").eq("approved", true).order("name");
      if (search) q = q.ilike("name", `%${search}%`);
      if (department !== "All") q = q.eq("department", department);
      if (year) q = q.eq("graduation_year", parseInt(year));
      if (company) q = q.ilike("company", `%${company}%`);
      const { data } = await q;
      setProfiles(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [search, department, year, company]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Alumni Directory</h1>
          <p className="text-muted-foreground mt-1">Find and connect with fellow alumni</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Graduation year" type="number" value={year} onChange={(e) => setYear(e.target.value)} min={1950} max={2030} />
          <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading alumni...</div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No alumni found matching your filters.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((p) => (
              <Card key={p.id} className="shadow-soft hover:shadow-glow transition-all animate-fade-in">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border-2 border-primary/20">
                      <AvatarImage src={p.profile_image ?? undefined} />
                      <AvatarFallback className="gradient-primary text-primary-foreground font-display font-bold">
                        {p.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold truncate">{p.name}</h3>
                      {p.job_title && <p className="text-sm text-muted-foreground truncate">{p.job_title}</p>}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    {p.company && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{p.company}</span>
                      </div>
                    )}
                    {p.location && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{p.location}</span>
                      </div>
                    )}
                    {p.graduation_year && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                        <span>Class of {p.graduation_year}</span>
                      </div>
                    )}
                  </div>
                  {p.department && (
                    <Badge variant="secondary" className="mt-3">{p.department}</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
