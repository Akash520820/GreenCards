import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SellerSidebar from '../SellerSidebar';
import SellerMobileNavbar from '../SellerMobileNavbar';
import './SellerAppLayout.css';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
};

const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const SellerAppLayout = () => {
  const location = useLocation();
  const outlet = useOutlet();
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="seller-layout-wrapper">
      {/* Desktop Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <div className="seller-layout-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={shouldReduceMotion ? reducedVariants : pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navbar (only visible on mobile) */}
      <SellerMobileNavbar />
    </div>
  );
};

export default SellerAppLayout;
