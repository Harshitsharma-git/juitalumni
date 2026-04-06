import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Calendar, Briefcase, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stats = [
  { label: "Alumni Registered", value: "5,000+", icon: Users },
  { label: "Events Hosted", value: "120+", icon: Calendar },
  { label: "Jobs Posted", value: "350+", icon: Briefcase },
  { label: "Departments", value: "25+", icon: GraduationCap },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Graduation ceremony" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 mb-6">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
            <span className="text-sm font-medium text-primary-foreground">Welcome to AlumniConnect</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
            Stay Connected,<br />
            <span className="text-accent">Stay Ahead</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            The premier platform for alumni to network, discover opportunities, and stay connected with your alma mater.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-primary text-lg px-8 py-6 shadow-glow">
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card border-y border-border">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary mb-3">
                <stat.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 container">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Everything You Need</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Connect with fellow alumni, explore job opportunities, attend events, and grow your professional network.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Alumni Directory", desc: "Search and connect with thousands of alumni by batch, department, or company.", icon: Users },
            { title: "Events & Reunions", desc: "Stay updated on upcoming events, webinars, and reunions. RSVP in one click.", icon: Calendar },
            { title: "Job Portal", desc: "Discover career opportunities posted by fellow alumni and industry partners.", icon: Briefcase },
          ].map((f) => (
            <div key={f.title} className="gradient-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-glow transition-shadow">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg gradient-primary mb-4">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-display font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
      </footer>
    </div>
  );
}
