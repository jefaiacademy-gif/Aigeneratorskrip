import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const login = useAdminStore((s) => s.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(email, password)) setError('Invalid credentials. Try admin@frameforge.com / admin123');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#12121a]/80 backdrop-blur border border-[#27273a] rounded-2xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] flex items-center justify-center mb-3"><Shield size={28} className="text-white" /></div>
          <h1 className="text-xl font-bold text-white">FrameForge Admin</h1>
          <p className="text-xs text-[#9090a0] mt-1">Sign in to manage the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-xs text-[#9090a0] mb-1">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@frameforge.com" className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-4 py-3 text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#f59e0b] transition text-sm" /></div>
          <div>
            <label className="block text-xs text-[#9090a0] mb-1">Password</label>
            <div className="relative"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="admin123" className="w-full bg-[#0a0a0f] border border-[#27273a] rounded-lg px-4 py-3 pr-10 text-[#f0f0f5] placeholder-[#606070] focus:outline-none focus:border-[#f59e0b] transition text-sm" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#606070] hover:text-[#f0f0f5] transition">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white font-semibold hover:opacity-90 transition">Sign In</button>
        </form>

        <p className="text-center text-xs text-[#606070] mt-4">Demo: admin@frameforge.com / admin123</p>
      </motion.div>
    </div>
  );
}
