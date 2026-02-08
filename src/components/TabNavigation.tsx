import { NavLink } from "react-router-dom";
import { Home, MessageCircle, MapPin, Globe } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/chatbot", label: "Chatbot", icon: MessageCircle },
  { to: "/region", label: "Current Region", icon: MapPin },
  { to: "/world", label: "World", icon: Globe },
];

const TabNavigation = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel">
      <div className="container flex items-center justify-between py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">H+</span>
          </div>
          <span className="font-semibold text-lg text-foreground tracking-tight">HealthScope</span>
        </div>
        <nav className="flex items-center gap-1">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default TabNavigation;
