import React, { useState } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { UploadModal } from './components/UploadModal';
import { HomeView } from './components/views/HomeView';
import { WardrobeView } from './components/views/WardrobeView';
import { StylistView } from './components/views/StylistView';
import { TryOnView } from './components/views/TryOnView';
import { BeautyView } from './components/views/BeautyView';
import { LooksView } from './components/views/LooksView';
import { PlannerView } from './components/views/PlannerView';
import { ProfileView } from './components/views/ProfileView';
import { useWardrobe } from './hooks/useWardrobe';
import { Outfit, WardrobeItem } from './types/wardrobe';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedOutfitForTryOn, setSelectedOutfitForTryOn] = useState<Outfit | null>(null);
  const [stylistInitialPrioritizeUnused, setStylistInitialPrioritizeUnused] = useState(false);

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
    resetToSampleWardrobe,
  } = useWardrobe();

  const handleSelectOutfitForTryOn = (outfit: Outfit) => {
    setSelectedOutfitForTryOn(outfit);
    setActiveTab('tryon');
  };

  const handleStyleUnused = () => {
    setStylistInitialPrioritizeUnused(true);
    setActiveTab('stylist');
  };

  const handleOpenUpload = () => {
    setIsUploadOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#24211E] flex flex-col font-sans selection:bg-[#EAE1D3] selection:text-[#1A1816]">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUpload={handleOpenUpload}
        itemCount={items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeView
            items={items}
            looks={looks}
            onNavigate={setActiveTab}
            onSelectOutfitForTryOn={handleSelectOutfitForTryOn}
            onStyleUnused={handleStyleUnused}
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
            savedLooks={looks}
            initialPrioritizeUnused={stylistInitialPrioritizeUnused}
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
            onNavigateToStylist={() => setActiveTab('stylist')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            wardrobe={items}
            onUpdateProfile={updateProfile}
            onResetToSample={resetToSampleWardrobe}
          />
        )}
      </main>

      {/* Upload Garment Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={addItem}
      />

      {/* Luxury Editorial Footer */}
      <footer className="border-t border-[#EAE3D9] bg-[#F7F4EE] py-10 mt-16 text-xs text-[#7A7165]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-lg tracking-widest text-[#24211E] font-medium">
              A U R A
            </span>
            <span className="text-[#DDD6CB]">|</span>
            <span>Personal Digital Wardrobe & AI Stylist</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className="hover:text-[#24211E] transition-colors cursor-pointer"
            >
              My Wardrobe ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('stylist')}
              className="hover:text-[#24211E] transition-colors cursor-pointer"
            >
              Occasion Stylist
            </button>
            <button
              onClick={() => setActiveTab('tryon')}
              className="hover:text-[#24211E] transition-colors cursor-pointer"
            >
              Virtual Try-On
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className="hover:text-[#24211E] transition-colors cursor-pointer"
            >
              Profile
            </button>
          </div>

          <div className="text-[11px] text-[#8C8275]">
            Styling exclusively with your uploaded pieces.
          </div>
        </div>
      </footer>
    </div>
  );
}
