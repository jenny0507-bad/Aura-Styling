import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle,
  RefreshCw,
  Sparkle,
  Plus,
  Wand2,
} from 'lucide-react';
import { WardrobeItem, Outfit, AestheticType } from '../../types/wardrobe';
import { TabType } from '../Navbar';

interface HomeViewProps {
  items: WardrobeItem[];
  looks: Outfit[];
  planner: Record<string, string>;
  onNavigate: (tab: TabType) => void;
  onOpenUpload: () => void;
  onSelectOutfitForTryOn: (outfit: Outfit) => void;
  onStyleUnused: () => void;
  onSelectAesthetic: (aesthetic: AestheticType) => void;
  onLogWear: (id: string) => void;
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  looks,
  planner,
  onNavigate,
  onOpenUpload,
  onSelectOutfitForTryOn,
  onStyleUnused,
  onSelectAesthetic,
  onLogWear,
}) => {
  const [loggedToday, setLoggedToday] = useState(false);

  const unusedItems = items.filter((i) => (i.timesWorn || 0) === 0);
  const todayWeekday = WEEKDAYS[new Date().getDay()];
  const scheduledLookId = planner[todayWeekday];
  const todayLook =
    (scheduledLookId && looks.find((l) => l.id === scheduledLookId)) ||
    looks[0] ||
    null;

  const aestheticsList: { name: AestheticType; tag: string }[] = [
    { name: 'Old Money', tag: 'Timeless Tailoring & Neutral Tones' },
    { name: 'Clean Girl', tag: 'Dewy Minimal & Polished Staples' },
    { name: 'Casual Chic', tag: 'Relaxed Elevated Denim & Blazers' },
    { name: 'Minimalist', tag: 'Architectural Cuts & Monochromatic' },
    { name: 'Coquette', tag: 'Romantic Silk, Pearls & Dainty Lace' },
    { name: 'Korean Fashion', tag: 'Oversized Silhouettes & Soft Layers' },
  ];

  const handleLogTodayOutfit = () => {
    if (!todayLook) return;
    todayLook.itemIds.forEach((id) => onLogWear(id));
    setLoggedToday(true);
    setTimeout(() => setLoggedToday(false), 2500);
  };

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-300">
      {/* Editorial Hero Showcase */}
      <section className="relative rounded-3xl overflow-hidden bg-[#24211E] text-[#FAF8F5] shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[440px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 xl:p-16 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C8A876] font-medium mb-4">
                <span>Personal Digital Wardrobe</span>
                <span aria-hidden="true">·</span>
                <span>AI Styling Studio</span>
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-[#FAF8F5] mb-6 text-balance">
                Style more with what you already own.
              </h1>
              <p className="text-sm sm:text-base text-[#D4CCC2] font-light max-w-xl leading-relaxed mb-8">
                Upload your own clothes, jewellery, footwear, and accessories. Aura organizes your
                closet and composes personalized outfits for college, office, parties, and date
                nights—with realistic virtual try-on previews.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              {items.length === 0 ? (
                <button
                  onClick={onOpenUpload}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#EFE9DF] text-[#1A1816] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all shadow cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#C8A876]" />
                  <span>Upload Your First Item</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('stylist')}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#EFE9DF] text-[#1A1816] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all shadow cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A876]" />
                  <span>Generate Occasion Outfit</span>
                </button>
              )}

              <button
                onClick={() => onNavigate('wardrobe')}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-[#FAF8F5] text-xs uppercase tracking-widest font-medium hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Browse Wardrobe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full">
            <img
              src="/src/assets/images/fashion_editorial_hero_1794385431993.jpg"
              alt="Editorial fashion flat lay"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#24211E] via-transparent to-transparent opacity-80 lg:opacity-60" />
            <div className="absolute bottom-6 right-6 hidden sm:block bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl text-white text-xs border border-white/10">
              <span className="font-editorial italic text-sm">Editorial Capsule</span> · Curated From Your Closet
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Feature: Curated For Today + Style My Unused Clothes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Curated Outfit For Today */}
        <div className="lg:col-span-7 bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-sm space-y-6">
          {todayLook ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1">
                    <span>{scheduledLookId ? `Planned for ${todayWeekday}` : 'Latest Saved Look'}</span>
                    <span aria-hidden="true">·</span>
                    <span>{todayLook.occasion}</span>
                  </div>
                  <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--aura-text-primary)]">
                    {todayLook.title}
                  </h2>
                </div>
                <button
                  onClick={() => onNavigate('stylist')}
                  className="text-xs text-[var(--aura-text-faint)] hover:text-[var(--aura-text-primary)] flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Change</span>
                </button>
              </div>

              {/* Outfit Items Flatlay Visual */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {todayLook.itemIds.slice(0, 4).map((itemId) => {
                  const it = items.find((x) => x.id === itemId);
                  if (!it) return null;
                  return (
                    <div
                      key={it.id}
                      className="group relative rounded-xl overflow-hidden border border-[var(--aura-border)] bg-[var(--aura-canvas)] p-2 flex flex-col items-center text-center"
                    >
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-[var(--aura-surface)] mb-2">
                        <img
                          src={it.imageUrl}
                          alt={it.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-[var(--aura-text-primary)] truncate w-full">
                        {it.name}
                      </span>
                      <span className="text-[10px] text-[var(--aura-text-faint)] capitalize">
                        {it.subcategory}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Color & Styling Rationale */}
              <div className="p-4 rounded-xl bg-[var(--aura-canvas)] border border-[var(--aura-border)] space-y-2">
                <div className="flex items-center gap-2 text-xs text-[var(--aura-text-body)]">
                  <span className="font-semibold text-[var(--aura-text-primary)]">Palette:</span>
                  <span>{todayLook.colorCoordination}</span>
                </div>
                <p className="text-xs text-[var(--aura-text-muted)] leading-relaxed">
                  {todayLook.stylingRationale}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => onSelectOutfitForTryOn(todayLook)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-medium hover:bg-[var(--aura-btn-primary-hover)] transition-all cursor-pointer shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Virtual Try-On on Me</span>
                </button>

                <button
                  onClick={handleLogTodayOutfit}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--aura-border-strong)] text-[var(--aura-text-primary)] text-xs uppercase tracking-wider font-medium hover:bg-[var(--aura-canvas)] transition-all cursor-pointer"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#4A7856] dark:text-[#78B588]" />
                  <span>{loggedToday ? 'Logged Today' : 'Wearing This Today'}</span>
                </button>

                <button
                  onClick={() => onNavigate('beauty')}
                  className="px-4 py-2.5 text-xs text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)] font-medium cursor-pointer"
                >
                  View Hair & Makeup Recipe →
                </button>
              </div>
            </>
          ) : (
            <div className="py-6 space-y-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1">
                  Curated For Today
                </div>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--aura-text-primary)]">
                  Your Daily Outfit Canvas
                </h2>
              </div>

              <p className="text-xs text-[var(--aura-text-muted)] leading-relaxed max-w-lg">
                {items.length === 0
                  ? 'Start by uploading photographs of your clothes, shoes, jewellery, and accessories. Once added, Aura can generate personalized outfits for any occasion and display your look for today here.'
                  : 'Your wardrobe items are ready. Generate and save an outfit in the AI Stylist—or schedule one in the Weekly Planner—to see your curated look here.'}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {items.length === 0 ? (
                  <button
                    onClick={onOpenUpload}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-medium hover:bg-[var(--aura-btn-primary-hover)] transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Clothes</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('stylist')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-medium hover:bg-[var(--aura-btn-primary-hover)] transition-all cursor-pointer shadow-sm"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Open AI Stylist</span>
                  </button>
                )}

                <button
                  onClick={() => onNavigate('profile')}
                  className="px-4 py-2.5 rounded-full border border-[var(--aura-border-strong)] text-xs text-[var(--aura-text-primary)] hover:bg-[var(--aura-canvas)] font-medium cursor-pointer"
                >
                  Set Up Try-On Photo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Style My Unused Clothes */}
        <div className="lg:col-span-5 bg-[var(--aura-surface-warm)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] space-y-5">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold mb-1">
              <Sparkle className="w-3.5 h-3.5" />
              <span>Closet Sustainability</span>
            </div>
            <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)]">
              Style My Unused Clothes
            </h3>
          </div>

          <p className="text-xs text-[var(--aura-text-muted)] leading-relaxed">
            You don't need new shopping hauls. Aura specializes in breathing fresh life into
            clothes sitting untouched in your wardrobe.
          </p>

          {items.length === 0 ? (
            <>
              <div className="p-4 rounded-xl bg-[var(--aura-surface)] border border-[var(--aura-border)] text-xs text-[var(--aura-text-subtle)] leading-relaxed">
                Upload pieces from your closet to track wears and automatically discover outfit pairings for unworn items.
              </div>
              <button
                onClick={onOpenUpload}
                className="w-full py-3 rounded-full bg-[var(--aura-accent)] hover:bg-[var(--aura-accent-hover)] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Wardrobe Items</span>
              </button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                {unusedItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--aura-surface)] border border-[var(--aura-border)] hover:border-[var(--aura-border-strong)] transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-[var(--aura-surface-alt)] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-[var(--aura-text-primary)] block truncate">
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-[var(--aura-text-faint)]">
                        <span className="capitalize">{item.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Not worn yet</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onLogWear(item.id)}
                      title="Mark as worn today"
                      className="text-xs px-2.5 py-1 rounded-md text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] bg-[var(--aura-surface-alt)] hover:bg-[var(--aura-surface-hover)] transition-colors cursor-pointer shrink-0"
                    >
                      + Log
                    </button>
                  </div>
                ))}

                {unusedItems.length === 0 && (
                  <div className="text-center py-6 text-xs text-[var(--aura-text-subtle)]">
                    Every piece in your wardrobe has been styled and worn.
                  </div>
                )}
              </div>

              <button
                onClick={onStyleUnused}
                className="w-full py-3 rounded-full bg-[var(--aura-accent)] hover:bg-[var(--aura-accent-hover)] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Outfits For Unused Clothes</span>
              </button>
            </>
          )}
        </div>
      </section>

      {/* Pinterest-Inspired Fashion Intelligence Aesthetics */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1">
              Fashion Intelligence
            </div>
            <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
              Explore Signature Aesthetics
            </h2>
          </div>
          <button
            onClick={() => onNavigate('stylist')}
            className="text-xs uppercase tracking-wider text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)] font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Open AI Stylist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {aestheticsList.map((aes) => (
            <div
              key={aes.name}
              onClick={() => onSelectAesthetic(aes.name)}
              className="p-4 rounded-2xl bg-[var(--aura-surface)] border border-[var(--aura-border)] hover:border-[var(--aura-text-primary)] transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-editorial text-lg font-medium text-[var(--aura-text-primary)] group-hover:text-[var(--aura-accent)] transition-colors">
                  {aes.name}
                </h4>
                <p className="text-[11px] text-[var(--aura-text-subtle)] mt-1 leading-snug">
                  {aes.tag}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-[var(--aura-border-light)] flex items-center justify-end text-[11px] text-[var(--aura-text-faint)]">
                <span className="text-[var(--aura-text-primary)] font-semibold opacity-70 group-hover:opacity-100 transition-opacity">
                  Style →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
