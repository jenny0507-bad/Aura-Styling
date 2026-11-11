import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Eye,
  Bookmark,
  Calendar,
  Check,
  Loader2,
  Layers,
  Palette,
  Heart,
  ChevronDown,
  ChevronUp,
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
  savedLooks: Outfit[];
  initialPrioritizeUnused?: boolean;
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
  savedLooks,
  initialPrioritizeUnused = false,
}) => {
  const [occasion, setOccasion] = useState<OccasionType>('Casual Outings');
  const [aesthetic, setAesthetic] = useState<AestheticType>('Clean Girl');
  const [weather, setWeather] = useState('Mild / Spring');
  const [comfort, setComfort] = useState('Chic & Polished (Smart Tailoring)');
  const [prioritizeUnused, setPrioritizeUnused] = useState(initialPrioritizeUnused);
  const [colorTone, setColorTone] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [savedLookIds, setSavedLookIds] = useState<Set<string>>(
    new Set(savedLooks.map((l) => l.id))
  );
  const [expandedBeautyId, setExpandedBeautyId] = useState<string | null>(null);
  const [scheduleModalOutfit, setScheduleModalOutfit] = useState<Outfit | null>(null);

  const handleGenerateOutfits = async () => {
    if (wardrobe.length === 0) {
      setErrorMsg('Your wardrobe is empty. Please upload items first.');
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
          notes: customNotes,
        }),
      });

      const data = await response.json();

      if (data.outfits && Array.isArray(data.outfits) && data.outfits.length > 0) {
        setOutfits(data.outfits);
        // Expand first outfit's beauty recommendations by default
        setExpandedBeautyId(data.outfits[0].id);
      } else {
        // Fallback generator from client wardrobe if backend Gemini quota or network issue
        fallbackGenerateOutfits();
      }
    } catch (err: any) {
      console.warn('Backend styling generation fallback:', err);
      fallbackGenerateOutfits();
    } finally {
      setIsGenerating(false);
    }
  };

  const fallbackGenerateOutfits = () => {
    // Generate intelligent combinations purely from client's actual wardrobe items
    const tops = wardrobe.filter((i) => i.category === 'tops');
    const bottoms = wardrobe.filter((i) => i.category === 'bottoms');
    const dresses = wardrobe.filter((i) => i.category === 'dresses');
    const shoes = wardrobe.filter((i) => i.category === 'footwear');
    const jewels = wardrobe.filter((i) => i.category === 'jewellery');
    const accessories = wardrobe.filter((i) => i.category === 'accessories');

    const generated: Outfit[] = [];

    // Combination 1: Top + Bottom + Shoes + Jewellery + Bag
    if (tops.length > 0 && bottoms.length > 0) {
      const top = tops[0];
      const bottom = bottoms[0];
      const shoe = shoes[0] || null;
      const jewel = jewels[0] || null;
      const acc = accessories[0] || null;

      const items = [top.id, bottom.id];
      if (shoe) items.push(shoe.id);
      if (jewel) items.push(jewel.id);
      if (acc) items.push(acc.id);

      generated.push({
        id: `outfit-${Date.now()}-1`,
        title: `The Effortless ${aesthetic} Ensemble`,
        occasion,
        aesthetic,
        itemIds: items,
        colorCoordination: `${top.primaryColor} harmonized with ${bottom.primaryColor} and accented with warm metallic notes.`,
        stylingRationale: `Tailored balance pairing the structure of ${top.name} with the fluid drape of ${bottom.name}, curated specifically for ${occasion}.`,
        beauty: {
          makeup: {
            style: 'Luminous Satin Natural',
            lips: 'Nude terracotta satin balm with soft lip liner',
            blush: 'Warm peach cream blush diffused high on cheekbones',
            eyes: 'Feathery brushed brows and chocolate brown tightlined mascara',
          },
          hair: {
            style: 'Effortless French Claw Twist',
            details: 'Casual twist leaving soft face-framing tendrils to balance the collar structure',
          },
          nails: 'Sheer milky glazed donut nude',
          layeringAdvice: 'Roll the sleeves once to showcase your watch and stacked rings.',
          finishingTouches: 'A spritz of warm vanilla or santal fragrance.',
        },
      });
    }

    // Combination 2: Dress or alternative top/bottom pairing
    if (dresses.length > 0) {
      const dress = dresses[0];
      const top = tops.find((t) => t.subcategory.toLowerCase().includes('blazer')) || tops[0];
      const shoe = shoes[1] || shoes[0] || null;
      const jewel = jewels[1] || jewels[0] || null;
      const acc = accessories[0] || null;

      const items = [dress.id];
      if (top) items.push(top.id);
      if (shoe) items.push(shoe.id);
      if (jewel) items.push(jewel.id);
      if (acc) items.push(acc.id);

      generated.push({
        id: `outfit-${Date.now()}-2`,
        title: `Editorial ${aesthetic} Silk & Structure`,
        occasion,
        aesthetic,
        itemIds: items,
        colorCoordination: `Rich ${dress.primaryColor} liquid sheen contrasted with clean tailoring.`,
        stylingRationale: `High-low contrast pairing fluid evening silk with nonchalant daytime outerwear for an elevated ${occasion} statement.`,
        beauty: {
          makeup: {
            style: 'Evening Velvet Glow',
            lips: 'Berry tinted stain with nourishing clear glaze',
            blush: 'Dusky rose cream draped over cheeks',
            eyes: 'Champagne shimmer wash with soft brown winged shadow',
          },
          hair: {
            style: 'Old Hollywood Brushed Ribbon Waves',
            details: 'Deep side part with brushed soft waves cascading over one shoulder',
          },
          nails: 'Glossy deep espresso or wine',
          layeringAdvice: 'Drape blazer over the shoulders like a cape for architectural presence.',
          finishingTouches: 'Let baroque pearl earrings catch ambient candlelight.',
        },
      });
    }

    // Combination 3: Casual or Neglected Items Pairing
    if (tops.length > 1 && bottoms.length > 1) {
      const top = tops[1];
      const bottom = bottoms[1];
      const shoe = shoes[2] || shoes[0] || null;
      const jewel = jewels[2] || jewels[0] || null;
      const acc = accessories[1] || accessories[0] || null;

      const items = [top.id, bottom.id];
      if (shoe) items.push(shoe.id);
      if (jewel) items.push(jewel.id);
      if (acc) items.push(acc.id);

      generated.push({
        id: `outfit-${Date.now()}-3`,
        title: `The Relaxed Capsule Rotation`,
        occasion,
        aesthetic,
        itemIds: items,
        colorCoordination: `Clean monochrome and understated neutral tones.`,
        stylingRationale: `Ultra-wearable, comfortable silhouette designed to highlight your everyday essentials while maintaining high editorial appeal.`,
        beauty: {
          makeup: {
            style: 'Clean Girl No-Makeup Glow',
            lips: 'Hydrating sheer honey gloss',
            blush: 'Dewy cheek tint',
            eyes: 'Curled lashes and clear brow gel',
          },
          hair: {
            style: 'Sleek Low Ballet Bun',
            details: 'Neat center part smoothed back into a chic miniature chignon',
          },
          nails: 'Clean natural buffed shine',
          layeringAdvice: 'Half-tuck the knitwear and secure with a classic leather belt.',
          finishingTouches: 'Carry a woven market tote for Parisian ease.',
        },
      });
    }

    setOutfits(generated);
    if (generated.length > 0) setExpandedBeautyId(generated[0].id);
  };

  const handleSave = (outfit: Outfit) => {
    onSaveLook(outfit);
    setSavedLookIds((prev) => new Set([...prev, outfit.id]));
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
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="text-xs uppercase tracking-widest text-[#8C8275] mb-1 font-medium">
          Occasion-Based Styling Engine
        </div>
        <h1 className="font-editorial text-4xl font-semibold text-[#24211E]">
          AI Personal Stylist
        </h1>
        <p className="text-xs text-[#7A7165] mt-1 max-w-2xl">
          Select what you're dressing up for. Aura composes multiple coordinated outfits strictly
          using your uploaded wardrobe, complete with beauty, hair, and try-on previews.
        </p>
      </div>

      {/* Interactive Occasion & Styling Controls Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xs space-y-6">
        {/* Occasion Selection */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#7A7165] font-semibold mb-3">
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
                      ? 'bg-[#24211E] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#5A5246] hover:bg-[#F2ECE4] border border-[#EAE3D9]'
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
          <label className="block text-xs uppercase tracking-wider text-[#7A7165] font-semibold mb-3">
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
                      ? 'bg-[#9A7B4F] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#5A5246] hover:bg-[#F2ECE4] border border-[#EAE3D9]'
                  }`}
                >
                  {aes}
                </button>
              );
            })}
          </div>
        </div>

        {/* Weather & Comfort Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#7A7165] font-semibold mb-2">
              Weather / Season
            </label>
            <select
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD6CB] rounded-xl text-[#24211E] cursor-pointer focus:outline-none"
            >
              {WEATHERS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#7A7165] font-semibold mb-2">
              Comfort & Polish Level
            </label>
            <select
              value={comfort}
              onChange={(e) => setComfort(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DDD6CB] rounded-xl text-[#24211E] cursor-pointer focus:outline-none"
            >
              {COMFORT_LEVELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sustainability Toggle: Prioritize Unused Clothes */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F4EE] border border-[#EBE3D6]">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-[#24211E] block">
              Prioritize My Unused & Neglected Clothes
            </span>
            <span className="text-[11px] text-[#7A7165] block">
              Instructs AI to construct looks around items with low or zero wear counts.
            </span>
          </div>
          <button
            onClick={() => setPrioritizeUnused(!prioritizeUnused)}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              prioritizeUnused ? 'bg-[#9A7B4F]' : 'bg-[#DCD5C9]'
            }`}
          >
            <span
              className={`block w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                prioritizeUnused ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-[#8C8275]">
            Strictly styling using your {wardrobe.length} uploaded closet items.
          </span>
          <button
            onClick={handleGenerateOutfits}
            disabled={isGenerating}
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#24211E] hover:bg-[#38332E] text-white text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C8A876]" />
                <span>Composing Magazine Outfits...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-[#C8A876]" />
                <span>Generate Outfit Options</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Outfit Options List */}
      {outfits.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#8C8275] font-medium">
                AI Recommendations
              </span>
              <h2 className="font-editorial text-3xl font-semibold text-[#24211E]">
                {outfits.length} Curated Looks for {occasion}
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            {outfits.map((outfit, index) => {
              const isSaved = savedLookIds.has(outfit.id);
              const isBeautyExpanded = expandedBeautyId === outfit.id;

              return (
                <div
                  key={outfit.id}
                  className="bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-8 shadow-sm space-y-6 hover:border-[#D6CCC0] transition-all"
                >
                  {/* Outfit Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECE4] pb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8C8275] mb-1 font-medium">
                        <span>Option {index + 1}</span>
                        <span aria-hidden="true">·</span>
                        <span>{outfit.aesthetic}</span>
                      </div>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[#24211E]">
                        {outfit.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSave(outfit)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                          isSaved
                            ? 'bg-[#F4EFEA] text-[#9A7B4F]'
                            : 'bg-white border border-[#DDD6CB] text-[#24211E] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        <span>{isSaved ? 'Saved' : 'Save Look'}</span>
                      </button>

                      <button
                        onClick={() => setScheduleModalOutfit(outfit)}
                        className="p-2 rounded-full border border-[#DDD6CB] text-[#24211E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Schedule in Weekly Planner"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectForTryOn(outfit)}
                        className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#24211E] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#38332E] transition-all cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Try On on Me</span>
                      </button>
                    </div>
                  </div>

                  {/* Wardrobe Items Used in This Outfit */}
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#7A7165] font-semibold block mb-3">
                      Coordinated Closet Pieces ({outfit.itemIds.length})
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {outfit.itemIds.map((itemId) => {
                        const item = wardrobe.find((w) => w.id === itemId);
                        if (!item) return null;

                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] flex flex-col justify-between"
                          >
                            <div className="aspect-square rounded-xl overflow-hidden bg-white mb-2">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="text-xs font-medium text-[#24211E] line-clamp-1">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-[#8C8275] capitalize mt-0.5">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9]">
                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[#7A7165] font-semibold block">
                        Color Coordination
                      </span>
                      <p className="text-xs text-[#4A4238] leading-relaxed">
                        {outfit.colorCoordination}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-[#7A7165] font-semibold block">
                        Styling Rationale
                      </span>
                      <p className="text-xs text-[#4A4238] leading-relaxed">
                        {outfit.stylingRationale}
                      </p>
                    </div>
                  </div>

                  {/* Expandable Beauty, Makeup & Hair Suggestions */}
                  <div className="border border-[#EAE3D9] rounded-2xl overflow-hidden">
                    <button
                      onClick={() =>
                        setExpandedBeautyId(isBeautyExpanded ? null : outfit.id)
                      }
                      className="w-full px-5 py-3.5 bg-white hover:bg-[#FAF8F5] flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#9A7B4F]" />
                        <span className="text-xs font-semibold text-[#24211E] uppercase tracking-wider">
                          Beauty, Makeup & Hairstyle Prescription
                        </span>
                      </div>
                      {isBeautyExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#7A7165]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#7A7165]" />
                      )}
                    </button>

                    {isBeautyExpanded && outfit.beauty && (
                      <div className="p-5 bg-[#FAF8F5] border-t border-[#EAE3D9] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        {/* Makeup */}
                        <div className="space-y-2">
                          <span className="font-semibold uppercase tracking-wider text-[#9A7B4F] text-[11px] block">
                            Makeup Direction
                          </span>
                          <div className="space-y-1.5 text-[#5A5246]">
                            <p>
                              <strong className="text-[#24211E]">Look:</strong>{' '}
                              {outfit.beauty.makeup.style}
                            </p>
                            <p>
                              <strong className="text-[#24211E]">Lips:</strong>{' '}
                              {outfit.beauty.makeup.lips}
                            </p>
                            <p>
                              <strong className="text-[#24211E]">Blush:</strong>{' '}
                              {outfit.beauty.makeup.blush}
                            </p>
                            <p>
                              <strong className="text-[#24211E]">Eyes:</strong>{' '}
                              {outfit.beauty.makeup.eyes}
                            </p>
                          </div>
                        </div>

                        {/* Hair & Nails */}
                        <div className="space-y-2">
                          <span className="font-semibold uppercase tracking-wider text-[#9A7B4F] text-[11px] block">
                            Hair & Manicure
                          </span>
                          <div className="space-y-1.5 text-[#5A5246]">
                            <p>
                              <strong className="text-[#24211E]">Hairstyle:</strong>{' '}
                              {outfit.beauty.hair.style}
                            </p>
                            <p className="text-[11px] text-[#7A7165]">
                              {outfit.beauty.hair.details}
                            </p>
                            <p className="pt-1">
                              <strong className="text-[#24211E]">Nails:</strong>{' '}
                              {outfit.beauty.nails}
                            </p>
                          </div>
                        </div>

                        {/* Layering & Finishing Touches */}
                        <div className="space-y-2">
                          <span className="font-semibold uppercase tracking-wider text-[#9A7B4F] text-[11px] block">
                            Finishing Touches
                          </span>
                          <div className="space-y-1.5 text-[#5A5246]">
                            <p>
                              <strong className="text-[#24211E]">Layering:</strong>{' '}
                              {outfit.beauty.layeringAdvice}
                            </p>
                            <p>
                              <strong className="text-[#24211E]">Final Accent:</strong>{' '}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-[#EAE3D9] space-y-4">
            <h3 className="font-editorial text-xl font-semibold text-[#24211E]">
              Schedule for Upcoming Day
            </h3>
            <p className="text-xs text-[#7A7165]">
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
                  className="p-2 text-xs rounded-lg border border-[#DDD6CB] hover:bg-[#24211E] hover:text-white transition-colors cursor-pointer text-[#4A4238] font-medium"
                >
                  {day}
                </button>
              ))}
            </div>
            <button
              onClick={() => setScheduleModalOutfit(null)}
              className="w-full py-2 text-xs text-[#7A7165] hover:text-[#24211E] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
