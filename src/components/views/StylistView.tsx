import React, { useState, useEffect } from 'react';
import {
  Wand2,
  Sparkles,
  Eye,
  Bookmark,
  Calendar,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  WardrobeItem,
  Outfit,
  OccasionType,
  AestheticType,
} from '../../types/wardrobe';

interface StylistViewProps {
  wardrobe: WardrobeItem[];
  onSelectForTryOn: (outfit: Outfit) => void;
  onSaveLook: (outfit: Outfit) => void;
  onScheduleLook: (day: string, lookId: string) => void;
  onOpenUpload: () => void;
  savedLooks: Outfit[];
  initialPrioritizeUnused?: boolean;
  initialAesthetic?: AestheticType | null;
}

const OCCASIONS: OccasionType[] = [
  'Casual Outings',
  'School / College Regular Wear',
  'College Party',
  'School Party',
  'Office Wear',
  'Office Meetings',
  'Shopping',
  'Date Night',
  'Birthday Parties',
  'Weddings / Traditional Events',
  'Travel Outfits',
  'Festive Wear',
  'Daily Wear',
];

const AESTHETICS: AestheticType[] = [
  'Clean Girl',
  'Old Money',
  'Casual Chic',
  'Minimalist',
  'Coquette',
  'Y2K',
  'Korean Fashion',
  'Streetwear',
  'Soft Girl',
  'Elegant / Classy',
  'Western',
  'Indo-Western',
];

const WEATHERS = [
  'Mild / Spring',
  'Warm / Summer',
  'Cool / Autumn',
  'Cold / Winter',
  'Rainy & Overcast',
];

const COMFORT_LEVELS = [
  'Comfort First (Sneakers & Relaxed)',
  'Balanced Casual (Effortless Everyday)',
  'Chic & Polished (Smart Tailoring)',
  'High Glamour (Evening Sophistication)',
];

