import React from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import config from '../data/config.json';

const ProfileCard = () => {
  const { profile, socials } = config;

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-3xl p-8 md:p-12 w-[90%] max-w-[450px] flex flex-col items-center text-center relative overflow-hidden"
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-white/20 blur-xl" />

      {/* Avatar */}
      <motion.div variants={itemVariants} className="relative group mb-6">
        <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-500" />
        <img 
          src={profile.avatar} 
          alt={profile.username}
          className="w-24 h-24 rounded-full object-cover relative z-10 border-2 border-white/10"
        />
      </motion.div>

      {/* Info */}
      <motion.h1 variants={itemVariants} className="text-3xl font-bold tracking-tight mb-1">
        {profile.username}
      </motion.h1>
      
      <motion.p variants={itemVariants} className="text-white/40 text-sm tracking-[0.2em] uppercase mono mb-4">
        {profile.tagline}
      </motion.p>
      
      <motion.p variants={itemVariants} className="text-white/70 text-sm leading-relaxed mb-8 max-w-[300px]">
        {profile.bio}
      </motion.p>

      {/* Social Links */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 w-full gap-3">
        {socials.map((link, index) => {
          const IconComponent = LucideIcons[link.icon];
          return (
            <motion.a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 5 }}
              className="glass glass-hover p-4 rounded-xl flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors">
                  {IconComponent && <IconComponent size={18} />}
                </div>
                <span className="text-sm font-medium tracking-wide">{link.label}</span>
              </div>
              <LucideIcons.ArrowUpRight size={16} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
            </motion.a>
          );
        })}
      </motion.div>

      {/* Footer Branding */}
      <motion.div variants={itemVariants} className="mt-8 flex items-center gap-2 opacity-30 hover:opacity-100 transition-opacity cursor-default">
         <span className="text-[10px] tracking-[0.3em] uppercase mono">Powered by synced.lat</span>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
