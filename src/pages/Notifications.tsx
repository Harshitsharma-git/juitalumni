import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

type Notification = Tables<"notifications">;

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setNotifications(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, [user]);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    fetchNotifications();
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    fetchNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-1">{unreadCount} unread</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs">
              <Check className="h-3 w-3 mr-1" />Mark all read
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground text-sm">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => (
              <Card key={n.id} className={`shadow-card border-border transition-all ${!n.read ? "border-accent/30 bg-accent/5" : ""}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${!n.read ? "bg-accent" : "bg-muted"}`} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{n.title}</h3>
                    {n.message && <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>}
                    <p className="text-[10px] text-muted-foreground mt-1">{formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}</p>
                  </div>
                  {!n.read && (
                    <Button variant="ghost" size="sm" onClick={() => markRead(n.id)} className="shrink-0 h-7 w-7 p-0">
                      <Check className="h-3 w-3" />
                    </Button>
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
