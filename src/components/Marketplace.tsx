import React, { useState } from 'react';
import {
  Sparkles,
  Store,
  Star,
  GraduationCap,
  Leaf,
  Plus,
  ShoppingBag,
  Repeat,
  Calendar,
  X,
  CheckCircle2,
} from 'lucide-react';
import { MarketplaceProduct, CartItem } from '../types';
import { MARKETPLACE_PRODUCTS } from '../data/mockData';

interface MarketplaceProps {
  onAddToCart: (product: MarketplaceProduct, mode: 'buy' | 'rent' | 'swap', days?: number) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ onAddToCart }) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>(MARKETPLACE_PRODUCTS);
  const [activeType, setActiveType] = useState<'all' | 'buy' | 'rent' | 'swap'>('all');
  const [selectedCollege, setSelectedCollege] = useState<string>('All Colleges');
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [isListModalOpen, setIsListModalOpen] = useState<boolean>(false);
  const [listSuccess, setListSuccess] = useState<boolean>(false);

  // Form state for selling/renting/swapping a new item
  const [newItemTitle, setNewItemTitle] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<number>(85);
  const [newItemType, setNewItemType] = useState<'buy' | 'rent' | 'swap'>('rent');
  const [newItemCollege, setNewItemCollege] = useState<string>('Parsons School of Design');

  const colleges = [
    'All Colleges',
    'Parsons School of Design',
    'Stanford University',
    'Fashion Institute of Technology (FIT)',
    'NYU Stern',
    'UC Berkeley',
    'Columbia University',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesType = activeType === 'all' ? true : p.type === activeType;
    const matchesCollege = selectedCollege === 'All Colleges' ? true : p.college === selectedCollege;
    return matchesType && matchesCollege;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle) return;

    const created: MarketplaceProduct = {
      id: `m_${Date.now()}`,
      title: newItemTitle,
      price: newItemPrice,
      rentalPricePerDay: Math.round(newItemPrice * 0.15),
      type: newItemType,
      category: 'Student Fashion',
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      sellerName: 'You (Student Verified)',
      sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      sellerRating: 5.0,
      college: newItemCollege,
      condition: 'Like New',
      sustainabilityPoints: 150,
      size: 'M',
      description: 'Listed by verified student via STYLORA Marketplace.',
    };

    setProducts([created, ...products]);
    setIsListModalOpen(false);
    setListSuccess(true);
    setNewItemTitle('');
    setTimeout(() => setListSuccess(false), 4000);
  };

  return (
    <section id="marketplace" className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-mono text-purple-700 dark:text-purple-300">
          <Store className="w-3.5 h-3.5 text-pink-400" />
          <span>Student Fashion Marketplace</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-serif text-slate-900 dark:text-white">
          Buy, Sell, Rent & Swap
        </h2>
        <p className="text-slate-600 dark:text-purple-200/70 font-light text-sm sm:text-base">
          Peer-to-peer sustainable circular fashion for college students. Save money, reduce textile waste, and
          earn Green Points on every transaction.
        </p>
      </div>

      {/* Filter Controls & List Item CTA */}
      <div className="backdrop-blur-xl bg-white/70 dark:bg-black/70 border border-purple-500/20 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'buy', label: 'Buy' },
            { id: 'rent', label: 'Rent' },
            { id: 'swap', label: 'Swap' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as any)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all border ${
                activeType === type.id
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                  : 'bg-white/50 dark:bg-purple-950/20 border-purple-500/10 text-slate-700 dark:text-purple-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* College Dropdown & List Item Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-purple-950/40 border border-purple-500/20 text-slate-800 dark:text-purple-200 text-xs font-mono focus:outline-none"
          >
            {colleges.map((col) => (
              <option key={col} value={col} className="dark:bg-slate-900">
                {col}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsListModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/20 flex items-center gap-2 hover:opacity-90 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>List Item</span>
          </button>
        </div>
      </div>

      {listSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Your garment has been successfully listed on STYLORA Student Marketplace!</span>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-black/60 border border-purple-500/20 p-5 shadow-xl hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/15 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="relative h-72 rounded-2xl overflow-hidden bg-slate-900 mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Pills */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-purple-200 border border-purple-500/30 uppercase">
                  {product.type}
                </div>

                <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Leaf className="w-3 h-3 text-emerald-400" />
                  +{product.sustainabilityPoints} pts
                </div>
              </div>

              {/* Title & Seller */}
              <div className="space-y-2">
                <h4 className="font-bold font-serif text-slate-900 dark:text-white text-base line-clamp-1">
                  {product.title}
                </h4>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-purple-300/80">
                  <div className="flex items-center gap-1.5">
                    <img
                      src={product.sellerAvatar}
                      alt={product.sellerName}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate max-w-[120px]">{product.sellerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-mono text-[11px]">{product.sellerRating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-purple-600 dark:text-purple-400 font-mono">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="truncate">{product.college}</span>
                </div>
              </div>
            </div>

            {/* Price & Action Button */}
            <div className="pt-4 border-t border-purple-500/15 mt-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 dark:text-purple-300/60 font-mono">
                  {product.type === 'rent' ? 'Rental / Day' : 'List Price'}
                </div>
                <div className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  ${product.type === 'rent' ? product.rentalPricePerDay : product.price}
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(product)}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>View & Select</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCT DETAIL / RENTAL MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl backdrop-blur-2xl bg-white dark:bg-slate-950 border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-purple-500/10 text-slate-700 dark:text-purple-300 hover:bg-purple-500/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-900">
                <img src={selectedProduct.imageUrl} alt={selectedProduct.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 text-xs font-mono">
                  {selectedProduct.college}
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
                  {selectedProduct.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-purple-200/80 font-light">
                  {selectedProduct.description}
                </p>

                {selectedProduct.type === 'rent' && (
                  <div className="space-y-2 p-3 rounded-2xl bg-purple-950/20 border border-purple-500/20">
                    <label className="text-xs font-mono text-purple-300 flex justify-between">
                      <span>Rental Duration (Days)</span>
                      <span>{rentalDays} Days</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      value={rentalDays}
                      onChange={(e) => setRentalDays(Number(e.target.value))}
                      className="w-full accent-purple-500"
                    />
                    <div className="text-xs text-right font-bold text-white font-mono">
                      Total Rental: ${selectedProduct.rentalPricePerDay! * rentalDays}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    onAddToCart(selectedProduct, selectedProduct.type, rentalDays);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-white font-semibold text-xs shadow-xl flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    Add to Cart ({selectedProduct.type === 'rent' ? `Rent for $${selectedProduct.rentalPricePerDay! * rentalDays}` : `$${selectedProduct.price}`})
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIST NEW ITEM MODAL */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md backdrop-blur-2xl bg-white dark:bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setIsListModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-purple-500/10 text-slate-700 dark:text-purple-300 hover:bg-purple-500/20"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white">
              List Item on Student Marketplace
            </h3>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-purple-300">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Lavender Silk Corset Top"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/20 border border-purple-500/30 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-purple-300">Listing Mode</label>
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/20 border border-purple-500/30 text-white focus:outline-none"
                >
                  <option value="buy" className="bg-slate-900">For Sale</option>
                  <option value="rent" className="bg-slate-900">For Rent</option>
                  <option value="swap" className="bg-slate-900">For Swap</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-purple-300">Price ($)</label>
                <input
                  type="number"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/20 border border-purple-500/30 text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-purple-300">College / Campus</label>
                <select
                  value={newItemCollege}
                  onChange={(e) => setNewItemCollege(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-purple-950/20 border border-purple-500/30 text-white focus:outline-none"
                >
                  {colleges.filter(c => c !== 'All Colleges').map(c => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg hover:opacity-90 transition-all mt-4"
              >
                Publish Listing (+150 Green Points)
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
