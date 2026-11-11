import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Plus,
  Eye,
  Trash2,
  Sparkles,
  CloudSun,
  Sun,
  CloudRain,
  Wind,
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
  { day: 'Monday', weather: '19°C · Mild & Crisp', icon: CloudSun },
  { day: 'Tuesday', weather: '22°C · Sunny', icon: Sun },
  { day: 'Wednesday', weather: '17°C · Light Rain', icon: CloudRain },
  { day: 'Thursday', weather: '20°C · Breezy', icon: Wind },
  { day: 'Friday', weather: '24°C · Warm Golden', icon: Sun },
  { day: 'Saturday', weather: '23°C · Sunlit Strolls', icon: Sun },
  { day: 'Sunday', weather: '21°C · Relaxed Mild', icon: CloudSun },
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

  const handleWearLogged = (outfit: Outfit) => {
    onLogOutfitWorn(outfit.itemIds);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#8C8275] mb-1 font-medium">
            Daily & Weekly Wardrobe Scheduling
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[#24211E]">
            Weekly Outfit Planner
          </h1>
          <p className="text-xs text-[#7A7165] mt-1 max-w-xl">
            Never stress about morning dressing again. Schedule coordinated outfits for every
            day of the week and keep track of your wear logs.
          </p>
        </div>

        <button
          onClick={onNavigateToStylist}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#24211E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#38332E] transition-all cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C8A876]" />
          <span>Generate New Outfit in Stylist</span>
        </button>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map(({ day, weather, icon: WeatherIcon }) => {
          const lookId = planner[day];
          const scheduledOutfit = looks.find((l) => l.id === lookId);

          return (
            <div
              key={day}
              className={`rounded-2xl p-4 flex flex-col justify-between border transition-all ${
                scheduledOutfit
                  ? 'bg-white border-[#EAE3D9] shadow-xs'
                  : 'bg-[#FAF8F5] border-dashed border-[#DDD6CB]'
              }`}
            >
              {/* Day Header */}
              <div className="border-b border-[#F2ECE4] pb-2.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="font-editorial text-lg font-semibold text-[#24211E]">
                    {day}
                  </span>
                  <WeatherIcon className="w-4 h-4 text-[#9A7B4F]" />
                </div>
                <span className="text-[10px] text-[#8C8275] block mt-0.5">
                  {weather}
                </span>
              </div>

              {/* Outfit Content or Empty State */}
              <div className="flex-1 flex flex-col justify-center">
                {scheduledOutfit ? (
                  <div className="space-y-3">
                    <div className="aspect-square rounded-xl overflow-hidden bg-[#F7F4EE] relative group">
                      <img
                        src={
                          scheduledOutfit.tryOnImageUrl ||
                          wardrobe.find((w) => scheduledOutfit.itemIds.includes(w.id))?.imageUrl ||
                          '/src/assets/images/fashion_editorial_hero_1794385431993.jpg'
                        }
                        alt={scheduledOutfit.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => onSelectForTryOn(scheduledOutfit)}
                          className="p-1.5 rounded-full bg-white text-[#24211E] shadow cursor-pointer"
                          title="Try On"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUnscheduleOutfit(day)}
                          className="p-1.5 rounded-full bg-white text-[#A86146] shadow cursor-pointer"
                          title="Remove from day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8C8275] uppercase tracking-wider block font-medium truncate">
                        {scheduledOutfit.occasion}
                      </span>
                      <h4 className="text-xs font-semibold text-[#24211E] line-clamp-1">
                        {scheduledOutfit.title}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleWearLogged(scheduledOutfit)}
                      className="w-full py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#24211E] text-[11px] font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle className="w-3 h-3 text-[#4A7856]" />
                      <span>Log Worn</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <button
                      onClick={() => setSelectedDayToAssign(day)}
                      className="flex flex-col items-center justify-center gap-2 p-3 text-xs text-[#8C8275] hover:text-[#24211E] cursor-pointer mx-auto"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border border-[#DDD6CB] flex items-center justify-center text-[#8C8275]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#EAE3D9] space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <div>
                <h3 className="font-editorial text-xl font-semibold text-[#24211E]">
                  Assign Outfit for {selectedDayToAssign}
                </h3>
                <p className="text-xs text-[#7A7165]">
                  Select from your saved combinations
                </p>
              </div>
              <button
                onClick={() => setSelectedDayToAssign(null)}
                className="text-[#8C8275] hover:text-[#24211E]"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 p-1">
              {looks.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    onScheduleOutfit(selectedDayToAssign, l.id);
                    setSelectedDayToAssign(null);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#EAE3D9] hover:border-[#24211E] cursor-pointer transition-colors bg-[#FAF8F5]"
                >
                  <img
                    src={
                      l.tryOnImageUrl ||
                      wardrobe.find((w) => l.itemIds.includes(w.id))?.imageUrl ||
                      '/src/assets/images/fashion_editorial_hero_1794385431993.jpg'
                    }
                    alt={l.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold text-[#24211E] block truncate">
                      {l.title}
                    </span>
                    <span className="text-[11px] text-[#7A7165] block truncate">
                      {l.occasion} · {l.aesthetic}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#9A7B4F]">Select →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
