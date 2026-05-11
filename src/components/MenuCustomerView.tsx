"use client";

import React from 'react';
import Link from 'next/link';
import { Search, X, Settings2, Leaf, Flame, Clock } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { Product, ViewType } from '@/lib/types';

interface MenuCustomerViewProps {
  items: Product[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  setView: (view: ViewType) => void;
}

const MenuCustomerView: React.FC<MenuCustomerViewProps> = ({
  items, loading, searchQuery, setSearchQuery,
  activeCategory, setActiveCategory, setView
}) => {
  const q = searchQuery.toLowerCase();
  const filteredItems = items.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(q) ||
                          (item.ingredients ?? '').toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const showGrouped = activeCategory === 'All' && searchQuery === '';
  const grouped = showGrouped
    ? CATEGORIES.filter(c => c !== 'All').reduce<Record<string, Product[]>>((acc, cat) => {
        const catItems = filteredItems.filter(item => item.category === cat);
        if (catItems.length > 0) acc[cat] = catItems;
        return acc;
      }, {})
    : null;

  const renderItem = (item: Product) => (
    <Link key={item.id} href={`/product/${item.id}`} className="block group cursor-pointer">
      <article className="transition-transform group-hover:translate-x-1 duration-300">
        <div className="flex w-full items-baseline gap-3 mb-2">
          <h3 className="font-serif text-xl md:text-2xl text-slate-800 font-medium tracking-tight group-hover:text-[#004B87] transition-colors">
            {item.name}
          </h3>
          <div className="flex-grow border-b-2 border-dotted border-slate-300 opacity-60"></div>
          <span className="font-serif text-lg md:text-xl text-[#004B87]">${Number(item.price).toFixed(2)}</span>
        </div>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-3 font-light pr-8 line-clamp-2">
          {item.ingredients}
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          {item.isDeal && (
            <span className="flex items-center gap-1 text-[#C2410C] bg-[#FFF5F1] px-2 py-1 rounded">
              <Flame className="w-3 h-3" /> Special Deal
            </span>
          )}
          {item.isVegetarian && (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
              <Leaf className="w-3 h-3" /> Vegetarian
            </span>
          )}
          {item.calories > 0 && <span className="text-slate-400">{item.calories} cal</span>}
          {item.prepTime && (
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {item.prepTime}
            </span>
          )}
        </div>
      </article>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] font-sans selection:bg-[#004B87] selection:text-white">
      <header className="relative pt-16 pb-10 px-6 text-center max-w-2xl mx-auto">
        <button
          onClick={() => setView('admin-login')}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
          aria-label="Staff access"
        >
          <Settings2 className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-6 opacity-80">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#004B87" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif text-[#004B87] tracking-tight mb-3">Ozi Yiros</h1>
        <p className="text-slate-500 font-light tracking-wide text-sm md:text-base mb-8">
          Brisbane&apos;s Authentic Greek Street Food
        </p>
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center border-b border-slate-300 pb-2 px-1 focus-within:border-[#004B87] transition-colors">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search our menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 ml-2">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-30 py-4 border-b border-slate-200/50">
        <div className="flex overflow-x-auto hide-scrollbar px-4 md:px-8 gap-3 max-w-4xl mx-auto items-center justify-start sm:justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-[#004B87] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <main className="px-6 py-10 max-w-3xl mx-auto min-h-[50vh]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
            <div className="w-6 h-6 border-2 border-[#004B87] border-t-transparent rounded-full animate-spin"></div>
            <p className="font-light">Preparing menu...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center text-slate-500 font-light">
            No items found matching your taste.
          </div>
        ) : grouped ? (
          <div className="space-y-14">
            {Object.entries(grouped).map(([category, catItems]) => (
              <section key={category}>
                <h2 className="font-serif text-2xl text-[#004B87] mb-6 pb-3 border-b border-slate-200 flex items-center justify-between">
                  {category}
                  <span className="text-sm font-sans font-normal text-slate-400">{catItems.length} items</span>
                </h2>
                <div className="space-y-10">
                  {catItems.map(renderItem)}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {filteredItems.map(renderItem)}
          </div>
        )}
      </main>

      <footer className="mt-12 py-12 bg-white border-t border-slate-100 text-center">
        <div className="max-w-md mx-auto px-6">
          <h4 className="font-serif text-xl text-[#004B87] mb-4">Ozi Yiros</h4>
          <div className="text-slate-500 font-light text-sm space-y-2">
            <p>355 Samsonvale Rd, Warner QLD 4500</p>
            <p>Open Daily: 11:00 AM – 10:00 PM</p>
            <p className="pt-4 text-slate-300 text-xs">&copy; {new Date().getFullYear()} Ozi Yiros.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MenuCustomerView;
