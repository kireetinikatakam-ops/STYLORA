export type LifestyleScene = 'runway' | 'campus' | 'coffee' | 'office' | 'party' | 'festive';

export type PersonalColorSeason = 'Spring Warm' | 'Summer Cool' | 'Autumn Warm' | 'Winter Cool';

export type BodyShapeType = 'Hourglass' | 'Pear' | 'Apple' | 'Rectangle' | 'Inverted Triangle';

export type FabricType = 'Silk' | 'Satin' | 'Denim' | 'Velvet' | 'Linen' | 'Cashmere';

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface PersonalColorData {
  season: PersonalColorSeason;
  undertone: string;
  hairColor: string;
  eyeColor: string;
  paletteName: string;
  bestColors: ColorSwatch[];
  avoidColors: ColorSwatch[];
  jewelry: string;
  makeup: string;
  hairSuggestions: string;
}

export interface BodyShapeData {
  shape: BodyShapeType;
  description: string;
  proportions: {
    bust: number;
    waist: number;
    hips: number;
  };
  recommendations: {
    title: string;
    reason: string;
  }[];
  avoidList: string[];
}

export interface ClosetItem {
  id: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Dresses' | 'Shoes' | 'Accessories';
  imageUrl: string;
  colorHex: string;
  tags: string[];
  sustainabilityRating: number;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  price: number;
  rentalPricePerDay?: number;
  type: 'buy' | 'rent' | 'swap';
  category: string;
  imageUrl: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  college: string;
  condition: 'Brand New' | 'Like New' | 'Gently Used';
  sustainabilityPoints: number;
  size: string;
  description: string;
}

export interface StyleScoreData {
  totalScore: number;
  breakdown: {
    bodyMatch: number;
    colorMatch: number;
    trendScore: number;
    occasionMatch: number;
    sustainabilityScore: number;
  };
  feedback: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
  mode: 'buy' | 'rent' | 'swap';
  rentalDays?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college?: string;
  stylePreference?: string;
  sustainabilityScore?: number;
  signedInAt?: string;
  isStudentVerified?: boolean;
}

