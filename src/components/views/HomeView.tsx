import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Shirt,
  Heart,
  Eye,
  CheckCircle,
  RefreshCw,
  Clock,
  Sparkle,
} from 'lucide-react';
import { WardrobeItem, Outfit } from '../../types/wardrobe';
import { TabType } from '../Navbar';

interface HomeViewProps {
  items: WardrobeItem[];
  looks: Outfit[];
  onNavigate: (tab: TabType) => void;
  onSelectOutfitForTryOn: (outfit: Outfit) => void;
  onStyleUnused: () => void;
  onLogWear: (id: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  items,
  looks,
  onNavigate,
  onSelectOutfitForTryOn,
  onStyleUnused,
  onLogWear,
}) => {
  const unusedItems = items.filter((i) => (i.timesWorn || 0) === 0);
  const favoriteItems = items.filter((i) => i.isFavorite);
  const todayLook = looks[0];

  const aestheticsList = [
    { name: 'Old Money', tag: 'Timeless Tailoring & Neutral Tones' },
    { name: 'Clean Girl', tag: 'Dewy Minimal & Polished Staples' },
    { name: 'Casual Chic', tag: 'Relaxed Elevated Denim & Blazers' },
    { name: 'Minimalist', tag: 'Architectural Cuts & Monochromatic' },
    { name: 'Coquette', tag: 'Romantic Silk, Pearls & Dainty Lace' },
    { name: 'Korean Fashion', tag: 'Oversized Silhouettes & Soft Layers' },
  ];

  return (
    <div className="space-y-12 pb-16 animate-in fade-in duration-300">
      {/* Editorial Hero Showcase */}
      <section className="relative rounded-3xl overflow-hidden bg-[#24211E] text-[#FAF8F5] shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[460px]">
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 xl:p-16 flex flex-col justify-between z-10">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C8A876] font-medium mb-4">
                <span>Capsule Archive</span>
                <span aria-hidden="true">·</span>
                <span>Autumn / Winter 2026</span>
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] tracking-tight text-[#FAF8F5] mb-6 text-balance">
                Style more with what you already own.
              </h1>
              <p className="text-sm sm:text-base text-[#D4CCC2] font-light max-w-xl leading-relaxed mb-8">
                Your wardrobe holds endless possibilities. Aura analyzes your existing clothes,
                jewellery, and footwear to compose runway-worthy outfits for college, office, parties,
                and date nights—with realistic try-on previews.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
              <button
                onClick={() => onNavigate('stylist')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#EFE9DF] text-[#1A1816] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-all shadow cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C8A876]" />
                <span>Generate Occasion Outfit</span>
              </button>

              <button
                onClick={() => onNavigate('wardrobe')}
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-[#FAF8F5] text-xs uppercase tracking-widest font-medium hover:bg-white/10 transition-all cursor-pointer"
              >
                <span>Browse Wardrobe ({items.length})</span>
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
              <span className="font-editorial italic text-sm">Vogue Edit</span> · Pure Mulberry Silk & Cashmere
            </div>
          </div>
        </div>
      </section>

      {/* Wardrobe Quick Metrics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-[#EBE5DC] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#7A7165] block mb-1">
            Total Cataloged Items
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-semibold text-[#24211E] tabular-nums">
              {items.length}
            </span>
            <span className="text-xs text-[#8C8275]">pieces in closet</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBE5DC] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#7A7165] block mb-1">
            Neglected / Unworn
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-semibold text-[#A86146] tabular-nums">
              {unusedItems.length}
            </span>
            <span className="text-xs text-[#8C8275]">awaiting styling</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBE5DC] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#7A7165] block mb-1">
            Saved AI Looks
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-semibold text-[#24211E] tabular-nums">
              {looks.length}
            </span>
            <span className="text-xs text-[#8C8275]">combinations</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EBE5DC] shadow-xs">
          <span className="text-xs uppercase tracking-wider text-[#7A7165] block mb-1">
            Capsule Rotation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-editorial text-3xl font-semibold text-[#4A7856] tabular-nums">
              {Math.round(((items.length - unusedItems.length) / Math.max(1, items.length)) * 100)}%
            </span>
            <span className="text-xs text-[#8C8275]">closet utilization</span>
          </div>
        </div>
      </section>

      {/* Two-Column Feature: Outfit of the Day + Style My Unused Clothes */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Outfit of the Day */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE5DC] shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C8275] mb-1">
                <span>Curated For Today</span>
                <span aria-hidden="true">·</span>
                <span>{todayLook?.occasion || 'Daily Wear'}</span>
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#24211E]">
                {todayLook?.title || 'The Parisian Café Meeting'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('stylist')}
              className="text-xs text-[#8C8275] hover:text-[#24211E] flex items-center gap-1 cursor-pointer font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change</span>
            </button>
          </div>

          {/* Outfit Items Flatlay Visual */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {todayLook?.itemIds.slice(0, 4).map((itemId) => {
              const it = items.find((x) => x.id === itemId);
              if (!it) return null;
              return (
                <div
                  key={it.id}
                  className="group relative rounded-xl overflow-hidden border border-[#EAE3D9] bg-[#FAF8F5] p-2 flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-white mb-2">
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#24211E] truncate w-full">
                    {it.name}
                  </span>
                  <span className="text-[10px] text-[#8C8275] capitalize">
                    {it.subcategory}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Color & Styling Rationale */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EFE9E0] space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#524A40]">
              <span className="font-semibold text-[#24211E]">Palette:</span>
              <span>{todayLook?.colorCoordination}</span>
            </div>
            <p className="text-xs text-[#6E665B] leading-relaxed">
              {todayLook?.stylingRationale}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {todayLook && (
              <button
                onClick={() => onSelectOutfitForTryOn(todayLook)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24211E] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#38332E] transition-all cursor-pointer shadow-sm"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Virtual Try-On on Me</span>
              </button>
            )}

            <button
              onClick={() => {
                if (todayLook) {
                  todayLook.itemIds.forEach((id) => onLogWear(id));
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#DCD5C9] text-[#24211E] text-xs uppercase tracking-wider font-medium hover:bg-[#FAF8F5] transition-all cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#4A7856]" />
              <span>Wearing This Today</span>
            </button>

            <button
              onClick={() => onNavigate('beauty')}
              className="px-4 py-2.5 text-xs text-[#6E665B] hover:text-[#24211E] font-medium cursor-pointer"
            >
              View Hair & Makeup Recipe →
            </button>
          </div>
        </div>

        {/* Right: Style My Unused Clothes */}
        <div className="lg:col-span-5 bg-[#F4EFEA] rounded-3xl p-6 sm:p-8 border border-[#E5DFD5] space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#9A7B4F] font-semibold mb-1">
                <Sparkle className="w-3.5 h-3.5" />
                <span>Closet Sustainability</span>
              </div>
              <h3 className="font-editorial text-2xl font-semibold text-[#24211E]">
                Style My Unused Clothes
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white text-[#8C5E3D] border border-[#E5DFD5]">
              {unusedItems.length} unworn
            </span>
          </div>

          <p className="text-xs text-[#6E665B] leading-relaxed">
            You don't need new shopping hauls. The AI specializes in breathing fresh life into
            clothes sitting untouched in the back of your wardrobe.
          </p>

          {/* Unused pieces carousel / list */}
          <div className="space-y-3">
            {unusedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#EAE4DC] hover:border-[#D6CCC0] transition-colors"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-[#F7F4EE] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-[#24211E] block truncate">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#8C8275]">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>Worn 0 times</span>
                  </div>
                </div>
                <button
                  onClick={() => onLogWear(item.id)}
                  title="Mark as worn today"
                  className="text-xs px-2.5 py-1 rounded-md text-[#7A7165] hover:text-[#24211E] bg-[#F7F4EE] hover:bg-[#EFEAE2] transition-colors cursor-pointer shrink-0"
                >
                  + Log
                </button>
              </div>
            ))}

            {unusedItems.length === 0 && (
              <div className="text-center py-6 text-xs text-[#7A7165]">
                🎉 Incredible! Every single piece in your wardrobe has been styled and worn.
              </div>
            )}
          </div>

          <button
            onClick={onStyleUnused}
            className="w-full py-3 rounded-full bg-[#9A7B4F] hover:bg-[#866A42] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Outfits For Unused Clothes</span>
          </button>
        </div>
      </section>

      {/* Pinterest-Inspired Fashion Intelligence Aesthetics */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#8C8275] mb-1">
              Fashion Intelligence
            </div>
            <h2 className="font-editorial text-3xl font-semibold text-[#24211E]">
              Explore Signature Aesthetics
            </h2>
          </div>
          <button
            onClick={() => onNavigate('stylist')}
            className="text-xs uppercase tracking-wider text-[#6E665B] hover:text-[#24211E] font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Customise in AI Stylist</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {aestheticsList.map((aes) => {
            const matchingCount = items.filter((i) => i.aesthetics.includes(aes.name)).length;
            return (
              <div
                key={aes.name}
                onClick={() => onNavigate('stylist')}
                className="p-4 rounded-2xl bg-white border border-[#EBE5DC] hover:border-[#24211E] transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-editorial text-lg font-medium text-[#24211E] group-hover:text-[#9A7B4F] transition-colors">
                    {aes.name}
                  </h4>
                  <p className="text-[11px] text-[#7A7165] mt-1 leading-snug">
                    {aes.tag}
                  </p>
                </div>
                <div className="pt-4 mt-3 border-t border-[#F2ECE4] flex items-center justify-between text-[11px] text-[#8C8275]">
                  <span>{matchingCount} pieces</span>
                  <span className="text-[#24211E] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Style →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
