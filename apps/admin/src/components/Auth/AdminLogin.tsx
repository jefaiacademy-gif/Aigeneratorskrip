import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, Zap } from 'lucide-react';
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
    const success = login(email, password);
    if (!success) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink/5 rounded-full blur-[128px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber/10 border border-amber/20 mb-4"
          >
            <Shield className="w-8 h-8 text-amber" />
          </motion.div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">
            FrameForge <span className="text-amber">Admin</span>
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Secure administration panel
          </p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@frameforge.com"
                className="w-full px-4 py-2.5 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 transition-all text-sm"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg bg-bg-primary border border-border text-text-primary placeholder:text-text-muted focus:border-amber focus:ring-1 focus:ring-amber/20 transition-all text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red text-sm flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-lg font-medium text-sm text-bg-primary transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
              }}
            >
              Sign In
            </motion.button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-text-muted text-center">
              Demo credentials:{" "}
              <span className="text-amber font-medium">admin@frameforge.com</span>
              {" / "}
              <span className="text-amber font-medium">admin123</span>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
