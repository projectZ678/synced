import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

const AudioPlayer = ({ url, autoPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked by browser");
      });
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      <audio ref={audioRef} src={url} loop />
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="glass p-3 rounded-full flex items-center gap-3 group"
      >
        <div className="relative">
          {isPlaying ? (
            <div className="flex gap-[2px] h-4 items-center px-1">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                  className="w-[2px] bg-white"
                />
              ))}
            </div>
          ) : (
            <Music size={18} className="text-white/60" />
          )}
        </div>
        
        <span className="text-[10px] uppercase tracking-widest overflow-hidden max-w-0 group-hover:max-w-[100px] transition-all duration-500 whitespace-nowrap">
          {isPlaying ? "Playing Audio" : "Music Paused"}
        </span>
        
        {isPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </motion.button>
    </div>
  );
};

export default AudioPlayer;
