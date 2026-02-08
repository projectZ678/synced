import React from 'react';
import { motion } from 'framer-motion';

const EntryScreen = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      onClick={onEnter}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <h1 className="text-white text-2xl font-light tracking-[0.5em] uppercase mb-4 animate-glow-pulse">
          synced.lat
        </h1>
        <p className="text-white/40 text-xs tracking-widest uppercase">
          Click anywhere to enter
        </p>
      </motion.div>
      
      {/* Animated subtle ring around text */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute w-64 h-64 border border-white/10 rounded-full"
      />
    </motion.div>
  );
};

export default EntryScreen;
