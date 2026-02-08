"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { GlassCard } from "@/components/UI/GlassCard";
import { 
  Plus, 
  Trash2, 
  Save, 
  User, 
  Link as LinkIcon, 
  LogOut, 
  ExternalLink,
  Loader2,
  Globe
} from "lucide-react";

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  links: { id?: string; label: string; url: string }[];
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("/api/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile(data);
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(profile),
      headers: { "Content-Type": "application/json" },
    });
    setSaving(false);
  };

  const addLink = () => {
    if (!profile) return;
    setProfile({
      ...profile,
      links: [...profile.links, { label: "", url: "" }],
    });
  };

  const removeLink = (index: number) => {
    if (!profile) return;
    const newLinks = [...profile.links];
    newLinks.splice(index, 1);
    setProfile({ ...profile, links: newLinks });
  };

  const updateLink = (index: number, key: "label" | "url", value: string) => {
    if (!profile) return;
    const newLinks = [...profile.links];
    newLinks[index][key] = value;
    setProfile({ ...profile, links: newLinks });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tighter">synced.lol / dashboard</span>
          <div className="flex items-center space-x-4">
            <a 
              href={`/${profile?.username}`} 
              target="_blank"
              className="text-sm font-medium text-white/60 hover:text-white flex items-center"
            >
              View Profile <ExternalLink size={14} className="ml-1" />
            </a>
            <button 
              onClick={() => signOut()}
              className="p-2 text-white/60 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Profile Basic Info */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center space-x-2 mb-6 text-white/60">
              <User size={18} />
              <h2 className="font-bold uppercase tracking-widest text-xs">Profile Info</h2>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Display Name</label>
                  <input
                    value={profile?.displayName || ""}
                    onChange={(e) => setProfile({ ...profile!, displayName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm"
                    placeholder="Enter name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40">Avatar URL</label>
                  <input
                    value={profile?.avatarUrl || ""}
                    onChange={(e) => setProfile({ ...profile!, avatarUrl: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/40">Bio</label>
                <textarea
                  value={profile?.bio || ""}
                  rows={3}
                  onChange={(e) => setProfile({ ...profile!, bio: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm resize-none"
                  placeholder="Tell the world about yourself..."
                />
              </div>
            </div>
          </GlassCard>

          {/* Social Links */}
          <GlassCard className="p-6" hover={false}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2 text-white/60">
                <LinkIcon size={18} />
                <h2 className="font-bold uppercase tracking-widest text-xs">Social Links</h2>
              </div>
              <button 
                onClick={addLink}
                className="p-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                title="Add Link"
              >
                <Plus size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {profile?.links.map((link, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex-1 space-y-3">
                    <input
                      placeholder="Label (e.g. GitHub)"
                      value={link.label}
                      onChange={(e) => updateLink(idx, "label", e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-sm focus:border-white transition-colors"
                    />
                    <input
                      placeholder="URL (e.g. https://github.com/you)"
                      value={link.url}
                      onChange={(e) => updateLink(idx, "url", e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 pb-1 text-sm text-white/60 focus:border-white transition-colors"
                    />
                  </div>
                  <button 
                    onClick={() => removeLink(idx)}
                    className="text-white/20 hover:text-red-400 transition-colors pt-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              {profile?.links.length === 0 && (
                <div className="text-center py-10 text-white/20 text-sm italic">
                  No links added yet. Click the + to add one.
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <GlassCard className="p-6 sticky top-24" hover={false}>
            <h3 className="font-bold mb-4 flex items-center">
              <Globe size={16} className="mr-2 text-violet-400" /> Live Preview
            </h3>
            <div className="aspect-[9/16] bg-black rounded-3xl border-8 border-white/5 overflow-hidden relative shadow-2xl">
              <div className="p-4 flex flex-col items-center pt-10">
                <div className="w-16 h-16 rounded-full bg-white/5 mb-4 border border-white/10 overflow-hidden">
                  {profile?.avatarUrl && <img src={profile.avatarUrl} className="w-full h-full object-cover" />}
                </div>
                <div className="text-xs font-bold">{profile?.displayName || "@username"}</div>
                <div className="text-[10px] text-white/40 mb-4 line-clamp-1">{profile?.bio || "No bio set"}</div>
                <div className="w-full space-y-2">
                  {profile?.links.map((l, i) => (
                    <div key={i} className="w-full h-8 bg-white/10 rounded-md border border-white/5 flex items-center px-4 text-[10px] font-medium animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="w-full py-4 mt-8 bg-white text-black font-bold rounded-xl flex items-center justify-center space-x-2 hover:bg-white/90 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
            </button>
          </GlassCard>
        </div>
      </main>
    </div>
  );
}
