import React from "react";
import { NavLink } from "react-router-dom";
import { 
  Calendar, 
  MessageCircle, 
  Home,
  CreditCard, 
  BarChart3, 
  Package2, 
  Settings,
  Users,
  Lightbulb, // Added for insights
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
    title: "Appointments", 
    icon: Calendar, 
    path: "/appointments" 
  },
  { 
    title: "Communications", 
    icon: MessageCircle, 
    path: "/communications" 
  },
  { 
    title: "Patients", 
    icon: Users, 
    path: "/patients" 
  },
  { 
    title: "Billing", 
    icon: CreditCard, 
    path: "/billing" 
  },
  { 
    title: "Inventory", 
    icon: Package2, 
    path: "/inventory" 
  },
  { 
    title: "Analytics", 
    icon: BarChart3, 
    path: "/analytics" 
  },
  // Add insights link to the sidebar
  {
    title: "AI Insights",
    icon: Lightbulb,
    path: "/insights"
  }, 
  {
    title: "Document Reader",
    icon: Scan,
    path: "/upload"
  }
];

const AppSidebar = () => {
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
                    <NavLink 
                      to={link.path}
                      className={({ isActive }) => 
                        isActive ? "text-sidebar-primary" : "text-sidebar-foreground"
                      }
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
          <NavLink to="/settings">
            <Settings className="h-4 w-4 mr-2" />
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