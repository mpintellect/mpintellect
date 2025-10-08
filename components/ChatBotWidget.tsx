'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AiChatWidget from './AiChatWidget';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [autoOpened, setAutoOpened] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!autoOpened && window.scrollY > 100) {
        setAutoOpened(true);
        setTimeout(() => setIsOpen(true), 1500);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [autoOpened]);

  return (
    <>
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-6 right-6 z-[9999] bg-[#1a1b1f] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#2c2c2e]"
        >
          <img src="/icons/ai-logo.svg" alt="AI" className="w-5 h-5" />
          <span className="text-sm">Ask AI</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 z-[9999]"
          >
            <AiChatWidget />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}