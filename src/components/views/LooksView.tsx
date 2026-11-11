import React, { useState } from 'react';
import {
  Bookmark,
  Heart,
  Calendar,
  Eye,
  Trash2,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { Outfit, WardrobeItem } from '../../types/wardrobe';

interface LooksViewProps {
  looks: Outfit[];
  wardrobe: WardrobeItem[];
  onSelectForTryOn: (outfit: Outfit) => void;
  onDeleteLook: (id: string) => void;
  onToggleLookFavorite: (id: string) => void;
  onScheduleLook: (day: string, lookId: string) => void;
}

export const LooksView: React.FC<LooksViewProps> = ({
  looks,
  wardrobe,
  onSelectForTryOn,
  onDeleteLook,
  onToggleLookFavorite,
  onScheduleLook,
}) => {
  const [filterOccasion, setFilterOccasion] = useState<string>('all');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);
  const [scheduleModalOutfit, setScheduleModalOutfit] = useState<Outfit | null>(null);

  const occasions = Array.from(new Set(looks.map((l) => l.occasion)));

  const filteredLooks = looks.filter((l) => {
    if (filterFavoriteOnly && !l.isFavorite) return false;
    if (filterOccasion !== 'all' && l.occasion !== filterOccasion) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#8C8275] mb-1 font-medium">
            Personal Lookbook & Moodboards
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[#24211E]">
            My Saved Looks
          </h1>
          <p className="text-xs text-[#7A7165] mt-1 max-w-xl">
            {looks.length} saved fashion combinations. Keep track of your favourite styling
            ideas and ready-to-wear ensembles.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterOccasion}
            onChange={(e) => setFilterOccasion(e.target.value)}
            className="text-xs px-3 py-2 bg-white border border-[#DDD6CB] rounded-full text-[#24211E] cursor-pointer focus:outline-none"
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
                : 'bg-white text-[#5A5246] border-[#DDD6CB]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${filterFavoriteOnly ? 'fill-current' : ''}`} />
            <span>Favorites</span>
          </button>
        </div>
      </div>

      {/* Moodboard Cards */}
      {filteredLooks.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#EAE3D9] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-[#8C8275]">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-[#24211E]">
              No saved looks yet
            </h3>
            <p className="text-xs text-[#7A7165] mt-1 max-w-sm mx-auto">
              Generate new combinations in the AI Stylist section and click "Save Look" to curate
              your personal aesthetic moodboard.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLooks.map((look) => {
            const firstItem = wardrobe.find((w) => look.itemIds.includes(w.id));
            const heroImage =
              look.tryOnImageUrl ||
              firstItem?.imageUrl ||
              '/src/assets/images/fashion_editorial_hero_1794385431993.jpg';

            return (
              <div
                key={look.id}
                className="group bg-white rounded-3xl border border-[#EAE3D9] overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Hero / Try-on Image */}
                <div className="relative aspect-4/3 bg-[#F7F4EE] overflow-hidden">
                  <img
                    src={heroImage}
                    alt={look.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => onToggleLookFavorite(look.id)}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#24211E] hover:bg-white shadow-xs cursor-pointer transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          look.isFavorite
                            ? 'fill-[#A86146] text-[#A86146]'
                            : 'text-[#7A7165]'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Delete "${look.title}"?`)) {
                          onDeleteLook(look.id);
                        }
                      }}
                      className="p-2 rounded-full bg-white/90 backdrop-blur-xs text-[#7A7165] hover:text-[#A86146] shadow-xs cursor-pointer transition-colors"
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
                    <span className="text-[11px] text-[#8C8275] uppercase tracking-wider font-medium block mb-1">
                      {look.aesthetic}
                    </span>
                    <h3 className="font-editorial text-2xl font-semibold text-[#24211E] leading-snug">
                      {look.title}
                    </h3>
                    <p className="text-xs text-[#6E665B] mt-2 line-clamp-2 leading-relaxed">
                      {look.stylingRationale}
                    </p>
                  </div>

                  {/* Garment thumbnails strip */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8C8275] font-semibold block mb-2">
                      Included Wardrobe Items:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                      {look.itemIds.map((itemId) => {
                        const item = wardrobe.find((w) => w.id === itemId);
                        if (!item) return null;
                        return (
                          <div
                            key={item.id}
                            title={item.name}
                            className="w-10 h-10 rounded-lg overflow-hidden border border-[#EAE3D9] shrink-0 bg-[#FAF8F5]"
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
                  <div className="pt-3 border-t border-[#F2ECE4] flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectForTryOn(look)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#24211E] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#38332E] transition-colors cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Try On</span>
                    </button>

                    <button
                      onClick={() => setScheduleModalOutfit(look)}
                      className="p-2 rounded-full border border-[#DDD6CB] text-[#24211E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                      title="Schedule in Weekly Planner"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
