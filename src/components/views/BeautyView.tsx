import React, { useState } from 'react';
import { Scissors, Eye } from 'lucide-react';
import { Outfit, WardrobeItem } from '../../types/wardrobe';

interface BeautyViewProps {
  looks: Outfit[];
  wardrobe: WardrobeItem[];
  onSelectForTryOn: (outfit: Outfit) => void;
}

const MAKEUP_STYLES = [
  {
    id: 'clean_girl',
    title: 'Clean Girl Dewy Natural',
    occasion: 'School / College / Daily Wear',
    description:
      'Feathery brushed-up soap brows, luminous skin tint, cream peach blush swept high on the cheekbones, curled lashes with dark brown mascara, and a tinted honey-nude lip balm.',
    lipstick: 'Warm Honey Rosewood / Spiced Almond Gloss',
    blush: 'Dewy Peach Liquid Cream',
    eyes: 'Clear brow gel + curled natural lashes with chocolate tightline',
    hexColors: ['#D99B82', '#E8B4A2', '#8C5E48'],
  },
  {
    id: 'office_polished',
    title: 'Executive Satin Polished',
    occasion: 'Office Wear / Formal Meetings',
    description:
      'Semi-matte velvet skin with soft contour, soft taupe lid wash, neat eyeliner flick, and a defined satin neutral-nude lip for commanding presence without distraction.',
    lipstick: 'Muted Mauve-Nude Satin Finish',
    blush: 'Soft Dusty Terracotta Mineral Powder',
    eyes: 'Neutral taupe transition shade and subtle smoked espresso wing',
    hexColors: ['#B87D70', '#C49A88', '#543D37'],
  },
  {
    id: 'candlelit_glam',
    title: 'Candlelit Velvet Radiance',
    occasion: 'Date Night / Evening Parties',
    description:
      'Glow-from-within complexion with soft strobe highlight, sultry bronze champagne shimmer across the eyelids, smoked lashline, and a plush berry or Bordeaux stained lip.',
    lipstick: 'Rich Blackberry Satin or Cherry Glaze',
    blush: 'Warm Berry Rose Cream Blended to Temples',
    eyes: 'Gilded champagne lid wash with soft smudged kohl liner',
    hexColors: ['#8C3848', '#C98276', '#E2BA70'],
  },
  {
    id: 'festive_traditional',
    title: 'Gilded Royal Luster',
    occasion: 'Weddings / Festive Celebrations',
    description:
      'Golden olive base highlighting warm undertones, soft sculpted eyes with micro-fine gold shimmer, winged jet-black liner, and a warm crimson or spiced cinnamon lip.',
    lipstick: 'Warm Spiced Crimson or Terracotta Red',
    blush: 'Sun-drenched apricot glow',
    eyes: 'Antiqued gold lid highlight with intense kohl waterline',
    hexColors: ['#A02E2E', '#D9825B', '#D4AF37'],
  },
];

const HAIRSTYLE_LOOKS = [
  {
    id: 'hair-1',
    name: 'Relaxed French Twist Chignon',
    bestFor: 'Blazers, Structured Collars & Knitwear',
    occasion: 'Office, Meetings & Casual Chic',
    tip: 'Leave two delicate wavy tendrils around the ears to soften tailored necklines and show off statement earrings.',
    difficulty: 'Easy (2 mins)',
  },
  {
    id: 'hair-2',
    name: 'Sleek Low Ballet Bun with Center Part',
    bestFor: 'High-Neck Tops, Statement Jewellery & Clean Girl Aesthetic',
    occasion: 'College, Shopping, Evening Cocktails',
    tip: 'Use a bristle brush with light hair serum to create a glass-like shine that balances oversized coats.',
    difficulty: 'Easy (3 mins)',
  },
  {
    id: 'hair-3',
    name: 'Old Hollywood Brushed Ribbon Waves',
    bestFor: 'Silk Slip Dresses, Cowl Necks & Date Nights',
    occasion: 'Date Night, Weddings, Parties',
    tip: 'Curl with a 1.25" barrel in the same direction, then brush out gently with an oil-infused brush.',
    difficulty: 'Medium (10 mins)',
  },
  {
    id: 'hair-4',
    name: 'Soft Ribbon Half-Updo with Pearl Pin',
    bestFor: 'Coquette, Sundresses & Soft Girl Outfits',
    occasion: 'Birthdays, Brunches, Daytime Events',
    tip: 'Gently pull the crown hair loose for organic volume; accent with a silk ribbon tie.',
    difficulty: 'Easy (4 mins)',
  },
];

