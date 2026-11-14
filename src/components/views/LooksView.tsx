import React, { useState } from 'react';
import {
  Bookmark,
  Heart,
  Calendar,
  Eye,
  Trash2,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Outfit, WardrobeItem } from '../../types/wardrobe';

interface LooksViewProps {
  looks: Outfit[];
  wardrobe: WardrobeItem[];
  onSelectForTryOn: (outfit: Outfit) => void;
  onDeleteLook: (id: string) => void;
  onToggleLookFavorite: (id: string) => void;
  onScheduleLook: (day: string, lookId: string) => void;
  onNavigateToStylist: () => void;
}

export const LooksView: React.FC<LooksViewProps> = ({
  looks,
  wardrobe,
  onSelectForTryOn,
  onDeleteLook,
  onToggleLookFavorite,
  onScheduleLook,
  onNavigateToStylist,
}) => {
  const [filterOccasion, setFilterOccasion] = useState<string>('all');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);
  const [scheduleModalOutfit, setScheduleModalOutfit] = useState<Outfit | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const occasions = Array.from(new Set(looks.map((l) => l.occasion)));

  const filteredLooks = looks.filter((l) => {
    if (filterFavoriteOnly && !l.isFavorite) return false;
    if (filterOccasion !== 'all' && l.occasion !== filterOccasion) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--aura-border)] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
            Personal Lookbook & Moodboards
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
            My Saved Looks
          </h1>
          <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-xl">
            Curate your saved outfit combinations and ready-to-wear ensembles.
          </p>
        </div>

        {/* Filters (only relevant when user has saved looks) */}
        {looks.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={filterOccasion}
              onChange={(e) => setFilterOccasion(e.target.value)}
              className="text-xs px-3 py-2 bg-[var(--aura-surface)] border border-[var(--aura-border-strong)] rounded-full text-[var(--aura-text-primary)] cursor-pointer focus:outline-none"
            >
              <option value="all">All Occasions</option>
              {occasions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-full border transition-colors cursor-pointer ${
                filterFavoriteOnly
                  ? 'bg-[#A86146] text-white border-[#A86146]'
                  : 'bg-[var(--aura-surface)] text-[var(--aura-text-secondary)] border-[var(--aura-border-strong)]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${filterFavoriteOnly ? 'fill-current' : ''}`} />
              <span>Favorites</span>
            </button>
          </div>
        )}
      </div>

      {/* Moodboard Cards */}
      {filteredLooks.length === 0 ? (
        <div className="text-center py-20 px-6 bg-[var(--aura-surface)] rounded-3xl border border-[var(--aura-border)] space-y-5">
          <div className="w-12 h-12 rounded-full bg-[var(--aura-canvas)] flex items-center justify-center mx-auto text-[var(--aura-text-faint)]">
            <Bookmark className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)]">
              {looks.length === 0 ? 'No saved looks yet' : 'No looks match your filters'}
            </h3>
            <p className="text-xs text-[var(--aura-text-subtle)] max-w-sm mx-auto leading-relaxed">
              {looks.length === 0
                ? 'Generate outfit combinations in the AI Stylist section and click "Save Look" to curate your personal lookbook.'
                : 'Try switching back to All Occasions or disabling the Favorites filter.'}
            </p>
          </div>
          {looks.length === 0 ? (
            <button
              onClick={onNavigateToStylist}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Wand2 className="w-3.5 h-3.5 text-[var(--aura-accent-gold)]" />
              <span>Open AI Stylist</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setFilterOccasion('all');
                setFilterFavoriteOnly(false);
              }}
              className="text-xs underline text-[var(--aura-accent)] cursor-pointer"
            >
              Show all saved looks
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLooks.map((look) => {
            const firstItem = wardrobe.find((w) => look.itemIds.includes(w.id));
            const heroImage = look.tryOnImageUrl || firstItem?.imageUrl || null;
            const isConfirmingDelete = confirmDeleteId === look.id;

            return (
              <div
                key={look.id}
                className="group bg-[var(--aura-surface)] rounded-3xl border border-[var(--aura-border)] overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Hero / Try-on Image */}
                <div className="relative aspect-4/3 bg-[var(--aura-surface-alt)] overflow-hidden flex items-center justify-center">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={look.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-[var(--aura-text-faint)]" />
                  )}

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleLookFavorite(look.id)}
                      className="p-2 rounded-full bg-white/90 dark:bg-black/65 backdrop-blur-xs text-[var(--aura-text-primary)] hover:bg-[var(--aura-surface)] shadow-xs cursor-pointer transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          look.isFavorite
                            ? 'fill-[#A86146] text-[#A86146] dark:fill-[#D98B6F] dark:text-[#D98B6F]'
                            : 'text-[var(--aura-text-subtle)]'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(look.id)}
                      className="p-2 rounded-full bg-white/90 dark:bg-black/65 backdrop-blur-xs text-[var(--aura-text-subtle)] hover:text-[#A86146] dark:hover:text-[#D98B6F] shadow-xs cursor-pointer transition-colors"
                      title="Delete look"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider font-semibold">
                    {look.occasion}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] text-[var(--aura-text-faint)] uppercase tracking-wider font-medium block mb-1">
                      {look.aesthetic}
                    </span>
                    <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)] leading-snug">
                      {look.title}
                    </h3>
                    <p className="text-xs text-[var(--aura-text-muted)] mt-2 line-clamp-2 leading-relaxed">
                      {look.stylingRationale}
                    </p>
                  </div>

                  {/* Garment thumbnails strip */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--aura-text-faint)] font-semibold block mb-2">
                      Included Wardrobe Items
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {look.itemIds.map((itemId) => {
                        const item = wardrobe.find((w) => w.id === itemId);
                        if (!item) return null;
                        return (
                          <div
                            key={item.id}
                            title={item.name}
                            className="w-10 h-10 rounded-lg overflow-hidden border border-[var(--aura-border)] shrink-0 bg-[var(--aura-canvas)]"
                          >
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[var(--aura-border-light)] flex items-center justify-between gap-2">
                    {isConfirmingDelete ? (
                      <div className="flex items-center justify-between w-full gap-2">
                        <span className="text-xs text-[#A86146] dark:text-[#D98B6F] font-medium">
                          Delete look?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onDeleteLook(look.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-3 py-1 rounded-full bg-[#A86146] text-white text-xs font-medium cursor-pointer"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 text-xs text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onSelectForTryOn(look)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-medium hover:bg-[var(--aura-btn-primary-hover)] transition-colors cursor-pointer shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Try On</span>
                        </button>

                        <button
                          onClick={() => setScheduleModalOutfit(look)}
                          className="p-2 rounded-full border border-[var(--aura-border-strong)] text-[var(--aura-text-primary)] hover:bg-[var(--aura-canvas)] transition-colors cursor-pointer"
                          title="Schedule in Weekly Planner"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
