import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const menuVariants = {
  closed: {
    opacity: 0,
    y: "-100%",
    transition: {
      duration: 0.3,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05,
      staggerDirection: 1
    }
  }
};

const itemVariants = {
  closed: {
    opacity: 0,
    y: 20
  },
  open: {
    opacity: 1,
    y: 0
  }
};

export default function MobileMenu({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="closed"
          animate="open"
          exit="closed"
          variants={menuVariants}
          className="fixed inset-0 bg-black/80 z-50 flex flex-col"
        >
          <div className="flex justify-end p-6">
            <button
              onClick={onClose}
              className="w-11 h-11 flex items-center justify-center text-white"
              aria-label="Close menu"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-grow flex flex-col items-center justify-center gap-8">
            <motion.div variants={itemVariants}>
              <a 
                href="#platforms" 
                onClick={onClose}
                className="text-white text-xl hover:text-accent transition-colors"
              >
                Platforms
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link 
                to="/pricing" 
                onClick={onClose}
                className="text-white text-xl hover:text-accent transition-colors"
              >
                Pricing
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <a 
                href="https://socialflip.io/blog/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white text-xl hover:text-accent transition-colors"
              >
                Blog
              </a>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link 
                to="/signin" 
                onClick={onClose}
                className="text-white text-xl hover:text-accent transition-colors"
              >
                Login
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <span className="bg-gradient-to-r from-accent to-blue-600 text-transparent bg-clip-text font-bold text-xl">
                beta v1
              </span>
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}