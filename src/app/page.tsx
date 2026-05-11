"use client";

import React, { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, onSnapshot, query,
  addDoc, deleteDoc, updateDoc, doc,
  serverTimestamp, orderBy
} from 'firebase/firestore';

import MenuCustomerView from '@/components/MenuCustomerView';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';

import { DEMO_DATA } from '@/lib/constants';
import { Product, ViewType, ProductFormData, EMPTY_FORM } from '@/lib/types';

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || '1234';

export default function App() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(db !== null);
  const [view, setView] = useState<ViewType>('menu');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isAdmin, setIsAdmin] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(EMPTY_FORM);

  const seedAttempted = useRef(false);

  const autoSeed = async () => {
    if (!db) return;
    try {
      for (const item of DEMO_DATA) {
        await addDoc(collection(db, "products"), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Auto-seed error:", err);
    }
  };

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Product[];

      if (productsData.length === 0 && !seedAttempted.current) {
        seedAttempted.current = true;
        autoSeed();
      }

      setItems(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
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
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    const itemData = {
      name: formData.name.replace(/\b\w/g, l => l.toUpperCase()),
      category: formData.category,
      price: parseFloat(formData.price),
      ingredients: formData.ingredients,
      calories: parseInt(formData.calories) || 0,
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
      setFormData(EMPTY_FORM);
      setEditingId(null);
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

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
