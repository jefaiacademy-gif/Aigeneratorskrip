import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hexagon,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../../hooks/useStore';

export default function LoginSignup() {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      if (!form.name || !form.email || !form.password || !form.confirm) {
        setError('Please fill in all fields');
        return;
      }
      if (form.password !== form.confirm) {
        setError('Passwords do not match');
        return;
      }
      // For demo, just login with demo credentials
      if (login('demo@frameforge.com', 'demo123')) {
        navigate('/');
      }
      return;
    }

    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }

    const success = login(form.email, form.password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Try demo@frameforge.com / demo123');
    }
  };

  const fillDemo = () => {
    setForm({ ...form, email: 'demo@frameforge.com', password: 'demo123' });
    setError('');
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left Panel - Branding */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #12121a 50%, #1a1030 100%)',
        }}
      >
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.2) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 text-center px-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
            }}
          >
            <Hexagon className="w-10 h-10 text-white" strokeWidth={2} />
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-bold mb-4"
          >
            <span className="text-white">Frame</span>
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #a855f7)' }}
            >
              Forge
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-text-secondary mb-8"
          >
            Create anything with AI
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex items-center justify-center gap-2 text-text-muted"
          >
            <Sparkles className="w-4 h-4 text-cyan" />
            <span>Video generation</span>
            <span className="mx-2">&middot;</span>
            <span>Image creation</span>
            <span className="mx-2">&middot;</span>
            <span>Storyboarding</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bg-primary">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)' }}
            >
              <Hexagon className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-white">Frame</span>
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #00d4ff, #a855f7)' }}
              >
                Forge
              </span>
            </span>
          </div>

          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-text-secondary mb-8">
            {isSignup
              ? 'Sign up to start creating with AI'
              : 'Sign in to your FrameForge account'}
          </p>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-4 p-3 rounded-lg bg-pink/10 border border-pink/30 text-pink text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  key="name-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-11 py-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
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

            <AnimatePresence mode="wait">
              {isSignup && (
                <motion.div
                  key="confirm-field"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.confirm}
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg bg-bg-card border border-border text-text-primary placeholder-text-muted focus:border-cyan transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-shadow"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #a855f7)',
              }}
            >
              {isSignup ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Demo hint */}
          {!isSignup && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={fillDemo}
              className="w-full mt-4 p-3 rounded-lg bg-cyan/5 border border-cyan/20 text-cyan text-sm hover:bg-cyan/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                Try demo@frameforge.com / demo123
              </span>
            </motion.button>
          )}

          <p className="mt-6 text-center text-text-secondary text-sm">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-cyan hover:underline font-medium"
            >
              {isSignup ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
