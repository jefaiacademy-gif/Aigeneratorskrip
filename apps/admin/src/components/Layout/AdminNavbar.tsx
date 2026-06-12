import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  LayoutDashboard,
  Key,
  Settings,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/api-keys', icon: Key, label: 'API Keys' },
  { to: '/engines', icon: Settings, label: 'Engines' },
  { to: '/users', icon: Users, label: 'Users' },
];

export default function AdminNavbar() {
  const location = useLocation();
  const logout = useAdminStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber" />
            <span className="font-semibold text-text-primary text-sm">FrameForge</span>
            <span className="text-[10px] font-bold bg-amber/10 text-amber px-1.5 py-0.5 rounded uppercase tracking-wide">
              Admin
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-border"
            >
              {navItems.map((item) => {
                const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? 'text-amber bg-amber/5 border-l-2 border-amber'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated border-l-2 border-transparent'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-red hover:bg-red/5 transition-colors w-full border-t border-border"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex fixed top-0 left-0 h-screen z-50 bg-bg-card/80 backdrop-blur-xl border-r border-border flex-col"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border shrink-0">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <Shield className="w-6 h-6 text-amber shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                >
                  <span className="font-bold text-text-primary text-sm">FrameForge</span>
                  <span className="text-[9px] font-bold bg-amber/10 text-amber px-1.5 py-0.5 rounded uppercase tracking-wide">
                    Admin
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-colors shrink-0"
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 space-y-1 overflow-hidden">
          {navItems.map((item) => {
            const isActive = currentPath === item.to || (item.to !== '/' && currentPath.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'text-amber'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-amber/5 rounded-lg border-l-2 border-amber"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px] shrink-0 relative z-10" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative z-10 whitespace-nowrap font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Admin + Logout */}
        <div className="shrink-0 border-t border-border p-3">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-red hover:bg-red/5 transition-all text-sm w-full"
          >
            <LogOut className="w-[18px] h-[18px] shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
