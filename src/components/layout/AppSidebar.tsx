
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Calendar, 
  MessageCircle, 
  Home,
  CreditCard, 
  BarChart3, 
  Package2, 
  Settings,
  Users,
  Lightbulb,
  FileText,
  Newspaper,
  Scan
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader, 
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const NavLinks = [
  { 
    title: "Dashboard", 
    icon: Home, 
    path: "/" 
  },

  { 
    title: "Patients", 
    icon: Users, 
    path: "/patients" 
  },
  { 
    title: "Appointments", 
    icon: Calendar, 
    path: "/appointments" 
  },
  {
    title: "Consultations",
    icon: FileText,
    path: "https://hospiscribe.minusonetoten.com/consultation/new",
    external: true
  },
  { 
    title: "Communications", 
    icon: MessageCircle, 
    path: "/communications" 
  },
  { 
    title: "Analytics", 
    icon: BarChart3, 
    path: "/analytics" 
  },
  {
    title: "AI Insights",
    icon: Lightbulb,
    path: "/insights"
  }, 
  {
    title: "Medical Research",
    icon: Newspaper,
    path: "https://medsearch.minusonetoten.com/",
    external: true
  },
  { 
    title: "Inventory", 
    icon: Package2, 
    path: "/inventory" 
  },
  { 
    title: "Billing", 
    icon: CreditCard, 
    path: "/billing" 
  },
  {
    title: "Medical Document Analysis",
    icon: Scan,
    path: "/upload"
  }
];

const AppSidebar = () => {
  const location = useLocation();
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-primary flex items-center justify-center w-8 h-8 rounded-md">
            <span className="text-primary-foreground font-bold">H</span>
          </div>
          <h1 className="text-lg font-bold">HospiAgent</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NavLinks.map((link) => (
                <SidebarMenuItem key={link.path}>
                  <SidebarMenuButton asChild>
                    {link.external ? (
                      <a 
                        href={link.path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-hover"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.title}</span>
                      </a>
                    ) : (
                      <NavLink 
                        to={link.path}
                        className={({ isActive }) => 
                          isActive 
                            ? "flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/10 text-primary font-medium"
                            : "flex items-center gap-2 px-2 py-1.5 rounded-md text-sidebar-foreground hover:bg-sidebar-hover"
                        }
                      >
                        <link.icon className={`h-4 w-4 ${location.pathname === link.path ? 'text-primary' : ''}`} />
                        <span>{link.title}</span>
                      </NavLink>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              isActive 
                ? "text-primary font-medium"
                : ""
            }
          >
            <Settings className={`h-4 w-4 mr-2 ${location.pathname === '/settings' ? 'text-primary' : ''}`} />
            Settings
          </NavLink>
        </Button>
        <p className="text-xs text-sidebar-foreground/70 mt-4 px-2">
          HospiAgent v1.0
        </p>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
