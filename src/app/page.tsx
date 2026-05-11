"use client";

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, onSnapshot, query, 
  addDoc, deleteDoc, updateDoc, doc, 
  serverTimestamp, orderBy 
} from 'firebase/firestore';

// Modular Components
import MenuCustomerView from '@/components/MenuCustomerView';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

export default function App() {
  // Global State
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('menu'); 
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Auth State
  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);

  // Admin Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Yiros', price: '', ingredients: '', calories: '', prepTime: '', isDeal: false, isVegetarian: false
  });

  // Fetch Data from Firestore
  useEffect(() => {
    if (!db) return;
    setLoading(true);
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Handlers
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
    } catch (err) { console.error("Delete Error:", err); }
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
    } catch (err) { console.error("Submit Error:", err); }
  };

  // View Controller
  if (view === 'admin-login') {
    return (
      <AdminLogin 
        pin={pin} 
        setPin={setPin} 
        handleLogin={handleLogin} 
        authError={authError} 
        setView={setView} 
      />
    );
  }

  if (view === 'admin' && isAdmin) {
    return (
      <AdminDashboard 
        items={items} 
        setView={setView} 
        setIsAdmin={setIsAdmin} 
        editingId={editingId} 
        setEditingId={setEditingId} 
        deletingId={deletingId} 
        setDeletingId={setDeletingId} 
        formData={formData} 
        setFormData={setFormData} 
        handleSubmit={handleSubmit} 
        executeDelete={executeDelete} 
      />
    );
  }
  
  return (
    <MenuCustomerView 
      items={items} 
      loading={loading} 
      searchQuery={searchQuery} 
      setSearchQuery={setSearchQuery} 
      activeCategory={activeCategory} 
      setActiveCategory={setActiveCategory} 
      setView={setView} 
    />
  );
}
