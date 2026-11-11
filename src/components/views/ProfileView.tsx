import React, { useState, useRef } from 'react';
import {
  User,
  Camera,
  Upload,
  Check,
  ShieldCheck,
  Sparkles,
  RotateCcw,
  Palette,
  Heart,
  Shirt,
} from 'lucide-react';
import { UserProfile, WardrobeItem, AestheticType } from '../../types/wardrobe';

interface ProfileViewProps {
  profile: UserProfile;
  wardrobe: WardrobeItem[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetToSample: () => void;
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
  wardrobe,
  onUpdateProfile,
  onResetToSample,
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

  const photoInputRef = useRef<HTMLInputElement>(null);

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

  const unusedCount = wardrobe.filter((i) => (i.timesWorn || 0) === 0).length;

  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-[#EAE3D9] pb-6">
        <div className="text-xs uppercase tracking-widest text-[#8C8275] mb-1 font-medium">
          Personal Styling Profile & Virtual Persona
        </div>
        <h1 className="font-editorial text-4xl font-semibold text-[#24211E]">
          Styling Reference Profile
        </h1>
        <p className="text-xs text-[#7A7165] mt-1 max-w-xl">
          Manage your personal measurements, skin undertone, aesthetic preferences, and the
          full-body photograph used as your virtual try-on mannequin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Full Body Reference Photo Box */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xs space-y-5">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9A7B4F] font-semibold block mb-1">
              Virtual Styling Reference
            </span>
            <h3 className="font-editorial text-2xl font-semibold text-[#24211E]">
              Full-Body Photograph
            </h3>
            <p className="text-xs text-[#7A7165] mt-1">
              Used strictly to map and render virtual try-ons. Your actual facial features and
              identity are preserved.
            </p>
          </div>

          <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#F7F4EE] border border-[#EAE3D9] group">
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

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D9] flex items-center gap-3 text-xs text-[#5A5246]">
            <ShieldCheck className="w-5 h-5 text-[#4A7856] shrink-0" />
            <span>
              Privacy Guarantee: Your reference photograph stays within your personal styling profile
              and is only used for your virtual try-on requests.
            </span>
          </div>
        </div>

        {/* Right: Personal Information & Styling Quiz */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3D9] shadow-xs space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
              <h3 className="font-editorial text-2xl font-semibold text-[#24211E]">
                Personal Styling Details
              </h3>
              {isSavedAlert && (
                <span className="text-xs text-[#4A7856] font-semibold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" /> Saved successfully
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DDD6CB] rounded-xl focus:outline-none focus:border-[#24211E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  Height
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 5 ft 6 in"
                  className="w-full px-3 py-2 text-sm border border-[#DDD6CB] rounded-xl focus:outline-none focus:border-[#24211E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  Body Silhouette / Type
                </label>
                <select
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DDD6CB] rounded-xl focus:outline-none focus:border-[#24211E] cursor-pointer bg-white"
                >
                  <option value="Balanced Hourglass">Balanced Hourglass</option>
                  <option value="Pear / Triangle">Pear / Triangle</option>
                  <option value="Rectangle / Athletic">Rectangle / Athletic</option>
                  <option value="Inverted Triangle">Inverted Triangle</option>
                  <option value="Apple / Round">Apple / Round</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                  Skin Undertone
                </label>
                <select
                  value={skinUndertone}
                  onChange={(e) => setSkinUndertone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#DDD6CB] rounded-xl focus:outline-none focus:border-[#24211E] cursor-pointer bg-white"
                >
                  <option value="Warm Golden">Warm Golden (Honey & Olive)</option>
                  <option value="Cool Rosy">Cool Rosy (Pink & Porcelain)</option>
                  <option value="Neutral Peach">Neutral Peach</option>
                  <option value="Deep Espresso">Deep Espresso Warm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-1">
                Personal Style Bio & Rules
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Notes for the AI Stylist..."
                className="w-full px-3 py-2 text-sm border border-[#DDD6CB] rounded-xl focus:outline-none focus:border-[#24211E] resize-none"
              />
            </div>

            {/* Favorite Aesthetics Selectors */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7165] mb-2">
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
                          ? 'bg-[#24211E] text-white'
                          : 'bg-[#FAF8F5] text-[#5A5246] hover:bg-[#F2ECE4] border border-[#EAE3D9]'
                      }`}
                    >
                      {aes}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-between border-t border-[#F2ECE4]">
              <button
                type="button"
                onClick={onResetToSample}
                className="text-xs text-[#8C8275] hover:text-[#A86146] flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Capsule</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#24211E] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#38332E] transition-all cursor-pointer shadow-sm"
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
