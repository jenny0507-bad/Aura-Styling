import { useState, useEffect, useCallback } from 'react';
import { WardrobeItem, Outfit, UserProfile } from '../types/wardrobe';
import { EMPTY_USER_PROFILE } from '../data/initialWardrobe';

const STORAGE_KEYS = {
  WARDROBE: 'aura_wardrobe_items_v2',
  LOOKS: 'aura_saved_looks_v2',
  PLANNER: 'aura_weekly_planner_v2',
  PROFILE: 'aura_user_profile_v2',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage:`, e);
  }
  return fallback;
}

export function useWardrobe() {
  const [items, setItems] = useState<WardrobeItem[]>(() =>
    loadFromStorage<WardrobeItem[]>(STORAGE_KEYS.WARDROBE, [])
  );

  const [looks, setLooks] = useState<Outfit[]>(() =>
    loadFromStorage<Outfit[]>(STORAGE_KEYS.LOOKS, [])
  );

  const [planner, setPlanner] = useState<Record<string, string>>(() =>
    loadFromStorage<Record<string, string>>(STORAGE_KEYS.PLANNER, {})
  );

  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage<UserProfile>(STORAGE_KEYS.PROFILE, EMPTY_USER_PROFILE)
  );

  // Sync to localStorage & backend
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WARDROBE, JSON.stringify(items));
    } catch (e) {
      console.warn('Storage quota exceeded or error:', e);
    }
    fetch('/api/wardrobe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    }).catch(() => {});
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LOOKS, JSON.stringify(looks));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    fetch('/api/looks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ looks }),
    }).catch(() => {});
  }, [looks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PLANNER, JSON.stringify(planner));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    fetch('/api/planner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planner }),
    }).catch(() => {});
  }, [planner]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    }).catch(() => {});
  }, [profile]);

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
    setPlanner((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((day) => {
        if (next[day] === id) delete next[day];
      });
      return next;
    });
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

  const clearAllData = useCallback(() => {
    setItems([]);
    setLooks([]);
    setPlanner({});
    setProfile(EMPTY_USER_PROFILE);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
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
    clearAllData,
  };
}
