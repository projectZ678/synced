import { prisma } from "@/lib/db";
import { GlassCard } from "@/components/UI/GlassCard";
import { notFound } from "next/navigation";
import { Globe, ArrowUpRight } from "lucide-react";

export default async function PublicProfile({ params }: { params: { username: string } }) {
  const profile = await prisma.profile.findUnique({
    where: { username: params.username },
    include: { links: true }
  });

  if (!profile) notFound();

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-4 relative overflow-hidden">
      {/* Background Radial Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 blur-[120px] rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />

      <div className="max-w-md w-full flex flex-col items-center space-y-8 z-10 animate-in fade-in duration-1000">
        <div className="relative group">
          <div className="absolute -inset-1.5 bg-gradient-to-t from-white/20 to-transparent rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
          <div className="relative w-28 h-28 rounded-full bg-white/5 border border-white/20 overflow-hidden shadow-2xl">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5 text-white/20">
                <Globe size={40} />
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-white text-glow">
            {profile.displayName || profile.username}
          </h1>
          <p className="text-white/40 font-mono text-sm tracking-widest uppercase">
            synced.lol / {profile.username}
          </p>
          {profile.bio && (
            <p className="mt-4 text-white/60 leading-relaxed font-medium">
              {profile.bio}
            </p>
          )}
        </div>

        <div className="w-full space-y-4">
          {profile.links.map((link) => (
            <a 
              key={link.id} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group"
            >
              <GlassCard className="flex items-center justify-between p-5 hover:border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 rounded-xl bg-white/5 group-hover:bg-white/10 transition-all border border-white/5">
                     <Globe size={20} className="text-white/80 group-hover:text-white" />
                  </div>
                  <span className="font-semibold text-white/90 group-hover:text-white transition-all text-lg tracking-tight">
                    {link.label}
                  </span>
                </div>
                <ArrowUpRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </GlassCard>
            </a>
          ))}
          
          {profile.links.length === 0 && (
            <div className="text-center py-20 text-white/20 italic">
              User hasn't synced any links yet.
            </div>
          )}
        </div>

        <div className="pt-20">
          <a 
            href="/" 
            className="text-[10px] tracking-widest uppercase font-bold text-white/20 hover:text-white transition-colors"
          >
            Create your own synced.lol
          </a>
        </div>
      </div>
    </main>
  );
}
