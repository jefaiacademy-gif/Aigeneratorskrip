import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Key, Settings, Users, Shield, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'API Keys', path: '/api-keys', icon: Key },
  { label: 'Engines', path: '/engines', icon: Settings },
  { label: 'Users', path: '/users', icon: Users },
];

export default function AdminNavbar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const logout = useAdminStore((s) => s.logout);

  return (
    <div className={`${collapsed ? 'w-16' : 'w-60'} h-screen bg-[#0a0a0f] border-r border-[#27273a] flex flex-col transition-all duration-300 fixed left-0 top-0 z-40`}>
      <div className="flex items-center justify-between p-4 border-b border-[#27273a] h-16">
        {!collapsed && <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ec4899] flex items-center justify-center"><Shield size={16} className="text-white" /></div><span className="text-sm font-bold text-white">FrameForge</span></div>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-[#27273a] text-[#9090a0] transition ml-auto">{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${isActive ? 'bg-[#f59e0b]/10 text-[#f59e0b] border-l-2 border-[#f59e0b]' : 'text-[#9090a0] hover:text-white hover:bg-[#27273a]/50'}`}>
              <item.icon size={18} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-2 border-t border-[#27273a]">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#9090a0] hover:text-red-400 hover:bg-red-400/10 transition w-full"><LogOut size={18} />{!collapsed && <span className="text-sm font-medium">Logout</span>}</button>
      </div>
    </div>
  );
}
