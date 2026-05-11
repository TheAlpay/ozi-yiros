"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, X, Plus, 
  Settings2, LogOut, ChevronLeft, 
  Leaf, Flame, Clock
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
  collection, onSnapshot, query, 
  addDoc, deleteDoc, updateDoc, doc, 
  serverTimestamp, orderBy 
} from 'firebase/firestore';

const DEMO_DATA = [
  { name: "Classic Chicken Yiros", category: "Yiros", price: 16.50, ingredients: "Marinated chicken breast, hot chips, fresh tzatziki, tomato, red onion, wrapped in warm fluffy pita.", calories: 750, prepTime: "5m", isDeal: false, isVegetarian: false },
  { name: "Slow-Cooked Lamb", category: "Yiros", price: 18.90, ingredients: "Premium lamb shoulder roasted for 12 hours, chips, tzatziki, red onion, fresh parsley, sweet paprika.", calories: 820, prepTime: "7m", isDeal: false, isVegetarian: false },
  { name: "The Athenian Mixed", category: "Yiros", price: 19.50, ingredients: "Best of both worlds: Chicken & lamb combo, chips, tzatziki, tomato, onion.", calories: 890, prepTime: "8m", isDeal: false, isVegetarian: false },
  { name: "Crispy Haloumi", category: "Yiros", price: 16.90, ingredients: "Grilled Cypriot haloumi, chips, tzatziki, crisp lettuce, tomato, red onion.", calories: 680, prepTime: "5m", isDeal: false, isVegetarian: true },
  { name: "Greek Loaded Fries", category: "Sides", price: 12.00, ingredients: "Crunchy golden fries topped with crumbled feta, oregano, and our signature garlic sauce.", calories: 620, prepTime: "5m", isDeal: false, isVegetarian: true },
  { name: "Handmade Spanakopita", category: "Sides", price: 8.50, ingredients: "Traditional spinach, feta cheese, and fresh herbs baked in flaky golden filo pastry.", calories: 320, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Tzatziki & Pita Share", category: "Sides", price: 9.90, ingredients: "House-made garlic cucumber yogurt dip served with two warm, toasted pita breads.", calories: 450, prepTime: "2m", isDeal: false, isVegetarian: true },
  { name: "The Brisbane Combo", category: "Deals", price: 21.00, ingredients: "Your choice of any classic Yiros + Small Greek Fries + Choice of Soft Drink.", calories: 1050, prepTime: "7m", isDeal: true, isVegetarian: false },
  { name: "Baklava (2 Pieces)", category: "Desserts", price: 7.50, ingredients: "Layers of crisp filo pastry filled with chopped nuts and sweetened with fragrant honey syrup.", calories: 410, prepTime: "Ready", isDeal: false, isVegetarian: true },
  { name: "Greek Frappé", category: "Drinks", price: 6.00, ingredients: "Traditional Greek iced coffee, whipped to perfection. Sweetened to your liking.", calories: 120, prepTime: "3m", isDeal: false, isVegetarian: true },
];

const CATEGORIES = ['All', 'Yiros', 'Sides', 'Deals', 'Desserts', 'Drinks'];

// --- Sub-Components (Moved outside to fix focus bug) ---

const MenuCustomerView = ({ items, loading, searchQuery, setSearchQuery, activeCategory, setActiveCategory, setView }: any) => {
  const filteredItems = items.filter((item: any) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.ingredients.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] font-sans selection:bg-[#004B87] selection:text-white">
      <header className="relative pt-16 pb-10 px-6 text-center max-w-2xl mx-auto">
        <button onClick={() => setView('admin-login')} className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors">
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
        <p className="text-slate-500 font-light tracking-wide text-sm md:text-base mb-8">Brisbane's Authentic Greek Street Food</p>
        <div className="relative max-w-md mx-auto">
          <div className="flex items-center border-b border-slate-300 pb-2 px-1 focus-within:border-[#004B87] transition-colors">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search our menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-slate-700 placeholder-slate-400 focus:outline-none font-light"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="sticky top-0 bg-[#FDFBF7]/90 backdrop-blur-md z-30 py-4 border-b border-slate-200/50">
        <div className="flex overflow-x-auto hide-scrollbar px-6 gap-3 max-w-3xl mx-auto items-center justify-start md:justify-center">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-[#004B87] text-white shadow-sm' 
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
          <div className="py-20 text-center text-slate-500 font-light">No items found matching your taste.</div>
        ) : (
          <div className="space-y-10">
            {filteredItems.map((item: any) => (
              <article key={item.id} className="group">
                <div className="flex w-full items-baseline gap-3 mb-2">
                  <h3 className="font-serif text-xl md:text-2xl text-slate-800 font-medium tracking-tight">{item.name}</h3>
                  <div className="flex-grow border-b-2 border-dotted border-slate-300 opacity-60"></div>
                  <span className="font-serif text-lg md:text-xl text-[#004B87]">${Number(item.price).toFixed(2)}</span>
                </div>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-3 font-light pr-8">{item.ingredients}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  {item.isDeal && (
                    <span className="flex items-center gap-1 text-[#C2410C] bg-[#FFF5F1] px-2 py-1 rounded">
                      <Flame className="w-3 h-3" /> Special Deal
                    </span>
                  )}
                  {item.isVegetarian && (
                    <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                      <Leaf className="w-3 h-3" /> V
                    </span>
                  )}
                  {item.calories && <span className="text-slate-400">{item.calories} cal</span>}
                  {item.prepTime && <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.prepTime}</span>}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-12 py-12 bg-white border-t border-slate-100 text-center">
        <div className="max-w-md mx-auto px-6">
          <h4 className="font-serif text-xl text-[#004B87] mb-4">Ozi Yiros</h4>
          <div className="text-slate-500 font-light text-sm space-y-2">
            <p>123 Queen Street, Brisbane QLD 4000</p>
            <p>Open Daily: 11:00 AM - 10:00 PM</p>
            <p className="pt-4 text-slate-300 text-xs">&copy; {new Date().getFullYear()} Ozi Yiros.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AdminLogin = ({ pin, setPin, handleLogin, authError, setView }: any) => (
  <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 font-sans">
    <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <button onClick={() => setView('menu')} className="mb-8 text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-sm font-medium">
        <ChevronLeft className="w-4 h-4" /> Back to Menu
      </button>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-1">Store Access</h2>
        <p className="text-slate-500 text-sm">Please enter the staff PIN to continue.</p>
      </div>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input 
            type="password" 
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className={`w-full bg-slate-50 border px-4 py-3 rounded-lg text-lg focus:outline-none transition-colors ${authError ? 'border-red-300 focus:border-red-500 text-red-600' : 'border-slate-200 focus:border-[#004B87]'}`}
            autoFocus
          />
          {authError && <p className="text-red-500 text-xs mt-2">Incorrect PIN. Please try again.</p>}
        </div>
        <button type="submit" className="w-full bg-[#004B87] text-white font-medium py-3 rounded-lg hover:bg-[#003A69] transition-colors shadow-sm">
          Access Dashboard
        </button>
      </form>
    </div>
  </div>
);

const AdminDashboard = ({ 
  items, setView, setIsAdmin, editingId, setEditingId, 
  deletingId, setDeletingId, formData, setFormData, 
  handleSubmit, executeDelete 
}: any) => {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    if (!db || seeding) return;
    setSeeding(true);
    try {
      for (const item of DEMO_DATA) {
        await addDoc(collection(db, "products"), {
          ...item,
          createdAt: serverTimestamp()
        });
        // Small delay to prevent burst issues
        await new Promise(r => setTimeout(r, 200));
      }
      alert("Demo data loaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error seeding data.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#004B87] rounded flex items-center justify-center text-white font-serif font-bold">O</div>
            <span className="font-semibold text-lg text-slate-800">Menu Manager</span>
          </div>
          <div className="flex items-center gap-6">
            {items.length === 0 && (
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-md border border-emerald-100 hover:bg-emerald-100 transition disabled:opacity-50"
              >
                {seeding ? 'Seeding...' : 'Seed Demo Data'}
              </button>
            )}
            <button onClick={() => {setIsAdmin(false); setView('menu');}} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition">
              Sign Out <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              {editingId ? <span className="text-[#004B87]">Edit Item</span> : <span>Add New Item</span>}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Item Name *</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#004B87] transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#004B87] bg-white">
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Price ($) *</label>
                  <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#004B87]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Calories</label>
                  <input type="text" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#004B87]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Prep Time</label>
                  <input type="text" value={formData.prepTime} onChange={e => setFormData({...formData, prepTime: e.target.value})} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#004B87]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Ingredients</label>
                <textarea value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} rows={3} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#004B87] resize-none"></textarea>
              </div>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isDeal} onChange={e => setFormData({...formData, isDeal: e.target.checked})} className="w-4 h-4 text-[#004B87] rounded border-slate-300"/>
                  <span className="text-sm text-slate-700">Special Deal</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={formData.isVegetarian} onChange={e => setFormData({...formData, isVegetarian: e.target.checked})} className="w-4 h-4 text-emerald-600 rounded border-slate-300"/>
                  <span className="text-sm text-slate-700">Vegetarian</span>
                </label>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-[#004B87] text-white py-2.5 rounded-md font-medium hover:bg-[#003A69] transition-colors shadow-sm">
                  {editingId ? 'Save Changes' : 'Add Item'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => {setEditingId(null); setFormData({name: '', category: 'Yiros', price: '', ingredients: '', calories: '', prepTime: '', isDeal: false, isVegetarian: false})}} className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-md font-medium hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-semibold text-slate-800">Active Menu Items</h3>
              <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">{items.length} Total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {items.map((item: any) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#004B87] bg-blue-50 px-2 py-0.5 rounded">{item.category}</span>
                      <h4 className="font-medium text-slate-800">{item.name}</h4>
                      {item.isDeal && <Flame className="w-3.5 h-3.5 text-[#C2410C]" />}
                      {item.isVegetarian && <Leaf className="w-3.5 h-3.5 text-emerald-600" />}
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-1">{item.ingredients}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48">
                    <div className="text-sm font-medium text-slate-800">${Number(item.price).toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      {deletingId === item.id ? (
                        <div className="flex items-center gap-2 bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">
                          <span>Delete?</span>
                          <button onClick={() => executeDelete(item.id)} className="hover:underline text-red-700">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="hover:underline">No</button>
                        </div>
                      ) : (
                        <>
                          <button onClick={() => {
                            setEditingId(item.id);
                            setFormData({...item, price: item.price.toString(), calories: item.calories?.toString() || ''});
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} className="p-1.5 text-slate-400 hover:text-[#004B87] hover:bg-blue-50 rounded transition-colors"><Settings2 className="w-4 h-4" /></button>
                          <button onClick={() => setDeletingId(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><X className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('menu'); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Yiros', price: '', ingredients: '', calories: '', prepTime: '', isDeal: false, isVegetarian: false
  });

  useEffect(() => {
    if (!db) return;
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(productsData);
      setLoading(false);
    }, (error) => {
      console.error(error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234') {
      setIsAdmin(true);
      setView('admin');
      setAuthError(false);
      setPin('');
    } else {
      setAuthError(true);
      setPin('');
    }
  };

  const executeDelete = async (id: string) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, "products", id));
      setDeletingId(null);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    const itemData = {
      name: formData.name.replace(/\b\w/g, l => l.toUpperCase()),
      category: formData.category,
      price: parseFloat(formData.price as any),
      ingredients: formData.ingredients,
      calories: parseInt(formData.calories as any) || 0,
      prepTime: formData.prepTime,
      isDeal: formData.isDeal,
      isVegetarian: formData.isVegetarian,
      updatedAt: serverTimestamp()
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, "products", editingId), itemData);
      } else {
        await addDoc(collection(db, "products"), { ...itemData, createdAt: serverTimestamp() });
      }
      setFormData({ name: '', category: 'Yiros', price: '', ingredients: '', calories: '', prepTime: '', isDeal: false, isVegetarian: false });
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  if (view === 'admin-login') return <AdminLogin pin={pin} setPin={setPin} handleLogin={handleLogin} authError={authError} setView={setView} />;
  if (view === 'admin') return <AdminDashboard items={items} setView={setView} setIsAdmin={setIsAdmin} editingId={editingId} setEditingId={setEditingId} deletingId={deletingId} setDeletingId={setDeletingId} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} executeDelete={executeDelete} />;
  
  return <MenuCustomerView 
    items={items} 
    loading={loading} 
    searchQuery={searchQuery} 
    setSearchQuery={setSearchQuery} 
    activeCategory={activeCategory} 
    setActiveCategory={setActiveCategory} 
    setView={setView} 
  />;
}
