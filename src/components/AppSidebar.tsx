import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, Briefcase, User, Bell, LogOut, Shield, ChevronLeft, Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import juitLogo from "@/assets/juit-logo.png";

const alumniNav = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Directory", to: "/directory", icon: Users },
  { label: "Events", to: "/events", icon: Calendar },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
  { label: "My Profile", to: "/profile", icon: User },
  { label: "Notifications", to: "/notifications", icon: Bell },
];

const adminNav = [
  { label: "Admin Panel", to: "/admin", icon: Shield },
  { label: "Manage Events", to: "/admin/events", icon: Calendar },
  { label: "Manage Jobs", to: "/admin/jobs", icon: Briefcase },
  { label: "All Alumni", to: "/admin/alumni", icon: Users },
];

export default function AppSidebar() {
  const { isAdmin, signOut, profile } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = isAdmin ? [...adminNav, ...alumniNav] : alumniNav;

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center gap-3 px-4 bg-sidebar border-b border-sidebar-border">
        <button onClick={() => setCollapsed(!collapsed)} className="text-sidebar-foreground">
          <Menu className="h-5 w-5" />
        </button>
        <img src={juitLogo} alt="JUIT" className="h-7 w-7" />
        <span className="font-display text-sidebar-foreground">JUIT Alumni</span>
      </div>

      {/* Overlay */}
      {!collapsed && (
        <div className="lg:hidden fixed inset-0 z-40 bg-foreground/50" onClick={() => setCollapsed(true)} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300",
          collapsed ? "w-[60px]" : "w-60",
          "max-lg:translate-x-0",
          collapsed ? "max-lg:-translate-x-full" : "max-lg:translate-x-0",
          "lg:relative lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
          <img src={juitLogo} alt="JUIT" className="h-8 w-8 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-display text-base text-sidebar-foreground block leading-tight">JUIT Alumni</span>
              <span className="text-[9px] text-sidebar-foreground/40 tracking-wider uppercase">Solan, HP</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-sidebar-foreground/40 hover:text-sidebar-foreground hidden lg:block"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* User info */}
        {!collapsed && profile && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{profile.name || "User"}</p>
            <p className="text-[10px] text-sidebar-foreground/40 tracking-wider uppercase">{isAdmin ? "Admin" : "Alumni"}</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {isAdmin && !collapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold text-sidebar-foreground/30 uppercase tracking-widest">Admin</p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const isAdminItem = adminNav.some((a) => a.to === item.to);
            if (!isAdmin && isAdminItem) return null;
            if (isAdmin && item.to === alumniNav[0].to && !collapsed) {
              return (
                <div key="divider">
                  <div className="my-2 border-t border-sidebar-border" />
                  <p className="px-3 py-2 text-[10px] font-semibold text-sidebar-foreground/30 uppercase tracking-widest">General</p>
                  <NavItem key={item.to} item={item} isActive={isActive} collapsed={collapsed} onClick={() => setCollapsed(true)} />
                </div>
              );
            }
            return <NavItem key={item.to} item={item} isActive={isActive} collapsed={collapsed} onClick={() => setCollapsed(true)} />;
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent text-sm",
              collapsed && "justify-center px-2"
            )}
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Sign Out</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}

function NavItem({ item, isActive, collapsed, onClick }: { item: typeof alumniNav[0]; isActive: boolean; collapsed: boolean; onClick: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={() => { if (window.innerWidth < 1024) onClick(); }}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );
}
