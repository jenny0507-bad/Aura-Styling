import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Heart,
  Plus,
  Trash2,
  Edit2,
  Clock,
  Sparkles,
  Tag,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { CategoryType, WardrobeItem } from '../../types/wardrobe';

interface WardrobeViewProps {
  items: WardrobeItem[];
  onOpenUpload: () => void;
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onLogWear: (id: string) => void;
  onUpdateItem: (item: WardrobeItem) => void;
  onStyleUnused: () => void;
  onSelectForTryOnItem?: (item: WardrobeItem) => void;
}

const CATEGORY_TABS: { id: CategoryType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Items' },
  { id: 'tops', label: 'Tops & Shirts' },
  { id: 'bottoms', label: 'Trousers & Jeans' },
  { id: 'dresses', label: 'Dresses & Sets' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'accessories', label: 'Accessories & Bags' },
];

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  items,
  onOpenUpload,
  onDeleteItem,
  onToggleFavorite,
  onLogWear,
  onUpdateItem,
  onStyleUnused,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aestheticFilter, setAestheticFilter] = useState<string>('all');
  const [wearFilter, setWearFilter] = useState<'all' | 'unworn' | 'frequently_worn' | 'favorites'>('all');
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);

  // Derive unique aesthetics from items
  const allAesthetics = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => item.aesthetics?.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Wear filter
      if (wearFilter === 'unworn' && (item.timesWorn || 0) > 0) return false;
      if (wearFilter === 'frequently_worn' && (item.timesWorn || 0) < 5) return false;
      if (wearFilter === 'favorites' && !item.isFavorite) return false;

      // Aesthetic filter
      if (aestheticFilter !== 'all' && !item.aesthetics?.includes(aestheticFilter)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchSub = item.subcategory?.toLowerCase().includes(q);
        const matchColor = item.primaryColor?.toLowerCase().includes(q);
        const matchMat = item.material?.toLowerCase().includes(q);
        if (!matchName && !matchSub && !matchColor && !matchMat) return false;
      }

      return true;
    });
  }, [items, selectedCategory, wearFilter, aestheticFilter, searchQuery]);

  const unwornCount = useMemo(
    () => items.filter((i) => (i.timesWorn || 0) === 0).length,
    [items]
  );

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header & Style Unused Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EAE3D9] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#8C8275] mb-1 font-medium">
            Digital Wardrobe Management
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[#24211E]">
            My Curated Closet
          </h1>
          <p className="text-xs text-[#7A7165] mt-1 max-w-xl">
            {items.length} items cataloged. Real-time wear tracking helps you balance your
            capsule and rediscover neglected clothing.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {unwornCount > 0 && (
            <button
              onClick={onStyleUnused}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#9A7B4F] hover:bg-[#866A42] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Style My {unwornCount} Unused Clothes</span>
            </button>
          )}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#24211E] hover:bg-[#38332E] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (Segmented Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          const count =
            tab.id === 'all'
              ? items.length
              : items.filter((i) => i.category === tab.id).length;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 text-xs rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
                isActive
                  ? 'bg-[#24211E] text-white'
                  : 'bg-white text-[#6E665B] hover:text-[#24211E] border border-[#EAE3D9]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-60 tabular-nums">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-[#EAE3D9] shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C8275] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by garment, fabric, color, or subcategory..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-transparent focus:outline-none text-[#24211E] placeholder:text-[#9A9184]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8275] hover:text-[#24211E]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-[#EAE3D9] pt-2 sm:pt-0 sm:pl-3">
          {/* Aesthetic Selector */}
          <select
            value={aestheticFilter}
            onChange={(e) => setAestheticFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD6CB] rounded-lg text-[#4A4238] focus:outline-none cursor-pointer"
          >
            <option value="all">All Aesthetics</option>
            {allAesthetics.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Wear Status Selector */}
          <select
            value={wearFilter}
            onChange={(e) => setWearFilter(e.target.value as any)}
            className="text-xs px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD6CB] rounded-lg text-[#4A4238] focus:outline-none cursor-pointer"
          >
            <option value="all">All Wear Status</option>
            <option value="unworn">Never Worn ({unwornCount})</option>
            <option value="frequently_worn">Most Worn (5+)</option>
            <option value="favorites">Favorites Only</option>
          </select>
        </div>
      </div>

      {/* Wardrobe Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#EAE3D9] space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto text-[#8C8275]">
            <Filter className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-editorial text-2xl font-semibold text-[#24211E]">
              No clothing items found
            </h3>
            <p className="text-xs text-[#7A7165] mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filter selections, or upload new pieces.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setAestheticFilter('all');
              setWearFilter('all');
            }}
            className="text-xs underline text-[#9A7B4F] cursor-pointer"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const isUnused = (item.timesWorn || 0) === 0;

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[#EAE3D9] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image Section */}
                <div className="relative aspect-4/3 bg-[#F7F4EE] overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Favorite button */}
                  <button
                    onClick={() => onToggleFavorite(item.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-[#24211E] hover:bg-white shadow-xs transition-colors cursor-pointer"
                    title={item.isFavorite ? 'Remove from favorites' : 'Mark favorite'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        item.isFavorite ? 'fill-[#A86146] text-[#A86146]' : 'text-[#7A7165]'
                      }`}
                    />
                  </button>

                  {/* Unused Indicator Badge */}
                  {isUnused && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#A86146] text-white text-[10px] uppercase tracking-wider font-semibold shadow-xs">
                      Unworn
                    </div>
                  )}

                  {/* Wear Count overlay at bottom */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>
                      {item.timesWorn === 1
                        ? 'Worn 1 time'
                        : `Worn ${item.timesWorn || 0} times`}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Unboxed Metadata Line (anti-pill discipline) */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#7A7165] uppercase tracking-wider font-medium mb-1">
                      <span>{item.subcategory}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.primaryColor}</span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#24211E] leading-snug line-clamp-2">
                      {item.name}
                    </h3>

                    {item.stylingTips && (
                      <p className="text-[11px] text-[#6E665B] mt-2 line-clamp-2 italic leading-relaxed">
                        "{item.stylingTips}"
                      </p>
                    )}
                  </div>

                  {/* Aesthetics unboxed tags */}
                  <div className="pt-2 border-t border-[#F2ECE4] flex flex-wrap items-center gap-1 text-[11px] text-[#8C8275]">
                    {item.aesthetics?.slice(0, 2).map((a, i) => (
                      <span key={a}>
                        {a}
                        {i < Math.min(item.aesthetics.length, 2) - 1 && (
                          <span className="mx-1" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#F2ECE4]">
                    <button
                      onClick={() => onLogWear(item.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9DF] text-[#24211E] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Increment wear count by 1"
                    >
                      <Check className="w-3 h-3 text-[#4A7856]" />
                      <span>Wear Today</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-[#8C8275] hover:text-[#24211E] rounded-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Edit garment details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from your wardrobe?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-1.5 text-[#8C8275] hover:text-[#A86146] rounded-md hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-[#EAE3D9] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
              <h3 className="font-editorial text-xl font-semibold text-[#24211E]">
                Edit Garment Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#8C8275] hover:text-[#24211E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#7A7165] mb-1">Garment Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#DDD6CB] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#7A7165] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={editingItem.subcategory}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, subcategory: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#DDD6CB] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#7A7165] mb-1">Primary Color</label>
                  <input
                    type="text"
                    value={editingItem.primaryColor}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, primaryColor: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#DDD6CB] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#7A7165] mb-1">Times Worn</label>
                <input
                  type="number"
                  min="0"
                  value={editingItem.timesWorn}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      timesWorn: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full px-3 py-2 border border-[#DDD6CB] rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-[#7A7165] mb-1">AI Styling Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.stylingTips}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, stylingTips: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#DDD6CB] rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE3D9]">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs text-[#7A7165] hover:text-[#24211E]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateItem(editingItem);
                  setEditingItem(null);
                }}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#24211E] rounded-full hover:bg-[#38332E]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
