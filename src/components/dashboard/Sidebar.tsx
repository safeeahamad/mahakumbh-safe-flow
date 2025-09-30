import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Video, 
  Map, 
  Bell, 
  Users, 
  FileText, 
  Settings,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'operator', 'public'] },
    { icon: Video, label: 'Live Cameras', path: '/dashboard/cameras', roles: ['admin', 'operator'] },
    { icon: Map, label: 'Heatmap View', path: '/dashboard/heatmap', roles: ['admin', 'operator', 'public'] },
    { icon: Bell, label: 'Alerts', path: '/dashboard/alerts', roles: ['admin', 'operator'] },
    { icon: Users, label: 'Staff Management', path: '/dashboard/staff', roles: ['admin'] },
    { icon: FileText, label: 'Reports', path: '/dashboard/reports', roles: ['admin'] },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user?.role || 'public'));

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-sm">Crowd Manager</h2>
            <p className="text-xs text-muted-foreground">Mahakumbh 2025</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                'hover:bg-sidebar-accent text-sidebar-foreground',
                isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {user?.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
