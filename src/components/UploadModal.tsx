import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Check,
  Loader2,
} from 'lucide-react';
import { CategoryType, WardrobeItem } from '../types/wardrobe';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: WardrobeItem) => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'tops', label: 'Tops & Shirts' },
  { id: 'bottoms', label: 'Trousers & Jeans' },
  { id: 'dresses', label: 'Dresses & Sets' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'accessories', label: 'Accessories & Bags' },
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisNote, setAnalysisNote] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('tops');
  const [subcategory, setSubcategory] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [aesthetics, setAesthetics] = useState<string[]>(['Clean Girl', 'Casual Chic']);
  const [season, setSeason] = useState<string[]>(['All Season']);
  const [occasions, setOccasions] = useState<string[]>(['Casual Outings', 'Daily Wear']);
  const [material, setMaterial] = useState('');
  const [stylingTips, setStylingTips] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        analyzeImage(base64, file.type || 'image/jpeg');
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setAnalysisNote(null);
    try {
      const response = await fetch('/api/ai/analyze-clothing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType }),
      });
      const data = await response.json();
      if (data.analysis) {
        const a = data.analysis;
        setName(a.title || '');
        if (a.category && CATEGORIES.some((c) => c.id === a.category)) {
          setCategory(a.category as CategoryType);
        }
        setSubcategory(a.subcategory || '');
        setPrimaryColor(a.primaryColor || '');
        if (Array.isArray(a.aesthetics) && a.aesthetics.length > 0) setAesthetics(a.aesthetics);
        if (Array.isArray(a.season) && a.season.length > 0) setSeason(a.season);
        if (Array.isArray(a.occasions) && a.occasions.length > 0) setOccasions(a.occasions);
        setMaterial(a.material || '');
        setStylingTips(a.stylingTips || '');
      } else {
        setAnalysisNote('Photo attached. Enter item details below to save.');
      }
    } catch {
      setAnalysisNote('Photo attached. Enter item details below to save.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !name.trim()) return;

    const newItem: WardrobeItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'Item',
      primaryColor: primaryColor.trim() || 'Neutral',
      aesthetics: aesthetics.length > 0 ? aesthetics : ['Casual Chic'],
      season: season.length > 0 ? season : ['All Season'],
      occasions: occasions.length > 0 ? occasions : ['Casual Outings', 'Daily Wear'],
      material: material.trim() || '',
      stylingTips: stylingTips.trim() || '',
      imageUrl: imagePreview,
      timesWorn: 0,
      lastWornDate: null,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    };

    onSave(newItem);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setImagePreview(null);
    setName('');
    setCategory('tops');
    setSubcategory('');
    setPrimaryColor('');
    setAesthetics(['Clean Girl', 'Casual Chic']);
    setSeason(['All Season']);
    setOccasions(['Casual Outings', 'Daily Wear']);
    setMaterial('');
    setStylingTips('');
    setAnalysisNote(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[var(--aura-canvas)] rounded-2xl shadow-2xl border border-[var(--aura-border)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--aura-border)] bg-[var(--aura-surface)]">
          <div>
            <h2 className="font-editorial text-2xl text-[var(--aura-text-primary)] font-semibold">
              Add to Digital Wardrobe
            </h2>
            <p className="text-xs text-[var(--aura-text-subtle)] mt-0.5">
              Upload clothes, jewellery, footwear, or accessories. AI will auto-categorize.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] rounded-full hover:bg-[var(--aura-surface-alt)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)]">
                Item Photograph
              </label>

              {imagePreview ? (
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-[var(--aura-border)] bg-[var(--aura-surface-alt)] group">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                      <Loader2 className="w-8 h-8 animate-spin text-[#E8DCC4] mb-2" />
                      <span className="text-xs tracking-wider uppercase font-medium">
                        Analyzing Item Details...
                      </span>
                      <div className="w-32 h-0.5 bg-[#E8DCC4]/40 mt-3 overflow-hidden rounded-full">
                        <div className="w-full h-full bg-[#E8DCC4] animate-pulse" />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setAnalysisNote(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[var(--aura-border-dashed)] hover:border-[var(--aura-text-faint)] rounded-xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[var(--aura-surface)]/80 hover:bg-[var(--aura-surface)] aspect-4/3"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--aura-surface-alt)] flex items-center justify-center text-[var(--aura-text-body)] mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-[var(--aura-text-primary)]">
                    Click to upload a photograph
                  </p>
                  <p className="text-xs text-[var(--aura-text-faint)] mt-1">
                    Supports JPG, PNG, WEBP from phone camera or gallery
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {analysisNote && (
                <p className="text-xs text-[var(--aura-text-subtle)]">{analysisNote}</p>
              )}
            </div>

            {/* Attributes Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cream Linen Blazer"
                  className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg focus:outline-none focus:border-[var(--aura-text-primary)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg focus:outline-none focus:border-[var(--aura-text-primary)] cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Blazer, Loafers"
                    className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg focus:outline-none focus:border-[var(--aura-text-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                    Primary Color
                  </label>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="e.g. Cream, Black"
                    className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg focus:outline-none focus:border-[var(--aura-text-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                    Fabric & Material
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. Cotton, Linen, Gold"
                    className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg focus:outline-none focus:border-[var(--aura-text-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                  Styling Notes
                </label>
                <textarea
                  rows={2}
                  value={stylingTips}
                  onChange={(e) => setStylingTips(e.target.value)}
                  placeholder="Optional notes on how you like to pair this piece..."
                  className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-lg focus:outline-none focus:border-[var(--aura-text-primary)] resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--aura-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imagePreview || !name.trim() || isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-[var(--aura-btn-primary-text)] bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all cursor-pointer shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Save to Wardrobe</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