export const StylistView: React.FC<StylistViewProps> = ({
  wardrobe,
  onSelectForTryOn,
  onSaveLook,
  onScheduleLook,
  onOpenUpload,
  savedLooks,
  initialPrioritizeUnused = false,
  initialAesthetic = null,
}) => {
  const [occasion, setOccasion] = useState<OccasionType>('Casual Outings');
  const [aesthetic, setAesthetic] = useState<AestheticType>(initialAesthetic || 'Clean Girl');
  const [weather, setWeather] = useState('Mild / Spring');
  const [comfort, setComfort] = useState('Chic & Polished (Smart Tailoring)');
  const [prioritizeUnused, setPrioritizeUnused] = useState(initialPrioritizeUnused);
  const [colorTone, setColorTone] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [expandedBeautyId, setExpandedBeautyId] = useState<string | null>(null);
  const [scheduleModalOutfit, setScheduleModalOutfit] = useState<Outfit | null>(null);

  useEffect(() => {
    if (initialAesthetic) {
      setAesthetic(initialAesthetic);
    }
  }, [initialAesthetic]);

  useEffect(() => {
    if (initialPrioritizeUnused) {
      setPrioritizeUnused(true);
    }
  }, [initialPrioritizeUnused]);

  const handleGenerateOutfits = async () => {
    if (wardrobe.length === 0) {
      setErrorMsg('Your wardrobe is empty. Upload at least one piece to generate outfits.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai/generate-outfits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardrobe,
          occasion,
          aesthetic,
          weather,
          comfort,
          prioritizeUnused,
          colorPreference: colorTone,
        }),
      });

      const data = await response.json();

      if (data.outfits && Array.isArray(data.outfits) && data.outfits.length > 0) {
        // Ensure every returned itemId actually exists in wardrobe
        const validIds = new Set(wardrobe.map((w) => w.id));
        const cleaned = data.outfits
          .map((o: Outfit) => ({
            ...o,
            occasion,
            itemIds: (o.itemIds || []).filter((id: string) => validIds.has(id)),
          }))
          .filter((o: Outfit) => o.itemIds.length > 0);

        if (cleaned.length > 0) {
          setOutfits(cleaned);
          setExpandedBeautyId(cleaned[0].id);
          return;
        }
      }

      fallbackGenerateOutfits();
    } catch {
      fallbackGenerateOutfits();
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackGenerateOutfits = () => {
    const sortFn = (a: WardrobeItem, b: WardrobeItem) => {
      if (prioritizeUnused) {
        return (a.timesWorn || 0) - (b.timesWorn || 0);
      }
      return 0;
    };

    const tops = wardrobe.filter((i) => i.category === 'tops').sort(sortFn);
    const bottoms = wardrobe.filter((i) => i.category === 'bottoms').sort(sortFn);
    const dresses = wardrobe.filter((i) => i.category === 'dresses').sort(sortFn);
    const shoes = wardrobe.filter((i) => i.category === 'footwear').sort(sortFn);
    const jewels = wardrobe.filter((i) => i.category === 'jewellery').sort(sortFn);
    const accessories = wardrobe.filter((i) => i.category === 'accessories').sort(sortFn);

    const generated: Outfit[] = [];
    const baseTs = Date.now();

    // Option 1: Top + Bottom + Finishing pieces
    if (tops.length > 0 && bottoms.length > 0) {
      const top = tops[0];
      const bottom = bottoms[0];
      const itemIds = [top.id, bottom.id];
      if (shoes[0]) itemIds.push(shoes[0].id);
      if (jewels[0]) itemIds.push(jewels[0].id);
      if (accessories[0]) itemIds.push(accessories[0].id);

      generated.push({
        id: `outfit-${baseTs}-1`,
        title: `${aesthetic} ${occasion} Look`,
        occasion,
        aesthetic,
        itemIds,
        colorCoordination: `${top.primaryColor} paired with ${bottom.primaryColor}${colorTone ? ` and ${colorTone} accents` : ''}.`,
        stylingRationale: `Balances ${top.name} with ${bottom.name} for ${occasion} in ${weather.toLowerCase()} conditions.`,
        beauty: {
          makeup: {
            style: 'Luminous Natural Satin',
            lips: 'Warm rosewood or spiced nude satin balm',
            blush: 'Soft peach cream blush blended high on cheekbones',
            eyes: 'Brushed brows and clean curled lashes',
          },
          hair: {
            style: 'Effortless Low Claw Twist',
            details: 'Soft face-framing strands to keep the neckline balanced',
          },
          nails: 'Sheer milky neutral gloss',
          layeringAdvice: 'Use a clean half-tuck or roll cuffs slightly to highlight accessories.',
          finishingTouches: 'Pair with a subtle daytime fragrance.',
        },
      });
    }

    // Option 2: Dress pairing
    if (dresses.length > 0) {
      const dress = dresses[0];
      const itemIds = [dress.id];
      if (tops[0]) itemIds.push(tops[0].id);
      if (shoes[1] || shoes[0]) itemIds.push((shoes[1] || shoes[0]).id);
      if (jewels[1] || jewels[0]) itemIds.push((jewels[1] || jewels[0]).id);
      if (accessories[0]) itemIds.push(accessories[0].id);

      generated.push({
        id: `outfit-${baseTs}-2`,
        title: `Elevated ${dress.name}`,
        occasion,
        aesthetic,
        itemIds,
        colorCoordination: `${dress.primaryColor} focal silhouette with coordinated accessories.`,
        stylingRationale: `Centers your ${dress.name} for ${occasion} while keeping comfort at ${comfort.split('(')[0].trim().toLowerCase()}.`,
        beauty: {
          makeup: {
            style: 'Soft Velvet Radiance',
            lips: 'Muted berry or rose tinted lip oil',
            blush: 'Dusky rose cream across the apples of cheeks',
            eyes: 'Soft champagne lid shimmer with defined lashline',
          },
          hair: {
            style: 'Brushed Soft Waves',
            details: 'Loose waves swept cleanly off the shoulders',
          },
          nails: 'Classic sheer rosewater or deep wine',
          layeringAdvice: 'Keep outerwear draped lightly over shoulders if needed.',
          finishingTouches: 'Let earrings serve as the main light-catching focal accent.',
        },
      });
    }

    // Option 3: Alternative Top/Bottom or Starter Capsule pairing for small wardrobes
    if (tops.length > 1 && bottoms.length > 1) {
      const top = tops[1];
      const bottom = bottoms[1];
      const itemIds = [top.id, bottom.id];
      if (shoes[2] || shoes[0]) itemIds.push((shoes[2] || shoes[0]).id);
      if (jewels[2] || jewels[0]) itemIds.push((jewels[2] || jewels[0]).id);
      if (accessories[1] || accessories[0]) itemIds.push((accessories[1] || accessories[0]).id);

      generated.push({
        id: `outfit-${baseTs}-3`,
        title: `Relaxed ${aesthetic} Rotation`,
        occasion,
        aesthetic,
        itemIds,
        colorCoordination: `Harmonized ${top.primaryColor} and ${bottom.primaryColor} tones.`,
        stylingRationale: `An easy alternative pairing from your closet tailored to ${occasion}.`,
        beauty: {
          makeup: {
            style: 'Fresh Clean Glow',
            lips: 'Hydrating tinted honey balm',
            blush: 'Dewy cheek tint',
            eyes: 'Curled lashes and clear brow gel',
          },
          hair: {
            style: 'Sleek Low Ballet Bun',
            details: 'Clean center part smoothed neatly back',
          },
          nails: 'Clean natural buffed shine',
          layeringAdvice: 'Adjust layering and footwear to match movement and weather.',
          finishingTouches: 'Finish with structured bag and minimal metallic accents.',
        },
      });
    } else if (generated.length === 0 && wardrobe.length > 0) {
      // Starter wardrobe with only a few items in partial categories
      const sorted = [...wardrobe].sort(sortFn).slice(0, 5);
      generated.push({
        id: `outfit-${baseTs}-starter`,
        title: `Starter ${aesthetic} Combination`,
        occasion,
        aesthetic,
        itemIds: sorted.map((i) => i.id),
        colorCoordination: sorted.map((i) => i.primaryColor).filter(Boolean).join(' · ') || 'Coordinated tones',
        stylingRationale: `Styled from the pieces currently in your wardrobe for ${occasion}. Upload matching tops, bottoms, dresses, or shoes to unlock even more combinations.`,
        beauty: {
          makeup: {
            style: 'Clean Balanced Natural',
            lips: 'Soft neutral rose balm',
            blush: 'Natural cream cheek flush',
            eyes: 'Defined lashes with soft neutral lid wash',
          },
          hair: {
            style: 'Polished Everyday Waves or Sleek Ponytail',
            details: 'Keep hair away from the collar to frame accessories cleanly',
          },
          nails: 'Sheer neutral polish',
          layeringAdvice: 'Balance proportions using your existing pieces as anchor items.',
          finishingTouches: 'Add simple earrings or your favorite everyday bag.',
        },
      });
    }

    setOutfits(generated);
    if (generated.length > 0) {
      setExpandedBeautyId(generated[0].id);
    }
  };

  const handleSave = (outfit: Outfit) => {
    onSaveLook(outfit);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#C8A876', '#24211E', '#EAE3D9'],
    });
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[var(--aura-border)] pb-6">
        <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
          Occasion-Based Styling Engine
        </div>
        <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
          AI Personal Stylist
        </h1>
        <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-2xl">
          Select what you're dressing up for. Aura composes coordinated outfits strictly
          using your uploaded wardrobe, complete with beauty, hair, and try-on previews.
        </p>
      </div>

      {/* Interactive Occasion & Styling Controls Form */}
      <div className="bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs space-y-6">
        {/* Occasion Selection */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold mb-3">
            1. Select Your Occasion
          </label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => {
              const isSelected = occasion === occ;
              return (
                <button
                  key={occ}
                  onClick={() => setOccasion(occ)}
                  className={`px-3.5 py-2 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] shadow-xs'
                      : 'bg-[var(--aura-canvas)] text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-hover)] border border-[var(--aura-border)]'
                  }`}
                >
                  {occ}
                </button>
              );
            })}
          </div>
        </div>

        {/* Aesthetic Selection */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold mb-3">
            2. Preferred Aesthetic
          </label>
          <div className="flex flex-wrap gap-2">
            {AESTHETICS.map((aes) => {
              const isSelected = aesthetic === aes;
              return (
                <button
                  key={aes}
                  onClick={() => setAesthetic(aes)}
                  className={`px-3.5 py-1.5 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                    isSelected
                      ? 'bg-[var(--aura-accent)] text-white shadow-xs'
                      : 'bg-[var(--aura-canvas)] text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-hover)] border border-[var(--aura-border)]'
                  }`}
                >
                  {aes}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather, Comfort & Color Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold mb-2">
              Weather / Season
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--aura-canvas)] border border-[var(--aura-border-strong)] rounded-xl text-[var(--aura-text-primary)] cursor-pointer focus:outline-none"
            >
              {WEATHERS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold mb-2">
              Comfort & Polish Level
            </label>
            <select
              value={comfort}
              onChange={(e) => setComfort(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--aura-canvas)] border border-[var(--aura-border-strong)] rounded-xl text-[var(--aura-text-primary)] cursor-pointer focus:outline-none"
            >
              {COMFORT_LEVELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold mb-2">
              Color Preference (Optional)
            </label>
            <input
              type="text"
              value={colorTone}
              onChange={(e) => setColorTone(e.target.value)}
              placeholder="e.g. Cream & Mocha, Monochrome"
              className="w-full px-3 py-2 text-xs bg-[var(--aura-canvas)] border border-[var(--aura-border-strong)] rounded-xl text-[var(--aura-text-primary)] placeholder:text-[var(--aura-text-faint)] focus:outline-none"
            />
          </div>
        </div>

        {/* Sustainability Toggle: Prioritize Unused Clothes */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--aura-surface-alt)] border border-[var(--aura-border)]">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[var(--aura-text-primary)] block">
              Prioritize My Unused & Neglected Clothes
            </span>
            <span className="text-[11px] text-[var(--aura-text-subtle)] block">
              Instructs AI to build looks around items you have not worn yet.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPrioritizeUnused(!prioritizeUnused)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
              prioritizeUnused ? 'bg-[var(--aura-accent)]' : 'bg-[var(--aura-border-dashed)]'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                prioritizeUnused ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[var(--aura-surface-warm)] border border-[var(--aura-border-strong)] text-xs text-[#A86146] dark:text-[#E09275]">
            {errorMsg}
          </div>
        )}

        {/* Generate Button / Empty Closet Prompt */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {wardrobe.length === 0 ? (
            <>
              <span className="text-xs text-[var(--aura-text-subtle)]">
                Upload clothes, shoes, or accessories first so the stylist can build outfits from your own closet.
              </span>
              <button
                onClick={onOpenUpload}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-widest font-semibold transition-all shadow-md cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Clothes</span>
              </button>
            </>
          ) : (
            <>
              <span className="text-xs text-[var(--aura-text-faint)]">
                Outfits are composed exclusively from your uploaded wardrobe.
              </span>
              <button
                onClick={handleGenerateOutfits}
                disabled={isGenerating}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60 shrink-0"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--aura-accent-gold)]" />
                    <span>Composing Outfits...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-[var(--aura-accent-gold)]" />
                    <span>Generate Outfit Options</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Generated Outfit Options List */}
      {outfits.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[var(--aura-border)] pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] font-medium">
                AI Recommendations
              </span>
              <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
                Curated Looks for {occasion}
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            {outfits.map((outfit, index) => {
              const isSaved = savedLooks.some((l) => l.id === outfit.id);
              const isBeautyExpanded = expandedBeautyId === outfit.id;

              return (
                <div
                  key={outfit.id}
                  className="bg-[var(--aura-surface)] rounded-3xl border border-[var(--aura-border)] p-6 sm:p-8 shadow-sm space-y-6 hover:border-[var(--aura-border-strong)] transition-all"
                >
                  {/* Outfit Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--aura-border-light)] pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--aura-text-faint)] mb-1 font-medium">
                        <span>Option {index + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>{outfit.aesthetic}</span>
                      </div>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--aura-text-primary)]">
                        {outfit.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave(outfit)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-[var(--aura-surface-warm)] text-[var(--aura-accent)]'
                            : 'bg-[var(--aura-surface)] border border-[var(--aura-border-strong)] text-[var(--aura-text-primary)] hover:bg-[var(--aura-canvas)]'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        <span>{isSaved ? 'Saved' : 'Save Look'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!isSaved) onSaveLook(outfit);
                          setScheduleModalOutfit(outfit);
                        }}
                        className="p-2 rounded-full border border-[var(--aura-border-strong)] text-[var(--aura-text-primary)] hover:bg-[var(--aura-canvas)] transition-colors cursor-pointer"
                        title="Schedule in Weekly Planner"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectForTryOn(outfit)}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs font-semibold uppercase tracking-wider hover:bg-[var(--aura-btn-primary-hover)] transition-all cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Try On on Me</span>
                      </button>
                    </div>
                  </div>

                  {/* Wardrobe Items Used in This Outfit */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold block mb-3">
                      Coordinated Closet Pieces
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {outfit.itemIds.map((itemId) => {
                        const item = wardrobe.find((w) => w.id === itemId);
                        if (!item) return null;

                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-2xl bg-[var(--aura-canvas)] border border-[var(--aura-border)] flex flex-col justify-between"
                          >
                            <div className="aspect-square rounded-xl overflow-hidden bg-[var(--aura-surface)] mb-2">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-medium text-[var(--aura-text-primary)] line-clamp-1">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-[var(--aura-text-faint)] capitalize mt-0.5">
                              <span>{item.subcategory}</span>
                              <span aria-hidden="true">·</span>
                              <span>{item.primaryColor}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Editorial Rationale & Color Coordination */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--aura-canvas)] border border-[var(--aura-border)]">
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold block">
                        Color Coordination
                      </span>
                      <p className="text-xs text-[var(--aura-text-body)] leading-relaxed">
                        {outfit.colorCoordination}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[var(--aura-text-subtle)] font-semibold block">
                        Styling Rationale
                      </span>
                      <p className="text-xs text-[var(--aura-text-body)] leading-relaxed">
                        {outfit.stylingRationale}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Beauty, Makeup & Hair Suggestions */}
                  <div className="border border-[var(--aura-border)] rounded-2xl overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedBeautyId(isBeautyExpanded ? null : outfit.id)
                      }
                      className="w-full px-5 py-3.5 bg-[var(--aura-surface)] hover:bg-[var(--aura-canvas)] flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--aura-accent)]" />
                        <span className="text-xs font-semibold text-[var(--aura-text-primary)] uppercase tracking-wider">
                          Beauty, Makeup & Hairstyle Prescription
                        </span>
                      </div>
                      {isBeautyExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[var(--aura-text-subtle)]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--aura-text-subtle)]" />
                      )}
                    </button>

                    {isBeautyExpanded && outfit.beauty && (
                      <div className="p-5 bg-[var(--aura-canvas)] border-t border-[var(--aura-border)] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        {/* Makeup */}
                        <div className="space-y-2">
                          <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)] text-[11px] block">
                            Makeup Direction
                          </span>
                          <div className="space-y-1.5 text-[var(--aura-text-secondary)]">
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Look:</strong>{' '}
                              {outfit.beauty.makeup.style}
                            </p>
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Lips:</strong>{' '}
                              {outfit.beauty.makeup.lips}
                            </p>
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Blush:</strong>{' '}
                              {outfit.beauty.makeup.blush}
                            </p>
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Eyes:</strong>{' '}
                              {outfit.beauty.makeup.eyes}
                            </p>
                          </div>
                        </div>

                        {/* Hair & Nails */}
                        <div className="space-y-2">
                          <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)] text-[11px] block">
                            Hair & Manicure
                          </span>
                          <div className="space-y-1.5 text-[var(--aura-text-secondary)]">
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Hairstyle:</strong>{' '}
                              {outfit.beauty.hair.style}
                            </p>
                            <p className="text-[11px] text-[var(--aura-text-subtle)]">
                              {outfit.beauty.hair.details}
                            </p>
                            <p className="pt-1">
                              <strong className="text-[var(--aura-text-primary)]">Nails:</strong>{' '}
                              {outfit.beauty.nails}
                            </p>
                          </div>
                        </div>

                        {/* Layering & Finishing Touches */}
                        <div className="space-y-2">
                          <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)] text-[11px] block">
                            Finishing Touches
                          </span>
                          <div className="space-y-1.5 text-[var(--aura-text-secondary)]">
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Layering:</strong>{' '}
                              {outfit.beauty.layeringAdvice}
                            </p>
                            <p>
                              <strong className="text-[var(--aura-text-primary)]">Final Accent:</strong>{' '}
                              {outfit.beauty.finishingTouches}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule Outfit Modal */}
      {scheduleModalOutfit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[var(--aura-surface)] rounded-2xl p-6 shadow-xl border border-[var(--aura-border)] space-y-4">
            <h3 className="font-editorial text-xl font-semibold text-[var(--aura-text-primary)]">
              Schedule for Upcoming Day
            </h3>
            <p className="text-xs text-[var(--aura-text-subtle)]">
              Select which day you want to wear "{scheduleModalOutfit.title}".
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
              ].map((day) => (
                <button
                  key={day}
                  onClick={() => {
                    onScheduleLook(day, scheduleModalOutfit.id);
                    setScheduleModalOutfit(null);
                  }}
                  className="p-2 text-xs rounded-lg border border-[var(--aura-border-strong)] hover:bg-[var(--aura-btn-primary)] hover:text-[var(--aura-btn-primary-text)] transition-colors cursor-pointer text-[var(--aura-text-body)] font-medium"
                >
                  {day}
                </button>
              ))}
            </div>
            <button
              onClick={() => setScheduleModalOutfit(null)}
              className="w-full py-2 text-xs text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
