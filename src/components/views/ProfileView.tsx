import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Check,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { UserProfile, AestheticType } from '../../types/wardrobe';
import { ThemeMode } from '../../hooks/useTheme';
import { ThemeSwitcher } from '../ThemeSwitcher';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onClearAllData: () => void;
  themeMode: ThemeMode;
  onChangeThemeMode: (mode: ThemeMode) => void;
}

const ALL_AESTHETICS: AestheticType[] = [
  'Clean Girl',
  'Old Money',
  'Casual Chic',
  'Minimalist',
  'Coquette',
  'Y2K',
  'Korean Fashion',
  'Streetwear',
  'Soft Girl',
  'Elegant / Classy',
  'Western',
  'Indo-Western',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onClearAllData,
  themeMode,
  onChangeThemeMode,
}) => {
  const [name, setName] = useState(profile.name);
  const [height, setHeight] = useState(profile.height);
  const [bodyType, setBodyType] = useState(profile.bodyType);
  const [skinUndertone, setSkinUndertone] = useState(profile.skinUndertone);
  const [bio, setBio] = useState(profile.bio);
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>(
    profile.preferredAesthetics || []
  );
  const [isSavedAlert, setIsSavedAlert] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name);
    setHeight(profile.height);
    setBodyType(profile.bodyType);
    setSkinUndertone(profile.skinUndertone);
    setBio(profile.bio);
    setSelectedAesthetics(profile.preferredAesthetics || []);
  }, [profile]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdateProfile({ fullBodyPhotoUrl: base64, avatarUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAesthetic = (a: string) => {
    if (selectedAesthetics.includes(a)) {
      setSelectedAesthetics(selectedAesthetics.filter((x) => x !== a));
    } else {
      setSelectedAesthetics([...selectedAesthetics, a]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      height,
      bodyType,
      skinUndertone,
      bio,
      preferredAesthetics: selectedAesthetics,
    });
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 3000);
  };

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[var(--aura-border)] pb-6">
        <div className="text-xs uppercase tracking-widest text-[var(--aura-text-faint)] mb-1 font-medium">
          Personal Styling Profile & Virtual Persona
        </div>
        <h1 className="font-editorial text-4xl font-semibold text-[var(--aura-text-primary)]">
          Styling Reference Profile
        </h1>
        <p className="text-xs text-[var(--aura-text-subtle)] mt-1 max-w-xl">
          Manage your personal measurements, skin undertone, aesthetic preferences, and the
          full-body photograph used for virtual try-on previews.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Full Body Reference Photo Box */}
        <div className="lg:col-span-5 bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs space-y-5">
          <div>
            <span className="text-xs uppercase tracking-widest text-[var(--aura-accent)] font-semibold block mb-1">
              Virtual Styling Reference
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)]">
              Full-Body Photograph
            </h3>
            <p className="text-xs text-[var(--aura-text-subtle)] mt-1">
              Used strictly to map and render virtual try-ons while preserving your real features and identity.
            </p>
          </div>

          {profile.fullBodyPhotoUrl ? (
            <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[var(--aura-surface-alt)] border border-[var(--aura-border)] group">
              <img
                src={profile.fullBodyPhotoUrl}
                alt="Virtual styling reference"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 text-white text-center">
                <Camera className="w-8 h-8 text-[#C8A876]" />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-[#24211E] rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF8F5] transition-colors cursor-pointer shadow"
                >
                  Upload New Photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => photoInputRef.current?.click()}
              className="aspect-3/4 rounded-2xl border-2 border-dashed border-[var(--aura-border-dashed)] hover:border-[var(--aura-text-faint)] bg-[var(--aura-canvas)] flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--aura-surface)] border border-[var(--aura-border)] flex items-center justify-center text-[var(--aura-accent)]">
                <Camera className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[var(--aura-text-primary)]">
                  Upload Your Full-Body Photo
                </p>
                <p className="text-xs text-[var(--aura-text-faint)] max-w-xs leading-relaxed">
                  Choose a clear full-body photograph to unlock personalized virtual try-on previews.
                </p>
              </div>
            </div>
          )}

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div className="p-4 rounded-2xl bg-[var(--aura-canvas)] border border-[var(--aura-border)] flex items-center gap-3 text-xs text-[var(--aura-text-secondary)]">
            <ShieldCheck className="w-5 h-5 text-[#4A7856] dark:text-[#78B588] shrink-0" />
            <span>
              Privacy Guarantee: Your reference photograph stays within your personal styling profile
              and is only used for your virtual try-on requests.
            </span>
          </div>
        </div>

        {/* Right: Personal Information & Preferences */}
        <div className="lg:col-span-7 bg-[var(--aura-surface)] rounded-3xl p-6 sm:p-8 border border-[var(--aura-border)] shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--aura-border-light)] pb-4">
              <h3 className="font-editorial text-2xl font-semibold text-[var(--aura-text-primary)]">
                Personal Styling Details
              </h3>
              {isSavedAlert && (
                <span className="text-xs text-[#4A7856] dark:text-[#78B588] font-semibold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Saved successfully
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-xl focus:outline-none focus:border-[var(--aura-text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 5 ft 6 in"
                  className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-xl focus:outline-none focus:border-[var(--aura-text-primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                  Body Silhouette / Type
                </label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-xl focus:outline-none focus:border-[var(--aura-text-primary)] cursor-pointer bg-[var(--aura-surface)]"
                >
                  <option value="Balanced Hourglass">Balanced Hourglass</option>
                  <option value="Pear / Triangle">Pear / Triangle</option>
                  <option value="Rectangle / Athletic">Rectangle / Athletic</option>
                  <option value="Inverted Triangle">Inverted Triangle</option>
                  <option value="Apple / Round">Apple / Round</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                  Skin Undertone
                </label>
                <select
                  value={skinUndertone}
                  onChange={(e) => setSkinUndertone(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-xl focus:outline-none focus:border-[var(--aura-text-primary)] cursor-pointer bg-[var(--aura-surface)]"
                >
                  <option value="Neutral Peach">Neutral Peach</option>
                  <option value="Warm Golden">Warm Golden (Honey & Olive)</option>
                  <option value="Cool Rosy">Cool Rosy (Pink & Porcelain)</option>
                  <option value="Deep Espresso">Deep Espresso Warm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-1">
                Personal Style Bio & Rules
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Notes for your personal stylist (e.g. prefer modest necklines, love neutrals)..."
                className="w-full px-3 py-2 text-sm bg-[var(--aura-surface)] text-[var(--aura-text-primary)] border border-[var(--aura-border-strong)] rounded-xl focus:outline-none focus:border-[var(--aura-text-primary)] resize-none"
              />
            </div>

            {/* Favorite Aesthetics Selectors */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)] mb-2">
                Preferred Fashion Aesthetics (Select Multiple)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_AESTHETICS.map((aes) => {
                  const isSelected = selectedAesthetics.includes(aes);
                  return (
                    <button
                      key={aes}
                      type="button"
                      onClick={() => toggleAesthetic(aes)}
                      className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)]'
                          : 'bg-[var(--aura-canvas)] text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-hover)] border border-[var(--aura-border)]'
                      }`}
                    >
                      {aes}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Mode Selector */}
            <div className="pt-4 border-t border-[var(--aura-border-light)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--aura-text-subtle)]">
                  Display Mode
                </label>
                <p className="text-[11px] text-[var(--aura-text-faint)] mt-0.5">
                  Switch between Cream Light, Obsidian Dark, Blush Silk, or Auto system theme.
                </p>
              </div>
              <ThemeSwitcher
                themeMode={themeMode}
                onChangeMode={onChangeThemeMode}
                variant="inline"
              />
            </div>

            {/* Save & Clear Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--aura-border-light)]">
              {confirmClear ? (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#A86146] dark:text-[#D98B6F] font-medium">
                    Clear wardrobe, looks & profile?
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClearAllData();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1 rounded-full bg-[#A86146] text-white font-medium cursor-pointer"
                  >
                    Confirm Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-1 text-[var(--aura-text-subtle)] hover:text-[var(--aura-text-primary)] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="text-xs text-[var(--aura-text-faint)] hover:text-[#A86146] dark:hover:text-[#D98B6F] flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Data</span>
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] text-xs uppercase tracking-wider font-semibold hover:bg-[var(--aura-btn-primary-hover)] transition-all cursor-pointer shadow-sm"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
