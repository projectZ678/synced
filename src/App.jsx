import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import EntryScreen from './components/EntryScreen';
import ProfileCard from './components/ProfileCard';
import Background from './components/Background';
import AudioPlayer from './components/AudioPlayer';
import CustomCursor from './components/CustomCursor';
import config from './data/config.json';

function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      <CustomCursor />
      <Background />
      
      <AnimatePresence>
        {!hasEntered && (
          <EntryScreen onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      <div className={`transition-all duration-1000 ease-in-out ${hasEntered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <ProfileCard />
        <AudioPlayer url={config.profile.audioUrl} autoPlay={hasEntered} />
      </div>
      
      {/* Glossy Overlay for the entire screen */}
      <div className="fixed inset-0 pointer-events-none border-[1px] border-white/5 z-[999]" />
    </div>
  );
}

export default App;
