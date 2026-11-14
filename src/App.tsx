import React, { useState } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { UploadModal } from './components/UploadModal';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { HomeView } from './components/views/HomeView';
import { WardrobeView } from './components/views/WardrobeView';
import { StylistView } from './components/views/StylistView';
import { TryOnView } from './components/views/TryOnView';
import { BeautyView } from './components/views/BeautyView';
import { LooksView } from './components/views/LooksView';
import { PlannerView } from './components/views/PlannerView';
import { ProfileView } from './components/views/ProfileView';
import { useWardrobe } from './hooks/useWardrobe';
import { useTheme } from './hooks/useTheme';
import { Outfit, AestheticType } from './types/wardrobe';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedOutfitForTryOn, setSelectedOutfitForTryOn] = useState<Outfit | null>(null);
  const [stylistInitialPrioritizeUnused, setStylistInitialPrioritizeUnused] = useState(false);
  const [stylistInitialAesthetic, setStylistInitialAesthetic] = useState<AestheticType | null>(null);

  const { themeMode, setThemeMode } = useTheme();

  const {
    items,
    looks,
    planner,
    profile,
    addItem,
    updateItem,
    deleteItem,
    toggleFavorite,
    logWear,
    logOutfitWorn,
    saveLook,
    deleteLook,
    toggleLookFavorite,
    scheduleOutfit,
    unscheduleOutfit,
    updateProfile,
    clearAllData,
  } = useWardrobe();

  const handleSelectOutfitForTryOn = (outfit: Outfit) => {
    setSelectedOutfitForTryOn(outfit);
    setActiveTab('tryon');
  };

  const handleStyleUnused = () => {
    setStylistInitialPrioritizeUnused(true);
    setStylistInitialAesthetic(null);
    setActiveTab('stylist');
  };

  const handleSelectAesthetic = (aesthetic: AestheticType) => {
    setStylistInitialAesthetic(aesthetic);
    setStylistInitialPrioritizeUnused(false);
    setActiveTab('stylist');
  };

  const handleOpenUpload = () => {
    setIsUploadOpen(true);
  };

  const handleTabChange = (tab: TabType) => {
    if (tab !== 'stylist') {
      setStylistInitialPrioritizeUnused(false);
      setStylistInitialAesthetic(null);
    }
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-[var(--aura-canvas)] text-[var(--aura-text-primary)] flex flex-col font-sans selection:bg-[var(--aura-selection-bg)] selection:text-[var(--aura-selection-text)] transition-colors duration-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenUpload={handleOpenUpload}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            items={items}
            looks={looks}
            planner={planner}
            onNavigate={handleTabChange}
            onOpenUpload={handleOpenUpload}
            onSelectOutfitForTryOn={handleSelectOutfitForTryOn}
            onStyleUnused={handleStyleUnused}
            onSelectAesthetic={handleSelectAesthetic}
            onLogWear={logWear}
          />
        )}

        {activeTab === 'wardrobe' && (
          <WardrobeView
            items={items}
            onOpenUpload={handleOpenUpload}
            onDeleteItem={deleteItem}
            onToggleFavorite={toggleFavorite}
            onLogWear={logWear}
            onUpdateItem={updateItem}
            onStyleUnused={handleStyleUnused}
          />
        )}

        {activeTab === 'stylist' && (
          <StylistView
            wardrobe={items}
            onSelectForTryOn={handleSelectOutfitForTryOn}
            onSaveLook={saveLook}
            onScheduleLook={scheduleOutfit}
            onOpenUpload={handleOpenUpload}
            savedLooks={looks}
            initialPrioritizeUnused={stylistInitialPrioritizeUnused}
            initialAesthetic={stylistInitialAesthetic}
          />
        )}

        {activeTab === 'tryon' && (
          <TryOnView
            profile={profile}
            wardrobe={items}
            looks={looks}
            selectedOutfit={selectedOutfitForTryOn}
            onUpdateProfilePhoto={(photoUrl) =>
              updateProfile({ fullBodyPhotoUrl: photoUrl, avatarUrl: photoUrl })
            }
            onSelectOutfit={setSelectedOutfitForTryOn}
            onSaveLook={saveLook}
            onNavigateToStylist={() => handleTabChange('stylist')}
          />
        )}

        {activeTab === 'beauty' && (
          <BeautyView
            looks={looks}
            wardrobe={items}
            onSelectForTryOn={handleSelectOutfitForTryOn}
          />
        )}

        {activeTab === 'looks' && (
          <LooksView
            looks={looks}
            wardrobe={items}
            onSelectForTryOn={handleSelectOutfitForTryOn}
            onDeleteLook={deleteLook}
            onToggleLookFavorite={toggleLookFavorite}
            onScheduleLook={scheduleOutfit}
            onNavigateToStylist={() => handleTabChange('stylist')}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView
            planner={planner}
            looks={looks}
            wardrobe={items}
            onScheduleOutfit={scheduleOutfit}
            onUnscheduleOutfit={unscheduleOutfit}
            onLogOutfitWorn={logOutfitWorn}
            onSelectForTryOn={handleSelectOutfitForTryOn}
            onNavigateToStylist={() => handleTabChange('stylist')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={updateProfile}
            onClearAllData={clearAllData}
            themeMode={themeMode}
            onChangeThemeMode={setThemeMode}
          />
        )}
      </main>

      {/* Upload Garment Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={addItem}
      />

      {/* Quick Theme Mode Switcher */}
      <ThemeSwitcher
        themeMode={themeMode}
        onChangeMode={setThemeMode}
        variant="floating"
      />

      {/* Luxury Editorial Footer */}
      <footer className="border-t border-[var(--aura-border)] bg-[var(--aura-surface-alt)] py-10 mt-16 text-xs text-[var(--aura-text-subtle)] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-lg tracking-widest text-[var(--aura-text-primary)] font-medium">
              A U R A
            </span>
            <span className="text-[var(--aura-border-strong)]">|</span>
            <span>Personal Digital Wardrobe & AI Stylist</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleTabChange('wardrobe')}
              className="hover:text-[var(--aura-text-primary)] transition-colors cursor-pointer"
            >
              My Wardrobe
            </button>
            <button
              onClick={() => handleTabChange('stylist')}
              className="hover:text-[var(--aura-text-primary)] transition-colors cursor-pointer"
            >
              Occasion Stylist
            </button>
            <button
              onClick={() => handleTabChange('tryon')}
              className="hover:text-[var(--aura-text-primary)] transition-colors cursor-pointer"
            >
              Virtual Try-On
            </button>
            <button
              onClick={() => handleTabChange('profile')}
              className="hover:text-[var(--aura-text-primary)] transition-colors cursor-pointer"
            >
              Profile
            </button>
          </div>

          <div className="text-[11px] text-[var(--aura-text-faint)]">
            Styling exclusively with your uploaded pieces.
          </div>
        </div>
      </footer>
    </div>
  );
}
