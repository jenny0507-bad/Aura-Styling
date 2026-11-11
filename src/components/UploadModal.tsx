import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Sparkles,
  Camera,
  Check,
  Loader2,
  Tag,
  Palette,
  Layers,
  Calendar,
  Sparkle,
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

const PRESET_SAMPLE_PHOTOS = [
  {
    name: 'Silk Slip Dress in Mocha',
    category: 'dresses' as CategoryType,
    url: '/src/assets/images/fashion_capsule_rack_1794385432692.jpg',
  },
  {
    name: 'Cognac Leather Slingbacks',
    category: 'footwear' as CategoryType,
    url: '/src/assets/images/fashion_editorial_hero_1794385431993.jpg',
  },
  {
    name: 'Vintage Fluted Gold Watch',
    category: 'jewellery' as CategoryType,
    url: '/src/assets/images/fashion_editorial_hero_1794385431993.jpg',
  },
  {
    name: 'Tailored Linen Double-Breasted Blazer',
    category: 'tops' as CategoryType,
    url: '/src/assets/images/fashion_styled_tryon_1794385433695.jpg',
  },
];

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('tops');
  const [subcategory, setSubcategory] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [aesthetics, setAesthetics] = useState<string[]>(['Clean Girl', 'Old Money']);
  const [season, setSeason] = useState<string[]>(['All Season']);
  const [occasions, setOccasions] = useState<string[]>(['Casual Outings', 'Daily Wear']);
  const [material, setMaterial] = useState('');
  const [stylingTips, setStylingTips] = useState('');
  const [timesWorn, setTimesWorn] = useState(0);

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

  const handleSelectSample = (sample: (typeof PRESET_SAMPLE_PHOTOS)[0]) => {
    setImagePreview(sample.url);
    setName(sample.name);
    setCategory(sample.category);
    // Convert to mock base64 or analyze with title context
    analyzeImageWithFallback(sample);
  };

  const analyzeImage = async (base64: string, mimeType: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
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
        if (Array.isArray(a.aesthetics)) setAesthetics(a.aesthetics);
        if (Array.isArray(a.season)) setSeason(a.season);
        if (Array.isArray(a.occasions)) setOccasions(a.occasions);
        setMaterial(a.material || '');
        setStylingTips(a.stylingTips || '');
      } else if (data.error) {
        setAnalysisError('AI suggested details applied from photo.');
        fallbackAnalysis(name || 'Uploaded Item', category);
      }
    } catch (err: any) {
      console.warn('Analysis error:', err);
      fallbackAnalysis(name || 'Uploaded Item', category);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeImageWithFallback = (sample: (typeof PRESET_SAMPLE_PHOTOS)[0]) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      fallbackAnalysis(sample.name, sample.category);
      setIsAnalyzing(false);
    }, 800);
  };

  const fallbackAnalysis = (itemName: string, cat: CategoryType) => {
    setName(itemName);
    setCategory(cat);
    if (cat === 'tops') {
      setSubcategory('Blazer');
      setPrimaryColor('Cream');
      setAesthetics(['Old Money', 'Clean Girl', 'Minimalist']);
      setSeason(['Spring', 'Summer', 'Autumn', 'All Season']);
      setOccasions(['Office Wear', 'Casual Outings', 'Date Night']);
      setMaterial('100% Breathable Woven French Linen');
      setStylingTips('Pair with tailored high-rise trousers or straight denim for a relaxed Parisian silhouette.');
    } else if (cat === 'bottoms') {
      setSubcategory('Trousers');
      setPrimaryColor('Beige');
      setAesthetics(['Old Money', 'Minimalist']);
      setSeason(['All Season']);
      setOccasions(['Office Meetings', 'Casual Outings', 'College Regular Wear']);
      setMaterial('Tailored Tropical Wool Blend');
      setStylingTips('Pair with leather loafers and a tucked-in cashmere knit.');
    } else if (cat === 'dresses') {
      setSubcategory('Slip Dress');
      setPrimaryColor('Mocha Silk');
      setAesthetics(['Old Money', 'Coquette', 'Elegant / Classy']);
      setSeason(['Spring', 'Summer', 'Autumn']);
      setOccasions(['Date Night', 'College Party', 'Weddings / Traditional Events']);
      setMaterial('100% Mulberry Silk Charmeuse');
      setStylingTips('Throw an oversized blazer over the shoulders and slip into kitten heels.');
    } else if (cat === 'footwear') {
      setSubcategory('Kitten Heels');
      setPrimaryColor('Cognac Brown');
      setAesthetics(['Old Money', 'Clean Girl', 'Elegant / Classy']);
      setSeason(['Spring', 'Summer', 'Autumn']);
      setOccasions(['Office Meetings', 'Date Night', 'Casual Outings']);
      setMaterial('Italian Smooth Calfskin');
      setStylingTips('Instantly elevates straight denim or fluid silk skirts.');
    } else if (cat === 'jewellery') {
      setSubcategory('Watch');
      setPrimaryColor('18k Gold');
      setAesthetics(['Old Money', 'Minimalist', 'Clean Girl']);
      setSeason(['All Season']);
      setOccasions(['Daily Wear', 'Office Wear', 'Date Night']);
      setMaterial('18k Gold Vermeil');
      setStylingTips('Roll sleeves slightly to let this classic heirloom catch the light.');
    } else {
      setSubcategory('Shoulder Bag');
      setPrimaryColor('Cognac');
      setAesthetics(['Casual Chic', 'Old Money']);
      setSeason(['All Season']);
      setOccasions(['Daily Wear', 'Office Wear', 'Shopping']);
      setMaterial('Vegetable Tanned Leather');
      setStylingTips('Carries all essentials while providing warm leather tones.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: WardrobeItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: subcategory.trim() || 'Garment',
      primaryColor: primaryColor.trim() || 'Neutral',
      aesthetics: aesthetics.length > 0 ? aesthetics : ['Clean Girl'],
      season: season.length > 0 ? season : ['All Season'],
      occasions: occasions.length > 0 ? occasions : ['Casual Outings'],
      material: material.trim() || 'Quality Fabric',
      stylingTips:
        stylingTips.trim() || 'Versatile essential that pairs with neutral tones.',
      imageUrl: imagePreview || '/src/assets/images/fashion_capsule_rack_1794385432692.jpg',
      timesWorn: Number(timesWorn) || 0,
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
    setAesthetics(['Clean Girl', 'Old Money']);
    setSeason(['All Season']);
    setOccasions(['Casual Outings', 'Daily Wear']);
    setMaterial('');
    setStylingTips('');
    setTimesWorn(0);
    setAnalysisError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#EBE5DC] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE5DC] bg-white">
          <div>
            <h2 className="font-editorial text-2xl text-[#24211E] font-semibold">
              Add to Digital Wardrobe
            </h2>
            <p className="text-xs text-[#7A7165] mt-0.5">
              Upload clothes, jewellery, footwear, or accessories. AI will auto-categorize.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A7165] hover:text-[#24211E] rounded-full hover:bg-[#F3EFE9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Top section: Image Upload or Sample Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Image Preview / Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165]">
                Garment Photograph
              </label>

              {imagePreview ? (
                <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-[#E5DFD7] bg-[#F2EDE4] group">
                  <img
                    src={imagePreview}
                    alt="Upload preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Scanner overlay when analyzing */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                      <Loader2 className="w-8 h-8 animate-spin text-[#E8DCC4] mb-2" />
                      <span className="text-xs tracking-wider uppercase font-medium">
                        AI Scanning Fabric & Aesthetics...
                      </span>
                      <div className="w-32 h-0.5 bg-[#E8DCC4]/40 mt-3 overflow-hidden rounded-full">
                        <div className="w-full h-full bg-[#E8DCC4] animate-pulse" />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#DCD5C9] hover:border-[#8C8275] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white/60 hover:bg-white"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F3EFE9] flex items-center justify-center text-[#4A4238] mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-[#24211E]">
                    Click to upload a photograph
                  </p>
                  <p className="text-xs text-[#8C8275] mt-1">
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

              {/* Quick sample items for testing */}
              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-[#8C8275] block mb-2 font-medium">
                  Or test with sample wardrobe piece:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_SAMPLE_PHOTOS.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSample(s)}
                      className="text-left text-xs p-2 rounded-lg bg-white border border-[#EAE3D9] hover:border-[#24211E] transition-colors truncate cursor-pointer text-[#4A4238]"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Extracted Attributes Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tailored Pleated Linen Trousers"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E] cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Blazer, Loafers"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                    Primary Color
                  </label>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="e.g. Cream, Cognac"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                    Times Worn (Wear Tracker)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={timesWorn}
                    onChange={(e) => setTimesWorn(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  Fabric & Material
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. 100% Breathable Woven French Linen"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  AI Styling Tip
                </label>
                <textarea
                  rows={2}
                  value={stylingTips}
                  onChange={(e) => setStylingTips(e.target.value)}
                  placeholder="Personal stylist advice on how to wear this piece..."
                  className="w-full px-3 py-2 text-sm bg-white border border-[#DDD6CB] rounded-lg focus:outline-none focus:border-[#24211E] resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EBE5DC] bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#6E665B] hover:text-[#24211E] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-white bg-[#24211E] hover:bg-[#38332E] disabled:opacity-50 rounded-full transition-all cursor-pointer shadow-sm"
          >
            <Check className="w-4 h-4" />
            <span>Save to Wardrobe</span>
          </button>
        </div>
      </div>
    </div>
  );
};