const NAIL_PALETTES = [
  {
    name: 'Milky Glazed Chrome',
    shade: 'Translucent off-white with micro pearl dust',
    match: 'Pairs with all neutral cream and gold looks',
  },
  {
    name: 'Espresso Dark Chocolate Gloss',
    shade: 'Deep rich mocha jelly finish',
    match: 'Flattering contrast against cream linen and cognac leather',
  },
  {
    name: 'French Sheer Rosewater',
    shade: 'Classic 90s minimalist clean manicure',
    match: 'Everyday college, office, and minimal aesthetics',
  },
  {
    name: 'Bordeaux Black Cherry',
    shade: 'Ultra-dark moody burgundy gloss',
    match: 'Evening silk slips and date night gold jewellery',
  },
];

export const BeautyView: React.FC<BeautyViewProps> = ({
  looks,
  wardrobe,
  onSelectForTryOn,
}) => {
  const [selectedMakeup, setSelectedMakeup] = useState(MAKEUP_STYLES[0]);
  const [selectedLookId, setSelectedLookId] = useState<string>(looks[0]?.id || '');

  const activeSavedLook =
    looks.find((l) => l.id === selectedLookId) || looks[0] || null;

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[var(--aura-border)] pb-6">
        <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
          Personal Beauty & Aesthetic Consultation
        </div>
        <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
          Beauty, Makeup & Hair Studio
        </h1>
        <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-2xl">
          Complete your look with occasion-matched makeup palettes, hairstyles suited to your
          necklines, and finishing manicure touches.
        </p>
      </div>

      {/* Saved Look Beauty Prescriptions (shown whenever user has saved looks) */}
      {activeSavedLook && (
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold">
                Tailored to Your Outfits
              </span>
              <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
                Beauty Recipes for Your Saved Looks
              </h2>
            </div>

            <select
              value={activeSavedLook.id}
              onChange={(e) => setSelectedLookId(e.target.value)}
              className="text-xs px-3 py-2 bg-[var(--aura-surface)] border border-[var(--aura-border-strong)] rounded-full text-[var(--aura-text-primary)] cursor-pointer focus:outline-none"
            >
              {looks.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} ({l.occasion})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--aura-border-light)] pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[var(--aura-text-faint)] font-medium">
                  {activeSavedLook.occasion} · {activeSavedLook.aesthetic}
                </span>
                <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)]">
                  {activeSavedLook.title}
                </h3>
              </div>
              <button
                onClick={() => onSelectForTryOn(activeSavedLook)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-medium hover:bg-[var(--aura-btn-primary-hover)] transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Try On Look</span>
              </button>
            </div>

            {/* Outfit items strip */}
            {activeSavedLook.itemIds.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {activeSavedLook.itemIds.map((id) => {
                  const item = wardrobe.find((w) => w.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--aura-canvas)] border border-[var(--aura-border)] shrink-0"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-7 h-7 rounded-md object-cover"
                      />
                      <span className="text-[11px] text-[var(--aura-text-primary)] font-medium">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeSavedLook.beauty && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-2">
                <div className="space-y-1.5 text-[var(--aura-text-secondary)]">
                  <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)] text-[11px] block">
                    Makeup
                  </span>
                  <p><strong className="text-[var(--aura-text-primary)]">Look:</strong> {activeSavedLook.beauty.makeup.style}</p>
                  <p><strong className="text-[var(--aura-text-primary)]">Lips:</strong> {activeSavedLook.beauty.makeup.lips}</p>
                  <p><strong className="text-[var(--aura-text-primary)]">Blush:</strong> {activeSavedLook.beauty.makeup.blush}</p>
                  <p><strong className="text-[var(--aura-text-primary)]">Eyes:</strong> {activeSavedLook.beauty.makeup.eyes}</p>
                </div>

                <div className="space-y-1.5 text-[var(--aura-text-secondary)]">
                  <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)] text-[11px] block">
                    Hair & Nails
                  </span>
                  <p><strong className="text-[var(--aura-text-primary)]">Hairstyle:</strong> {activeSavedLook.beauty.hair.style}</p>
                  <p className="text-[11px] text-[var(--aura-text-subtle)]">{activeSavedLook.beauty.hair.details}</p>
                  <p><strong className="text-[var(--aura-text-primary)]">Nails:</strong> {activeSavedLook.beauty.nails}</p>
                </div>

                <div className="space-y-1.5 text-[var(--aura-text-secondary)]">
                  <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)] text-[11px] block">
                    Styling & Finishing Touches
                  </span>
                  <p><strong className="text-[var(--aura-text-primary)]">Layering:</strong> {activeSavedLook.beauty.layeringAdvice}</p>
                  <p><strong className="text-[var(--aura-text-primary)]">Final Accent:</strong> {activeSavedLook.beauty.finishingTouches}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Section 1: Makeup Lab */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold">
              Makeup Formulations
            </span>
            <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
              Occasion-Appropriate Face Palettes
            </h2>
          </div>
        </div>

        {/* Makeup Style Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {MAKEUP_STYLES.map((style) => {
            const isSelected = selectedMakeup.id === style.id;
            return (
              <button
                key={style.id}
                onClick={() => setSelectedMakeup(style)}
                className={`px-4 py-2 text-xs rounded-full whitespace-nowrap transition-all cursor-pointer font-medium ${
                  isSelected
                    ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] shadow-xs'
                    : 'bg-[var(--aura-surface)] text-[var(--aura-text-secondary)] hover:bg-[var(--aura-canvas)] border border-[var(--aura-border)]'
                }`}
              >
                {style.title}
              </button>
            );
          })}
        </div>

        {/* Selected Makeup Deep Dive Card */}
        <div className="bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[var(--aura-text-faint)] uppercase tracking-wider font-semibold">
              <span>Best for: {selectedMakeup.occasion}</span>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--aura-text-primary)]">
              {selectedMakeup.title}
            </h3>

            <p className="text-xs text-[var(--aura-text-secondary)] leading-relaxed">
              {selectedMakeup.description}
            </p>

            <div className="space-y-3 pt-3 border-t border-[var(--aura-border-light)] text-xs">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-[var(--aura-text-primary)] w-24 shrink-0">
                  Lipstick:
                </span>
                <span className="text-[var(--aura-text-secondary)]">{selectedMakeup.lipstick}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-semibold text-[var(--aura-text-primary)] w-24 shrink-0">
                  Blush Tone:
                </span>
                <span className="text-[var(--aura-text-secondary)]">{selectedMakeup.blush}</span>
              </div>

              <div className="flex items-start gap-2">
                <span className="font-semibold text-[var(--aura-text-primary)] w-24 shrink-0">
                  Eye Technique:
                </span>
                <span className="text-[var(--aura-text-secondary)]">{selectedMakeup.eyes}</span>
              </div>
            </div>
          </div>

          {/* Color Swatch Board */}
          <div className="lg:col-span-5 bg-[var(--aura-canvas)] rounded-2xl p-6 border border-[var(--aura-border)] space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] block">
              Curated Pigment Swatches
            </span>

            <div className="grid grid-cols-3 gap-3">
              {selectedMakeup.hexColors.map((color, idx) => (
                <div key={idx} className="space-y-2 text-center">
                  <div
                    className="w-full aspect-square rounded-2xl shadow-inner border border-black/10 dark:border-white/15 transition-transform hover:scale-105"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[10px] font-mono text-[var(--aura-text-subtle)] block uppercase">
                    {color}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[var(--aura-text-subtle)] italic leading-snug pt-2">
              Balanced shades designed to complement everyday, office, and evening looks.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Hairstyles by Neckline & Silhouette */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold">
            Hair Architecture
          </span>
          <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
            Hairstyles Matched to Outfit Necklines
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HAIRSTYLE_LOOKS.map((h) => (
            <div
              key={h.id}
              className="bg-[var(--aura-surface)] rounded-2xl p-5 border border-[var(--aura-border)] flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-[var(--aura-text-faint)] mb-2 font-medium">
                  <span>{h.difficulty}</span>
                  <Scissors className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-editorial text-lg font-semibold text-[var(--aura-text-primary)]">
                  {h.name}
                </h4>
                <p className="text-[11px] text-[var(--aura-accent)] font-semibold mt-1">
                  Ideal for: {h.bestFor}
                </p>
                <p className="text-xs text-[var(--aura-text-muted)] mt-2 leading-relaxed">
                  {h.tip}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--aura-border-light)] text-[11px] text-[var(--aura-text-subtle)]">
                {h.occasion}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Nail Polish & Scent Finishes */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold">
            Finishing Touches
          </span>
          <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
            Manicure & Sensorial Details
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NAIL_PALETTES.map((n) => (
            <div
              key={n.name}
              className="bg-[var(--aura-surface)] rounded-2xl p-5 border border-[var(--aura-border)] space-y-2 hover:border-[var(--aura-text-primary)] transition-colors"
            >
              <h4 className="font-editorial text-lg font-semibold text-[var(--aura-text-primary)]">
                {n.name}
              </h4>
              <p className="text-xs text-[var(--aura-text-secondary)] font-medium">
                {n.shade}
              </p>
              <p className="text-[11px] text-[var(--aura-text-faint)] leading-snug">
                {n.match}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
