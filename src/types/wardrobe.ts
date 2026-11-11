export type CategoryType =
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'footwear'
  | 'jewellery'
  | 'accessories';

export interface WardrobeItem {
  id: string;
  name: string;
  category: CategoryType;
  subcategory: string;
  primaryColor: string;
  secondaryColors?: string[];
  aesthetics: string[];
  season: string[];
  occasions: string[];
  material: string;
  stylingTips: string;
  imageUrl: string;
  timesWorn: number;
  lastWornDate: string | null;
  isFavorite: boolean;
  createdAt: string;
}

export interface BeautyStyling {
  makeup: {
    style: string;
    lips: string;
    blush: string;
    eyes: string;
  };
  hair: {
    style: string;
    details: string;
  };
  nails: string;
  layeringAdvice: string;
  finishingTouches: string;
}

export interface Outfit {
  id: string;
  title: string;
  occasion: string;
  aesthetic: string;
  itemIds: string[];
  colorCoordination: string;
  stylingRationale: string;
  beauty: BeautyStyling;
  tryOnImageUrl?: string | null;
  isFavorite?: boolean;
  savedAt?: string;
  dayScheduled?: string;
  notes?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  avatarUrl: string;
  fullBodyPhotoUrl: string;
  height: string;
  preferredAesthetics: string[];
  colorPalette: string[];
  bodyType: string;
  skinUndertone: string;
  bio: string;
}

export type OccasionType =
  | 'School / College Regular Wear'
  | 'College Party'
  | 'School Party'
  | 'Office Wear'
  | 'Office Meetings'
  | 'Casual Outings'
  | 'Shopping'
  | 'Date Night'
  | 'Birthday Parties'
  | 'Weddings / Traditional Events'
  | 'Travel Outfits'
  | 'Festive Wear'
  | 'Daily Wear';

export type AestheticType =
  | 'Old Money'
  | 'Clean Girl'
  | 'Coquette'
  | 'Y2K'
  | 'Minimalist'
  | 'Korean Fashion'
  | 'Streetwear'
  | 'Casual Chic'
  | 'Soft Girl'
  | 'Elegant / Classy'
  | 'Western'
  | 'Indo-Western';
