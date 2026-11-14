import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  ShieldCheck,
  Loader2,
  Sparkle,
  Wand2,
} from 'lucide-react';
import { Outfit, WardrobeItem, UserProfile } from '../../types/wardrobe';

interface TryOnViewProps {
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  looks: Outfit[];
  selectedOutfit: Outfit | null;
  onUpdateProfilePhoto: (photoUrl: string) => void;
  onSelectOutfit: (outfit: Outfit) => void;
  onSaveLook: (outfit: Outfit) => void;
  onNavigateToStylist: () => void;
}

export const TryOnView: React.FC<TryOnViewProps> = ({
  profile,
  wardrobe,
  looks,
  selectedOutfit,
  onUpdateProfilePhoto,
  onSelectOutfit,
  onSaveLook,
  onNavigateToStylist,
}) => {
  const [activeOutfit, setActiveOutfit] = useState<Outfit | null>(
    selectedOutfit || looks[0] || null
  );
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState(false);
  const [tryOnImage, setTryOnImage] = useState<string | null>(
    (selectedOutfit || looks[0])?.tryOnImageUrl || null
  );
  const [tryOnStatus, setTryOnStatus] = useState<string | null>(null);
  const [tryOnMessage, setTryOnMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'comparison' | 'tryon_only' | 'reference_only'>('comparison');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = selectedOutfit || activeOutfit || looks[0] || null;
    if (next && next.id !== activeOutfit?.id) {
      setActiveOutfit(next);
      setTryOnImage(next.tryOnImageUrl || null);
      setTryOnMessage(null);
    } else if (!next) {
      setActiveOutfit(null);
      setTryOnImage(null);
    }
  }, [selectedOutfit, looks]);

  const handleSelectOutfit = (outfit: Outfit) => {
    setActiveOutfit(outfit);
    onSelectOutfit(outfit);
    setTryOnImage(outfit.tryOnImageUrl || null);
    setTryOnMessage(null);
  };

  const handleUploadNewReferencePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateProfilePhoto(base64);
        setTryOnMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAiTryOn = async () => {
    if (!activeOutfit) return;
    if (!profile.fullBodyPhotoUrl) {
      setTryOnMessage('Please upload your full-body reference photograph first.');
      return;
    }

    setIsGeneratingTryOn(true);
    setTryOnMessage(null);
    setTryOnStatus('Analyzing posture and proportions...');

    try {
      const garments = activeOutfit.itemIds
        .map((id) => wardrobe.find((w) => w.id === id))
        .filter(Boolean)
        .map((item) => `${item!.name} (${item!.primaryColor} ${item!.subcategory})`);

      setTryOnStatus('Rendering outfit on your photograph...');

      const response = await fetch('/api/ai/try-on', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPhotoBase64: profile.fullBodyPhotoUrl,
          outfitTitle: activeOutfit.title,
          outfitDescription: activeOutfit.stylingRationale,
          clothingDescriptions: garments,
        }),
      });

      const data = await response.json();
      if (data.tryOnImageUrl) {
        setTryOnImage(data.tryOnImageUrl);
        const updatedOutfit = { ...activeOutfit, tryOnImageUrl: data.tryOnImageUrl };
        setActiveOutfit(updatedOutfit);
        onSelectOutfit(updatedOutfit);
        if (looks.some((l) => l.id === activeOutfit.id)) {
          onSaveLook(updatedOutfit);
        }
      } else {
        setTryOnMessage(
          data.message || 'AI image preview could not be rendered right now. Try again shortly.'
        );
      }
    } catch {
      setTryOnMessage('Unable to generate try-on preview right now. Please try again.');
    } finally {
      setIsGeneratingTryOn(false);
      setTryOnStatus(null);
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--aura-border)] pb-6">
        <div>
          <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
            Personal AI Fitting Room
          </div>
          <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
            Virtual Try-On Studio
          </h1>
          <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-xl">
            Visualize your styled outfits on your own full-body photograph before getting dressed.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-[var(--aura-surface)] rounded-full border border-[var(--aura-border)] shadow-xs shrink-0">
          <button
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
              viewMode === 'comparison'
                ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)]'
                : 'text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)]'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('tryon_only')}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
              viewMode === 'tryon_only'
                ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)]'
                : 'text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)]'
            }`}
          >
            Virtual Try-On
          </button>
          <button
            onClick={() => setViewMode('reference_only')}
            className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
              viewMode === 'reference_only'
                ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)]'
                : 'text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)]'
            }`}
          >
            My Reference
          </button>
        </div>
      </div>

      {/* Outfit Selector Strip */}
      {looks.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--aura-text-subtle)]">
            <span className="uppercase tracking-wider font-semibold">
              Select Outfit to Visualize
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
            {looks.map((l) => {
              const isCurrent = activeOutfit?.id === l.id;
              const thumb =
                l.tryOnImageUrl ||
                wardrobe.find((w) => l.itemIds.includes(w.id))?.imageUrl ||
                profile.fullBodyPhotoUrl;

              return (
                <button
                  key={l.id}
                  onClick={() => handleSelectOutfit(l)}
                  className={`flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-all shrink-0 cursor-pointer min-w-[240px] max-w-[280px] ${
                    isCurrent
                      ? 'bg-[var(--aura-surface)] border-[var(--aura-text-primary)] shadow-sm ring-1 ring-[var(--aura-text-primary)]'
                      : 'bg-[var(--aura-surface)]/80 border-[var(--aura-border)] hover:border-[var(--aura-border-strong)]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--aura-canvas)] overflow-hidden shrink-0 flex items-center justify-center">
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
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-[var(--aura-text-primary)] block truncate">
                      {l.title}
                    </span>
                    <span className="text-[10px] text-[var(--aura-text-faint)] block truncate">
                      {l.occasion} · {l.aesthetic}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Studio Viewport */}
      {!activeOutfit ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Reference Upload Box even when no outfit selected */}
          <div className="lg:col-span-5 bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs space-y-4">
            <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold block">
              Step 1 · Reference Silhouette
            </span>
            {profile.fullBodyPhotoUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[var(--aura-surface-alt)] border border-[var(--aura-border)]">
                  <img
                    src={profile.fullBodyPhotoUrl}
                    alt="User reference silhouette"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[var(--aura-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Change Reference Photo</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="aspect-3/4 rounded-2xl border-2 border-dashed border-[var(--aura-border-dashed)] hover:border-[var(--aura-text-faint)] bg-[var(--aura-canvas)] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--aura-surface)] flex items-center justify-center text-[var(--aura-accent)] border border-[var(--aura-border)]">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--aura-text-primary)]">
                    Upload Full-Body Photo
                  </p>
                  <p className="text-xs text-[var(--aura-text-faint)] mt-1 max-w-xs">
                    Stand in natural lighting so virtual try-on preserves your real face, skin tone, and proportions.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-[var(--aura-surface)] rounded-3xl p-8 sm:p-12 border border-[var(--aura-border)] shadow-xs text-center space-y-5 flex flex-col items-center justify-center min-h-[360px]">
            <div className="w-12 h-12 rounded-full bg-[var(--aura-canvas)] flex items-center justify-center text-[var(--aura-accent)]">
              <Wand2 className="w-6 h-6" />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="font-editorial text-3xl font-semibold text-[var(--aura-text-primary)]">
                Select an Outfit to Try On
              </h2>
              <p className="text-xs text-[var(--aura-text-subtle)] leading-relaxed">
                Generate an outfit in the AI Stylist from your uploaded wardrobe and click "Try On on Me" to preview how it looks on your photograph.
              </p>
            </div>
            <button
              onClick={onNavigateToStylist}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[var(--aura-accent-gold)]" />
              <span>Open AI Stylist</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Reference & Try-On Visualizers */}
          <div className="lg:col-span-8 bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold">
                  {activeOutfit.occasion}
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-[var(--aura-text-primary)]">
                  {activeOutfit.title}
                </h2>
              </div>

              <button
                onClick={handleRunAiTryOn}
                disabled={isGeneratingTryOn || !profile.fullBodyPhotoUrl}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[var(--aura-btn-primary)] hover:bg-[var(--aura-btn-primary-hover)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingTryOn ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--aura-accent-gold)]" />
                    <span>Synthesizing Try-On...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[var(--aura-accent-gold)]" />
                    <span>{tryOnImage ? 'Re-Generate Try-On' : 'Generate Try-On'}</span>
                  </>
                )}
              </button>
            </div>

            {tryOnMessage && (
              <div className="p-3 rounded-xl bg-[var(--aura-surface-warm)] border border-[var(--aura-border-strong)] text-xs text-[var(--aura-text-secondary)]">
                {tryOnMessage}
              </div>
            )}

            {/* Visual Canvas */}
            <div
              className={`grid gap-6 ${
                viewMode === 'comparison'
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 max-w-md mx-auto'
              }`}
            >
              {/* Panel 1: User Personal Reference Photo */}
              {(viewMode === 'comparison' || viewMode === 'reference_only') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--aura-text-subtle)]">
                    <span className="font-semibold uppercase tracking-wider">
                      Your Reference Silhouette
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[var(--aura-accent)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{profile.fullBodyPhotoUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    </button>
                  </div>

                  {profile.fullBodyPhotoUrl ? (
                    <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[var(--aura-surface-alt)] border border-[var(--aura-border)] group shadow-inner">
                      <img
                        src={profile.fullBodyPhotoUrl}
                        alt="User reference silhouette"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs text-white p-2.5 rounded-xl text-[11px] flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#8AD199] shrink-0" />
                        <span>Identity, facial features & proportions preserved</span>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-3/4 rounded-2xl border-2 border-dashed border-[var(--aura-border-dashed)] hover:border-[var(--aura-text-faint)] bg-[var(--aura-canvas)] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors space-y-3"
                    >
                      <Camera className="w-8 h-8 text-[var(--aura-accent)]" />
                      <div>
                        <p className="text-sm font-medium text-[var(--aura-text-primary)]">
                          Upload Full-Body Photo
                        </p>
                        <p className="text-xs text-[var(--aura-text-faint)] mt-1">
                          Required to preview this outfit on yourself.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Panel 2: AI Virtual Try-On Render */}
              {(viewMode === 'comparison' || viewMode === 'tryon_only') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--aura-text-subtle)]">
                    <span className="font-semibold uppercase tracking-wider text-[var(--aura-accent)]">
                      AI Virtual Try-On Result
                    </span>
                  </div>

                  <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#24211E] border border-[var(--aura-border)] group shadow-inner">
                    {tryOnImage ? (
                      <img
                        src={tryOnImage}
                        alt="Virtual try-on result"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                        <Sparkles className="w-8 h-8 text-[#C8A876]" />
                        <p className="text-xs text-[#D4CCC2] max-w-[220px] leading-relaxed">
                          {profile.fullBodyPhotoUrl
                            ? 'Click "Generate Try-On" above to render this outfit on your photograph.'
                            : 'Upload your full-body photo first to generate a virtual try-on.'}
                        </p>
                      </div>
                    )}

                    {/* Loading overlay */}
                    {isGeneratingTryOn && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white text-center space-y-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C8A876]" />
                        <p className="text-xs tracking-wider uppercase font-semibold">
                          {tryOnStatus || 'Rendering on your silhouette...'}
                        </p>
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 bg-[var(--aura-surface)]/92 backdrop-blur-xs text-[var(--aura-text-primary)] p-2.5 rounded-xl text-[11px] flex items-center justify-between shadow-xs border border-[var(--aura-border)]">
                      <span className="font-semibold truncate">{activeOutfit.title}</span>
                      <span className="text-[var(--aura-text-faint)] shrink-0 ml-2">{activeOutfit.aesthetic}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Outfit Items Breakdown & Styling Advice */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[var(--aura-surface)] rounded-3xl p-6 border border-[var(--aura-border)] shadow-xs space-y-4">
              <h3 className="font-editorial text-xl font-semibold text-[var(--aura-text-primary)]">
                Garments in this Outfit
              </h3>

              <div className="space-y-3">
                {activeOutfit.itemIds.map((itemId) => {
                  const item = wardrobe.find((w) => w.id === itemId);
                  if (!item) return null;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--aura-canvas)] border border-[var(--aura-border)]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-[var(--aura-surface)] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold text-[var(--aura-text-primary)] block truncate">
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--aura-text-faint)]">
                          <span className="capitalize">{item.subcategory}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.primaryColor}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {activeOutfit.beauty && (
              <div className="bg-[var(--aura-surface-alt)] rounded-3xl p-6 border border-[var(--aura-border)] space-y-3 text-xs">
                <div className="flex items-center gap-2 text-[var(--aura-accent)]">
                  <Sparkle className="w-4 h-4" />
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Stylist Notes for this Look
                  </span>
                </div>

                <div className="space-y-2 text-[var(--aura-text-secondary)]">
                  <p>
                    <strong className="text-[var(--aura-text-primary)]">Makeup:</strong>{' '}
                    {activeOutfit.beauty.makeup.style} with {activeOutfit.beauty.makeup.lips}
                  </p>
                  <p>
                    <strong className="text-[var(--aura-text-primary)]">Hair:</strong>{' '}
                    {activeOutfit.beauty.hair.style}
                  </p>
                  <p>
                    <strong className="text-[var(--aura-text-primary)]">Finishing Touch:</strong>{' '}
                    {activeOutfit.beauty.finishingTouches}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUploadNewReferencePhoto}
        className="hidden"
      />
    </div>
  );
};
