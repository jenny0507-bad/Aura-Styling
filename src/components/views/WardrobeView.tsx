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
  Check,
  X,
  Shirt,
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
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const allAesthetics = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => item.aesthetics?.forEach((a) => set.add(a)));
    return Array.from(set).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (wearFilter === 'unworn' && (item.timesWorn || 0) > 0) return false;
      if (wearFilter === 'frequently_worn' && (item.timesWorn || 0) < 5) return false;
      if (wearFilter === 'favorites' && !item.isFavorite) return false;

      if (aestheticFilter !== 'all' && !item.aesthetics?.includes(aestheticFilter)) {
        return false;
      }

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

  const hasUnusedItems = useMemo(
    () => items.some((i) => (i.timesWorn || 0) === 0),
    [items]
  );

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Header & Style Unused Action */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--aura-border)] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
            Digital Wardrobe Management
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
            My Curated Closet
          </h1>
          <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-xl">
            Organize your clothes, footwear, jewellery, and accessories in one place and rediscover pieces you wear less often.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {hasUnusedItems && (
            <button
              onClick={onStyleUnused}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--aura-accent)] hover:bg-[var(--aura-accent-hover)] text-white text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Style My Unused Clothes</span>
            </button>
          )}

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 px-6 bg-[var(--aura-surface)] rounded-3xl border border-[var(--aura-border)] space-y-5">
          <div className="w-14 h-14 rounded-full bg-[var(--aura-canvas)] flex items-center justify-center mx-auto text-[var(--aura-text-faint)]">
            <Shirt className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h3 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
              Your wardrobe is empty
            </h3>
            <p className="text-xs text-[var(--aura-text-subtle)] max-w-md mx-auto leading-relaxed">
              Upload photos of your tops, trousers, dresses, footwear, jewellery, and bags. AI will automatically categorize each piece so you can build outfits exclusively from what you own.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Your First Piece</span>
          </button>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-4 py-2 text-xs rounded-full whitespace-nowrap transition-colors cursor-pointer font-medium ${
                    isActive
                      ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)]'
                      : 'bg-[var(--aura-surface)] text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)] border border-[var(--aura-border)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-[var(--aura-surface)] rounded-2xl border border-[var(--aura-border)] shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--aura-text-faint)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by garment, fabric, color, or subcategory..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-transparent focus:outline-none text-[var(--aura-text-primary)] placeholder:text-[var(--aura-text-faint)]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--aura-text-faint)] hover:text-[var(--aura-text-primary)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-[var(--aura-border)] pt-2 sm:pt-0 sm:pl-3">
              {allAesthetics.length > 0 && (
                <select
                  value={aestheticFilter}
                  onChange={(e) => setAestheticFilter(e.target.value)}
                  className="text-xs px-3 py-1.5 bg-[var(--aura-canvas)] border border-[var(--aura-border-strong)] rounded-lg text-[var(--aura-text-body)] focus:outline-none cursor-pointer"
                >
                  <option value="all">All Aesthetics</option>
                  {allAesthetics.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              )}

              <select
                value={wearFilter}
                onChange={(e) => setWearFilter(e.target.value as typeof wearFilter)}
                className="text-xs px-3 py-1.5 bg-[var(--aura-canvas)] border border-[var(--aura-border-strong)] rounded-lg text-[var(--aura-text-body)] focus:outline-none cursor-pointer"
              >
                <option value="all">All Wear Status</option>
                <option value="unworn">Never Worn</option>
                <option value="frequently_worn">Frequently Worn</option>
                <option value="favorites">Favorites Only</option>
              </select>
            </div>
          </div>

          {/* Wardrobe Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-[var(--aura-surface)] rounded-3xl border border-[var(--aura-border)] space-y-4">
              <div className="w-12 h-12 rounded-full bg-[var(--aura-canvas)] flex items-center justify-center mx-auto text-[var(--aura-text-faint)]">
                <Filter className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)]">
                  No clothing items match your filters
                </h3>
                <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-sm mx-auto">
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
                className="text-xs underline text-[var(--aura-accent)] cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => {
                const isUnused = (item.timesWorn || 0) === 0;
                const isConfirmingDelete = confirmDeleteId === item.id;

                return (
                  <div
                    key={item.id}
                    className="group bg-[var(--aura-surface)] rounded-2xl border border-[var(--aura-border)] overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Image Section */}
                    <div className="relative aspect-4/3 bg-[var(--aura-surface-alt)] overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />

                      {/* Favorite button */}
                      <button
                        onClick={() => onToggleFavorite(item.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/85 dark:bg-black/65 backdrop-blur-xs text-[var(--aura-text-primary)] hover:bg-white dark:hover:bg-black/80 shadow-xs transition-colors cursor-pointer"
                        title={item.isFavorite ? 'Remove from favorites' : 'Mark favorite'}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            item.isFavorite ? 'fill-[#A86146] text-[#A86146]' : 'text-[#7A7165] dark:text-[#D4CCC2]'
                          }`}
                        />
                      </button>

                      {/* Unworn or Last Worn Status */}
                      {isUnused ? (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#A86146] text-white text-[10px] uppercase tracking-wider font-semibold shadow-xs">
                          Unworn
                        </div>
                      ) : (
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-[10px] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>
                            {item.timesWorn === 1 ? 'Worn 1 time' : `Worn ${item.timesWorn} times`}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--aura-text-subtle)] uppercase tracking-wider font-medium mb-1">
                          <span>{item.subcategory}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.primaryColor}</span>
                        </div>

                        <h3 className="text-sm font-semibold text-[var(--aura-text-primary)] leading-snug line-clamp-2">
                          {item.name}
                        </h3>

                        {item.stylingTips && (
                          <p className="text-[11px] text-[var(--aura-text-muted)] mt-2 line-clamp-2 italic leading-relaxed">
                            "{item.stylingTips}"
                          </p>
                        )}
                      </div>

                      {item.aesthetics && item.aesthetics.length > 0 && (
                        <div className="pt-2 border-t border-[var(--aura-border-light)] flex flex-wrap items-center gap-1 text-[11px] text-[var(--aura-text-faint)]">
                          {item.aesthetics.slice(0, 2).map((a, i) => (
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
                      )}

                      {/* Action Bar */}
                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--aura-border-light)]">
                        {isConfirmingDelete ? (
                          <div className="flex items-center justify-between w-full gap-2">
                            <span className="text-[11px] text-[#A86146] dark:text-[#D98B6F] font-medium">
                              Remove item?
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  onDeleteItem(item.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2.5 py-1 rounded-md bg-[#A86146] text-white text-[11px] font-medium cursor-pointer"
                              >
                                Remove
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 rounded-md text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] text-[11px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => onLogWear(item.id)}
                              className="text-xs px-3 py-1.5 rounded-lg bg-[var(--aura-canvas)] hover:bg-[var(--aura-surface-hover)] text-[var(--aura-text-primary)] font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Log worn today"
                            >
                              <Check className="w-3 h-3 text-[#4A7856] dark:text-[#78B588]" />
                              <span>Wear Today</span>
                            </button>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1.5 text-[var(--aura-text-faint)] hover:text-[var(--aura-text-primary)] rounded-md hover:bg-[var(--aura-canvas)] transition-colors cursor-pointer"
                                title="Edit garment details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="p-1.5 text-[var(--aura-text-faint)] hover:text-[#A86146] rounded-md hover:bg-[var(--aura-canvas)] transition-colors cursor-pointer"
                                title="Delete item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[var(--aura-surface)] rounded-2xl p-6 shadow-2xl border border-[var(--aura-border)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--aura-border)] pb-3">
              <h3 className="font-editorial text-xl font-semibold text-[var(--aura-text-primary)]">
                Edit Garment Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[var(--aura-text-faint)] hover:text-[var(--aura-text-primary)] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[var(--aura-text-subtle)] mb-1">Garment Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--aura-canvas)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[var(--aura-text-subtle)] mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={editingItem.subcategory}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, subcategory: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[var(--aura-canvas)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[var(--aura-text-subtle)] mb-1">Primary Color</label>
                  <input
                    type="text"
                    value={editingItem.primaryColor}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, primaryColor: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-[var(--aura-canvas)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[var(--aura-text-subtle)] mb-1">Styling Notes</label>
                <textarea
                  rows={2}
                  value={editingItem.stylingTips}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, stylingTips: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[var(--aura-canvas)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--aura-border)]">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateItem(editingItem);
                  setEditingItem(null);
                }}
                className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--aura-btn-primary-text)] bg-[var(--aura-btn-primary)] rounded-full hover:bg-[var(--aura-btn-primary-hover)] cursor-pointer"
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
