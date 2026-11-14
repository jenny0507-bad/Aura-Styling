import React, { useState } from 'react';
import {
  CheckCircle,
  Plus,
  Eye,
  Trash2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Outfit, WardrobeItem } from '../../types/wardrobe';

interface PlannerViewProps {
  planner: Record<string, string>;
  looks: Outfit[];
  wardrobe: WardrobeItem[];
  onScheduleOutfit: (day: string, lookId: string) => void;
  onUnscheduleOutfit: (day: string) => void;
  onLogOutfitWorn: (itemIds: string[]) => void;
  onSelectForTryOn: (outfit: Outfit) => void;
  onNavigateToStylist: () => void;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const JS_DAY_TO_NAME = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const PlannerView: React.FC<PlannerViewProps> = ({
  planner,
  looks,
  wardrobe,
  onScheduleOutfit,
  onUnscheduleOutfit,
  onLogOutfitWorn,
  onSelectForTryOn,
  onNavigateToStylist,
}) => {
  const [selectedDayToAssign, setSelectedDayToAssign] = useState<string | null>(null);
  const [loggedDay, setLoggedDay] = useState<string | null>(null);

  const todayName = JS_DAY_TO_NAME[new Date().getDay()];

  const handleWearLogged = (day: string, outfit: Outfit) => {
    onLogOutfitWorn(outfit.itemIds);
    setLoggedDay(day);
    setTimeout(() => setLoggedDay((curr) => (curr === day ? null : curr)), 2000);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--aura-border)] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
            Daily & Weekly Wardrobe Scheduling
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
            Weekly Outfit Planner
          </h1>
          <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-xl">
            Schedule saved outfits for every day of the week and log when you wear them.
          </p>
        </div>

        <button
          onClick={onNavigateToStylist}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--aura-btn-primary-hover)] transition-all cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--aura-accent-gold)]" />
          <span>Generate New Outfit in Stylist</span>
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const lookId = planner[day];
          const scheduledOutfit = looks.find((l) => l.id === lookId);
          const isToday = day === todayName;
          const previewImg = scheduledOutfit
            ? scheduledOutfit.tryOnImageUrl ||
              wardrobe.find((w) => scheduledOutfit.itemIds.includes(w.id))?.imageUrl ||
              null
            : null;

          return (
            <div
              key={day}
              className={`rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                scheduledOutfit
                  ? 'bg-[var(--aura-surface)] border-[var(--aura-border)] shadow-xs'
                  : 'bg-[var(--aura-canvas)] border-dashed border-[var(--aura-border-strong)]'
              } ${isToday ? 'ring-1 ring-[var(--aura-accent)]/40' : ''}`}
            >
              {/* Day Header */}
              <div className="border-b border-[var(--aura-border-light)] pb-2.5 mb-3 flex items-center justify-between">
                <span className="font-editorial text-lg font-semibold text-[var(--aura-text-primary)]">
                  {day}
                </span>
                {isToday && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--aura-accent)]">
                    Today
                  </span>
                )}
              </div>

              {/* Outfit Content or Empty State */}
              <div className="flex-1 flex flex-col justify-center">
                {scheduledOutfit ? (
                  <div className="space-y-3">
                    <div className="aspect-square rounded-xl overflow-hidden bg-[var(--aura-surface-alt)] relative group flex items-center justify-center">
                      {previewImg ? (
                        <img
                          src={previewImg}
                          alt={scheduledOutfit.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Sparkles className="w-6 h-6 text-[var(--aura-text-faint)]" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => onSelectForTryOn(scheduledOutfit)}
                          className="p-1.5 rounded-full bg-[var(--aura-surface)] text-[var(--aura-text-primary)] shadow cursor-pointer"
                          title="Try On"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUnscheduleOutfit(day)}
                          className="p-1.5 rounded-full bg-[var(--aura-surface)] text-[#A86146] dark:text-[#D98B6F] shadow cursor-pointer"
                          title="Remove from day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[var(--aura-text-faint)] uppercase tracking-wider block font-medium truncate">
                        {scheduledOutfit.occasion}
                      </span>
                      <h4 className="text-xs font-semibold text-[var(--aura-text-primary)] line-clamp-1">
                        {scheduledOutfit.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleWearLogged(day, scheduledOutfit)}
                      className="w-full py-1.5 rounded-lg bg-[var(--aura-canvas)] hover:bg-[var(--aura-surface-hover)] text-[var(--aura-text-primary)] text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3 text-[#4A7856] dark:text-[#78B588]" />
                      <span>{loggedDay === day ? 'Logged' : 'Log Worn'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <button
                      onClick={() => setSelectedDayToAssign(day)}
                      className="flex flex-col items-center justify-center gap-2 p-3 text-xs text-[var(--aura-text-faint)] hover:text-[var(--aura-text-primary)] cursor-pointer mx-auto"
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--aura-surface)] border border-[var(--aura-border-strong)] flex items-center justify-center text-[var(--aura-text-faint)]">
                        <Plus className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-[11px]">Assign Outfit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to Assign Outfit to Day */}
      {selectedDayToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--aura-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--aura-border)] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[var(--aura-border)] pb-3">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[var(--aura-text-primary)]">
                  Assign Outfit for {selectedDayToAssign}
                </h3>
                <p className="text-xs text-[var(--aura-text-subtle)]">
                  Select from your saved combinations
                </p>
              </div>
              <button
                onClick={() => setSelectedDayToAssign(null)}
                className="text-[var(--aura-text-faint)] hover:text-[var(--aura-text-primary)] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {looks.length === 0 ? (
              <div className="py-10 text-center space-y-4">
                <p className="text-xs text-[var(--aura-text-subtle)] max-w-xs mx-auto leading-relaxed">
                  You haven't saved any outfits yet. Generate and save an outfit in the AI Stylist first.
                </p>
                <button
                  onClick={() => {
                    setSelectedDayToAssign(null);
                    onNavigateToStylist();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--aura-btn-primary-hover)] transition-colors cursor-pointer"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[var(--aura-accent-gold)]" />
                  <span>Go to AI Stylist</span>
                </button>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-3 flex-1 p-1">
                {looks.map((l) => {
                  const thumb =
                    l.tryOnImageUrl ||
                    wardrobe.find((w) => l.itemIds.includes(w.id))?.imageUrl ||
                    null;

                  return (
                    <div
                      key={l.id}
                      onClick={() => {
                        onScheduleOutfit(selectedDayToAssign, l.id);
                        setSelectedDayToAssign(null);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[var(--aura-border)] hover:border-[var(--aura-text-primary)] cursor-pointer transition-colors bg-[var(--aura-canvas)]"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[var(--aura-surface)] shrink-0 flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={l.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Sparkles className="w-4 h-4 text-[var(--aura-accent)]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-semibold text-[var(--aura-text-primary)] block truncate">
                          {l.title}
                        </span>
                        <span className="text-[11px] text-[var(--aura-text-subtle)] block truncate">
                          {l.occasion} · {l.aesthetic}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[var(--aura-accent)]">Select →</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
