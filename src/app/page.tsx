import Link from "next/link";
import { GlassCard } from "@/components/UI/GlassCard";
import { Sparkles, ArrowRight, Shield, Zap, Layout } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />

      <div className="z-10 text-center max-w-3xl">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 mb-8">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm font-medium">Reimagined Linking</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
          synced.lol
        </h1>
        
        <p className="text-lg md:text-xl text-white/50 mb-10 max-w-xl mx-auto leading-relaxed">
          The ultimate black glossy link-in-bio platform for curators, creators, and developers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/signup">
            <button className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all flex items-center space-x-2 group">
              <span>Get Started</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/login">
            <button className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
              Login to Dashboard
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-left" hover={false}>
            <Zap className="text-violet-400 mb-4" />
            <h3 className="font-bold mb-2">Ultra Fast</h3>
            <p className="text-sm text-white/50">Built on Next.js 14 for lightning-quick loading times across the globe.</p>
          </GlassCard>
          <GlassCard className="p-6 text-left" hover={false}>
            <Layout className="text-blue-400 mb-4" />
            <h3 className="font-bold mb-2">Glossy UI</h3>
            <p className="text-sm text-white/50">Beautiful glassmorphism design that looks premium out of the box.</p>
          </GlassCard>
          <GlassCard className="p-6 text-left" hover={false}>
            <Shield className="text-emerald-400 mb-4" />
            <h3 className="font-bold mb-2">Zero Tracking</h3>
            <p className="text-sm text-white/50">Privacy focused. We don't sell your data or track your visitors.</p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
