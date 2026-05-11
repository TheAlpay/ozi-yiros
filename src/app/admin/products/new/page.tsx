"use client";

import React, { useState, useEffect } from 'react';
import styles from './ProductForm.module.css';
import { db, auth, storage } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function NewProduct() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Yiros',
    description: '',
    calories: '',
    prepTime: '',
    portion: 'Regular',
    ingredients: '',
    deals: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
    });
    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
        const snapshot = await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        calories: parseInt(formData.calories),
        ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
        deals: formData.deals.split(',').map(d => d.trim()).filter(d => d),
        image: imageUrl || 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800',
        createdAt: new Date()
      };

      await addDoc(collection(db, "products"), productData);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.page} container animate-fade-in`}>
      <Link href="/admin/dashboard" className={styles.backLink}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className={styles.formCard}>
        <h1 className={styles.title}>Add New Product</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.layout}>
            {/* Left Column: Image Upload */}
            <div className={styles.imageColumn}>
              <div className={styles.imageUpload}>
                {preview ? (
                  <div className={styles.previewContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className={styles.preview} />
                    <button type="button" className={styles.removeImage} onClick={() => { setImage(null); setPreview(null); }}>
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <label className={styles.uploadPlaceholder}>
                    <Upload size={48} />
                    <span>Upload Product Image</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  </label>
                )}
              </div>
            </div>

            {/* Right Column: Fields */}
            <div className={styles.fieldsColumn}>
              <div className={styles.inputGroup}>
                <label>Product Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Lamb Souvlaki" required />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Price ($)</label>
                  <input name="price" type="number" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="15.00" required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option>Yiros</option>
                    <option>Plates</option>
                    <option>Salads</option>
                    <option>Sides</option>
                    <option>Drinks</option>
                  </select>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Tell customers about this dish..." required />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Calories (kcal)</label>
                  <input name="calories" type="number" value={formData.calories} onChange={handleInputChange} placeholder="500" />
                </div>
                <div className={styles.inputGroup}>
                  <label>Prep Time</label>
                  <input name="prepTime" value={formData.prepTime} onChange={handleInputChange} placeholder="e.g. 10-15 min" />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Portion Size</label>
                <input name="portion" value={formData.portion} onChange={handleInputChange} placeholder="e.g. Regular / Large" />
              </div>

              <div className={styles.inputGroup}>
                <label>Ingredients (comma separated)</label>
                <input name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="Lamb, Pita, Tomato, Onion..." />
              </div>

              <div className={styles.inputGroup}>
                <label>Deals (comma separated)</label>
                <input name="deals" value={formData.deals} onChange={handleInputChange} placeholder="Buy 1 Get 1, Lunch Special..." />
              </div>

              <div className={styles.formFooter}>
                <Button type="submit" size="lg" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Product'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
