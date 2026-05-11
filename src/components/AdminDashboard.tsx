"use client";

import React, { useState } from 'react';
import { LogOut, Settings2, X, Flame, Leaf } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CATEGORIES, DEMO_DATA } from '@/lib/constants';

interface AdminDashboardProps {
  items: any[];
  setView: (view: string) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  deletingId: string | null;
  setDeletingId: (id: string | null) => void;
  formData: any;
  setFormData: (data: any) => void;
  handleSubmit: (e: React.FormEvent) => void;
  executeDelete: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  items, setView, setIsAdmin, editingId, setEditingId, 
  deletingId, setDeletingId, formData, setFormData, 
  handleSubmit, executeDelete 
}) => {
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

export default AdminDashboard;
