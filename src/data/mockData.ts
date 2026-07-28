import { ClosetItem, MarketplaceProduct, LifestyleScene } from '../types';

export interface SceneInfo {
  id: LifestyleScene;
  title: string;
  subtitle: string;
  location: string;
  outfitName: string;
  outfitDescription: string;
  bgGradient: string;
  modelColor: string;
  clothColor: string;
  accentColor: string;
}

export const LIFESTYLE_SCENES: SceneInfo[] = [
  {
    id: 'runway',
    title: 'Futuristic Runway',
    subtitle: 'Minimal Lavender Haute Couture',
    location: 'Metropolitan Fashion Week',
    outfitName: 'Ethereal Lavender Neo-Silk Gown',
    outfitDescription: 'A glowing, fluid silk gown with holographic mesh trim and structured shoulder architecture.',
    bgGradient: 'from-purple-950 via-slate-900 to-indigo-950',
    modelColor: '#E8E0FF',
    clothColor: '#B39DDB',
    accentColor: '#D8C7FF'
  },
  {
    id: 'campus',
    title: 'College Campus',
    subtitle: 'Casual Student Aesthetics',
    location: 'Stanford / Parson Design Quad',
    outfitName: 'Oversized Recycled Denim & Eco Tote',
    outfitDescription: 'Upcycled vintage denim jacket over an organic cotton crop top, paired with relaxed wide-leg trousers.',
    bgGradient: 'from-slate-900 via-indigo-950 to-purple-950',
    modelColor: '#E1BEE7',
    clothColor: '#7E57C2',
    accentColor: '#9FA8DA'
  },
  {
    id: 'coffee',
    title: 'Coffee Shop & Lounge',
    subtitle: 'Smart Casual Sophistication',
    location: 'Artisanal Roastery Lounge',
    outfitName: 'Cashmere Beige Trench & Tailored Pants',
    outfitDescription: 'A light camel wool-blend trench draped over a ribbed ivory turtleneck with gold-tone hardware accents.',
    bgGradient: 'from-purple-900 via-slate-900 to-amber-950',
    modelColor: '#F3E5F5',
    clothColor: '#D7CCC8',
    accentColor: '#BCAAA4'
  },
  {
    id: 'office',
    title: 'Corporate & Creative Office',
    subtitle: 'Modern Power Tailoring',
    location: 'Silicon Valley Executive Suite',
    outfitName: 'Pastel Lilac Blazer & Silk Trousers',
    outfitDescription: 'Double-breasted pastel lilac tailored blazer with clean monochrome pleating and pointed leather loafers.',
    bgGradient: 'from-slate-950 via-purple-950 to-zinc-900',
    modelColor: '#EDE7F6',
    clothColor: '#CE93D8',
    accentColor: '#BA68C8'
  },
  {
    id: 'party',
    title: 'Evening Gala & Party',
    subtitle: 'Glamorous Starlight Luxe',
    location: 'Rooftop Lounge Nightfall',
    outfitName: 'Sparkling Obsidian Metallic Dress',
    outfitDescription: 'Asymmetric deep violet metallic knit gown with shimmering glass bead mesh and subtle side slit.',
    bgGradient: 'from-black via-purple-950 to-slate-950',
    modelColor: '#F3E5F5',
    clothColor: '#4A148C',
    accentColor: '#E1BEE7'
  },
  {
    id: 'festive',
    title: 'Traditional Festive Wear',
    subtitle: 'Cultural Silk Elegance',
    location: 'Grand Heritage Celebration',
    outfitName: 'Embroidered Royal Violet Anarkali / Lehenga',
    outfitDescription: 'Handcrafted zari-embellished silk attire with shimmering lavender dupatta and gold filigree border.',
    bgGradient: 'from-purple-950 via-amber-950 to-slate-900',
    modelColor: '#FFF3E0',
    clothColor: '#7B1FA2',
    accentColor: '#FFD54F'
  }
];

