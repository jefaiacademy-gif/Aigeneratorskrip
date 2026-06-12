import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hexagon,
  Wand2,
  Film,
  Library,
  History,
  UserCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

const tabs = [
  { id: 'generate', label: 'Generate', icon: Wand2 },
  { id: 'storyboard', label: 'Storyboard', icon: Film },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'history', label: 'History', icon: History },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { activeTab, setActiveTab, user, logout } = useStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 h-16 flex-shrink-0 bg-bg-card/60 backdrop-blur-xl border-b border-border">
      <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 mr-8"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
          >
            <Hexagon className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold">
            <span className="text-white">Frame</span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #a855f7)' }}
            >
              Forge
            </span>
          </span>
        </motion.div>

        {/* Tabs */}
        <div className="flex items-center gap-1 relative">
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-cyan'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg bg-cyan/10 border border-cyan/30"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* User dropdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative ml-4"
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-bg-elevated/50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan to-purple flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:block text-sm text-text-primary">
              {user?.name || 'User'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-text-muted transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div className="fixed inset-0" onClick={() => setDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 glass-card overflow-hidden"
                  style={{ zIndex: 100 }}
                >
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-text-muted truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-pink hover:bg-pink/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </nav>
  );
}
