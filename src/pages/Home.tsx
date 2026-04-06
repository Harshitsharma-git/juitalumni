import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Briefcase, ArrowRight, MapPin } from "lucide-react";
import campusBg from "@/assets/juit-campus.jpg";
import juitLogo from "@/assets/juit-logo.png";

const stats = [
  { label: "Alumni Network", value: "5,000+" },
  { label: "Placed Students", value: "95%" },
  { label: "Events Hosted", value: "120+" },
  { label: "Companies Hiring", value: "350+" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-primary/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src={juitLogo} alt="JUIT" className="h-10 w-10" />
            <div className="hidden sm:block">
              <p className="font-display text-lg text-primary-foreground leading-tight">JUIT Alumni</p>
              <p className="text-[10px] text-primary-foreground/60 tracking-widest uppercase">Solan, Himachal Pradesh</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="gradient-gold text-accent-foreground font-semibold">
              <Link to="/signup">Join Network</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center pt-16">
        <img src={campusBg} alt="JUIT Campus, Solan" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 container">
          <div className="max-w-2xl animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs text-primary-foreground/70 tracking-widest uppercase">Waknaghat, Solan — Himachal Pradesh</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-primary-foreground leading-[1.1] mb-5">
              Where Alumni<br />
              <span className="text-accent italic">Stay Connected</span>
            </h1>
            <p className="text-base text-primary-foreground/70 max-w-lg mb-8 leading-relaxed">
              The official alumni platform of Jaypee University of Information Technology. Reconnect, network, and grow with your JUIT family.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gradient-gold text-accent-foreground font-semibold px-8">
                <Link to="/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-display text-accent">{stat.value}</p>
              <p className="text-xs text-primary-foreground/50 mt-1 tracking-wider uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 container">
        <div className="text-center mb-14">
          <p className="text-xs tracking-widest uppercase text-accent font-semibold mb-3">Platform</p>
          <h2 className="text-3xl md:text-4xl font-display">Everything You Need</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Alumni Directory", desc: "Search alumni by batch, department, or company. Build your professional network.", icon: Users },
            { title: "Events & Reunions", desc: "Stay updated on college events, webinars, and reunions. RSVP instantly.", icon: Calendar },
            { title: "Job Portal", desc: "Discover career opportunities posted by fellow JUIT alumni.", icon: Briefcase },
          ].map((f) => (
            <div key={f.title} className="group p-6 rounded-lg border border-border bg-card shadow-card hover:shadow-soft transition-shadow">
              <div className="w-10 h-10 rounded-md gradient-navy flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="font-display text-xl mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-navy">
        <div className="container text-center max-w-xl">
          <img src={juitLogo} alt="JUIT" className="h-16 w-16 mx-auto mb-6 opacity-60" />
          <h2 className="text-2xl md:text-3xl font-display text-primary-foreground mb-4">
            Join the JUIT Alumni Network
          </h2>
          <p className="text-sm text-primary-foreground/60 mb-8">
            Connect with thousands of JUIT graduates across the globe.
          </p>
          <Button asChild size="lg" className="gradient-gold text-accent-foreground font-semibold px-8">
            <Link to="/signup">Create Your Profile</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={juitLogo} alt="JUIT" className="h-6 w-6" />
            <span>Jaypee University of Information Technology, Solan</span>
          </div>
          <p>© {new Date().getFullYear()} JUIT Alumni Network</p>
        </div>
      </footer>
    </div>
  );
}