export const INITIAL_CLOSET_ITEMS: ClosetItem[] = [
  {
    id: 'c1',
    name: 'Lilac Oversized Blazer',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    colorHex: '#CE93D8',
    tags: ['Workwear', 'Pastel', 'Structured'],
    sustainabilityRating: 92
  },
  {
    id: 'c2',
    name: 'High-Waist Wide Trousers',
    category: 'Bottoms',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    colorHex: '#37474F',
    tags: ['Tailored', 'Chic'],
    sustainabilityRating: 88
  },
  {
    id: 'c3',
    name: 'Silk Slip Midi Dress',
    category: 'Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    colorHex: '#B39DDB',
    tags: ['Party', 'Evening', 'Ethereal'],
    sustainabilityRating: 95
  },
  {
    id: 'c4',
    name: 'Chunky Minimal Sneakers',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    colorHex: '#FAFAFA',
    tags: ['Casual', 'Eco Rubber'],
    sustainabilityRating: 90
  },
  {
    id: 'c5',
    name: 'Glassmorphism Shoulder Bag',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    colorHex: '#E1BEE7',
    tags: ['Luxury', 'Clear Silver'],
    sustainabilityRating: 96
  },
  {
    id: 'c6',
    name: 'Organic Linen Button Down',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    colorHex: '#ECEFF1',
    tags: ['Summer', 'Breathable'],
    sustainabilityRating: 98
  }
];

export const MARKETPLACE_PRODUCTS: MarketplaceProduct[] = [
  {
    id: 'm1',
    title: 'Dior-Style Lavender Structured Corset Top',
    price: 145,
    rentalPricePerDay: 18,
    type: 'buy',
    category: 'Tops',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Elena Rostova',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    college: 'Parsons School of Design',
    condition: 'Like New',
    sustainabilityPoints: 120,
    size: 'S',
    description: 'Authentic lavender embroidered bodice top worn once for fashion week. Sustainable organic satin lining.'
  },
  {
    id: 'm2',
    title: 'Zara Unisex Oversized Vintage Denim Jacket',
    price: 65,
    rentalPricePerDay: 10,
    type: 'rent',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Marcus Vance',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.8,
    college: 'Stanford University',
    condition: 'Gently Used',
    sustainabilityPoints: 95,
    size: 'M',
    description: 'Upcycled heavyweight vintage denim jacket with subtle silver distress detailing.'
  },
  {
    id: 'm3',
    title: 'Haute Couture Metallic Silk Gala Gown',
    price: 320,
    rentalPricePerDay: 42,
    type: 'rent',
    category: 'Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Chloe Bennett',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    college: 'Fashion Institute of Technology (FIT)',
    condition: 'Brand New',
    sustainabilityPoints: 210,
    size: 'M',
    description: 'Showstopping metallic floor-length gala dress. Fluid stretch silhouette and glass crystal strap details.'
  },
  {
    id: 'm4',
    title: 'Jacquemus Minimal Le Chiquito Shoulder Bag',
    price: 210,
    rentalPricePerDay: 25,
    type: 'swap',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Aria Chen',
    sellerAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.9,
    college: 'NYU Stern',
    condition: 'Like New',
    sustainabilityPoints: 160,
    size: 'One Size',
    description: 'Pristine pastel lilac leather shoulder bag. Open to swap for luxury blazers or designer boots!'
  },
  {
    id: 'm5',
    title: 'Prada-Style Chunky Eco Leather Boots',
    price: 130,
    rentalPricePerDay: 15,
    type: 'buy',
    category: 'Shoes',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Sofia Martinez',
    sellerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    sellerRating: 4.7,
    college: 'UC Berkeley',
    condition: 'Gently Used',
    sustainabilityPoints: 110,
    size: 'EU 38 / US 7.5',
    description: 'Black lug-sole platform boots made from 100% recycled plant-based leather alternative.'
  },
  {
    id: 'm6',
    title: 'Handcrafted Zari Silk Dupatta & Festive Set',
    price: 180,
    rentalPricePerDay: 22,
    type: 'rent',
    category: 'Festive',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Ananya Sharma',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerRating: 5.0,
    college: 'Columbia University',
    condition: 'Like New',
    sustainabilityPoints: 180,
    size: 'S/M',
    description: 'Royal purple and gold hand-loomed silk attire. Perfect for cultural galas and festive celebrations.'
  }
];
