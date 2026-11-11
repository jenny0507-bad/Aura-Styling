import { useState, useEffect, useCallback } from 'react';
import { WardrobeItem, Outfit, UserProfile } from '../types/wardrobe';
import {
  INITIAL_WARDROBE_ITEMS,
  INITIAL_SAVED_LOOKS,
  INITIAL_USER_PROFILE,
} from '../data/initialWardrobe';

const STORAGE_KEYS = {
  WARDROBE: 'aura_wardrobe_items_v1',
  LOOKS: 'aura_saved_looks_v1',
  PLANNER: 'aura_weekly_planner_v1',
  PROFILE: 'aura_user_profile_v1',
};

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WARDROBE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load wardrobe from localStorage:', e);
    }
    return INITIAL_WARDROBE_ITEMS;
  });

  const [looks, setLooks] = useState<Outfit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOOKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load looks from localStorage:', e);
    }
    return INITIAL_SAVED_LOOKS;
  });

  const [planner, setPlanner] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANNER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load planner from localStorage:', e);
    }
    return {
      Wednesday: 'look-1',
      Friday: 'look-2',
    };
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load profile from localStorage:', e);
    }
    return INITIAL_USER_PROFILE;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage quota exceeded or error:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOOKS, JSON.stringify(looks));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [looks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANNER, JSON.stringify(planner));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [planner]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, [profile]);

  // Sync with server if online
  useEffect(() => {
    fetch('/api/wardrobe')
      .then((res) => res.json())
      .then((data) => {
        if (data?.items && Array.isArray(data.items) && data.items.length > 0) {
          // If server has items, keep the richer set
          setItems((prev) => (prev.length >= data.items.length ? prev : data.items));
        } else {
          // Push initial items to server
          fetch('/api/wardrobe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          }).catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const addItem = useCallback((item: WardrobeItem) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  const updateItem = useCallback((updated: WardrobeItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  }, []);

  const logWear = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              timesWorn: (item.timesWorn || 0) + 1,
              lastWornDate: today,
            }
          : item
      )
    );
  }, []);

  const logOutfitWorn = useCallback((itemIds: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    setItems((prev) =>
      prev.map((item) =>
        itemIds.includes(item.id)
          ? {
              ...item,
              timesWorn: (item.timesWorn || 0) + 1,
              lastWornDate: today,
            }
          : item
      )
    );
  }, []);

  const saveLook = useCallback((look: Outfit) => {
    setLooks((prev) => {
      const exists = prev.find((l) => l.id === look.id);
      if (exists) {
        return prev.map((l) => (l.id === look.id ? look : l));
      }
      return [look, ...prev];
    });
  }, []);

  const deleteLook = useCallback((id: string) => {
    setLooks((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleLookFavorite = useCallback((id: string) => {
    setLooks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))
    );
  }, []);

  const scheduleOutfit = useCallback((day: string, lookId: string) => {
    setPlanner((prev) => ({
      ...prev,
      [day]: lookId,
    }));
  }, []);

  const unscheduleOutfit = useCallback((day: string) => {
    setPlanner((prev) => {
      const copy = { ...prev };
      delete copy[day];
      return copy;
    });
  }, []);

  const updateProfile = useCallback((updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  }, []);

  const resetToSampleWardrobe = useCallback(() => {
    setItems(INITIAL_WARDROBE_ITEMS);
    setLooks(INITIAL_SAVED_LOOKS);
    setProfile(INITIAL_USER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WARDROBE);
    localStorage.removeItem(STORAGE_KEYS.LOOKS);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  }, []);

  return {
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
  };
}
