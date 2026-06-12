import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../hooks/useStore';
import Navbar from '../components/Layout/Navbar';
import EnginePicker from '../components/EnginePicker/EnginePicker';
import PromptBuilder from '../components/PromptBuilder/PromptBuilder';
import Storyboard from '../components/Storyboard/Storyboard';
import Library from '../components/Library/Library';
import History from '../components/History/History';
import UserDashboard from '../components/Dashboard/UserDashboard';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function MainLayout() {
  const { activeTab } = useStore();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return <PromptBuilder key="generate" />;
      case 'storyboard':
        return <Storyboard key="storyboard" />;
      case 'library':
        return <Library key="library" />;
      case 'history':
        return <History key="history" />;
      case 'profile':
        return <UserDashboard key="profile" />;
      default:
        return <PromptBuilder key="default" />;
    }
  };

  const showEnginePicker = activeTab === 'generate';

  return (
    <div className="h-screen w-full flex flex-col bg-bg-primary overflow-hidden">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Engine Picker Sidebar - only on generate tab */}
        <AnimatePresence mode="wait">
          {showEnginePicker && (
            <motion.div
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex-shrink-0 overflow-hidden"
            >
              <EnginePicker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
