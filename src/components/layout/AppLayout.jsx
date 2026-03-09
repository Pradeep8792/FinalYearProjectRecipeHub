import Navbar from './Navbar'
import Footer from './Footer'
import { motion, AnimatePresence } from 'framer-motion'

function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50 selection:bg-primary-100 selection:text-primary-900">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}

export default AppLayout
