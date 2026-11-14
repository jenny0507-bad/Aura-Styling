import React from 'react';
import { Plus, Sparkles, User, Calendar, Bookmark, Shirt, Eye, Wand2 } from 'lucide-react';

export type TabType =
  | 'home'
  | 'wardrobe'
  | 'stylist'
  | 'tryon'
  | 'beauty'
  | 'looks'
  | 'planner'
  | 'profile';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenUpload,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'wardrobe', label: 'My Wardrobe', icon: Shirt },
    { id: 'stylist', label: 'AI Stylist', icon: Wand2 },
    { id: 'tryon', label: 'Virtual Try-On', icon: Eye },
    { id: 'beauty', label: 'Beauty & Hair', icon: Sparkles },
    { id: 'looks', label: 'My Looks', icon: Bookmark },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--aura-header-bg)] backdrop-blur-md border-b border-[var(--aura-border)] transition-all">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="group text-left cursor-pointer transition-transform hover:scale-[1.01]"
          >
            <span className="font-editorial text-2xl sm:text-3xl tracking-widest text-[var(--aura-text-primary)] font-medium block">
              A U R A
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--aura-text-faint)] -mt-1 block font-sans">
              Personal AI Wardrobe & Stylist
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single line, clean typography) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium tracking-wide">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`cursor-pointer whitespace-nowrap transition-colors py-1 relative ${
                  isActive
                    ? 'text-[var(--aura-text-strong)] font-semibold'
                    : 'text-[var(--aura-text-muted)] hover:text-[var(--aura-text-strong)]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[var(--aura-text-primary)] transition-all" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium tracking-wider uppercase text-[var(--aura-btn-primary-text)] bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] rounded-full transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Clothes</span>
          </button>
        </div>
      </div>

      {/* Subnav for Tablet and Mobile viewports */}
      <div className="lg:hidden border-t border-[var(--aura-border)]/60 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] font-medium'
                  : 'text-[var(--aura-text-muted)] bg-[var(--aura-surface-chip)] hover:text-[var(--aura-text-strong)]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
