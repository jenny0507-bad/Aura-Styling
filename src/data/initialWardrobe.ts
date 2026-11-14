import { WardrobeItem, Outfit, UserProfile } from '../types/wardrobe';

export const EMPTY_USER_PROFILE: UserProfile = {
  name: '',
  title: 'Personal Wardrobe',
  avatarUrl: '',
  fullBodyPhotoUrl: '',
  height: '',
  preferredAesthetics: [],
  colorPalette: [],
  bodyType: 'Balanced Hourglass',
  skinUndertone: 'Neutral Peach',
  bio: '',
};

export const INITIAL_WARDROBE_ITEMS: WardrobeItem[] = [];
export const INITIAL_SAVED_LOOKS: Outfit[] = [];
