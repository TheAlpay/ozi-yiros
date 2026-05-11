"use client";

import React, { useState, useEffect } from 'react';
import styles from '../../new/ProductForm.module.css';
import { db, auth, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ArrowLeft, Upload, X } from 'lucide-react';
import Link from 'next/link';

export default function EditProduct({ params }: { params: { id: string } }) {
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push('/admin/login');
      else fetchProduct();
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, params.id]);

  const fetchProduct = async () => {
    try {
      const docRef = doc(db, "products", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || '',
          price: data.price?.toString() || '',
          category: data.category || 'Yiros',
          description: data.description || '',
          calories: data.calories?.toString() || '',
          prepTime: data.prepTime || '',
          portion: data.portion || 'Regular',
          ingredients: data.ingredients?.join(', ') || '',
          deals: data.deals?.join(', ') || ''
        });
        setPreview(data.image || null);
      } else {
        alert("Product not found");
        router.push('/admin/dashboard');
      }
    } catch (err) {
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      let imageUrl = preview;
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
        image: imageUrl,
        updatedAt: new Date()
      };

      await updateDoc(doc(db, "products", params.id), productData);
      router.push('/admin/dashboard');
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={`${styles.page} container animate-fade-in`}>
      <Link href="/admin/dashboard" className={styles.backLink}>
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className={styles.formCard}>
        <h1 className={styles.title}>Edit Product</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.layout}>
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
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Calories (kcal)</label>
                  <input name="calories" type="number" value={formData.calories} onChange={handleInputChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Prep Time</label>
                  <input name="prepTime" value={formData.prepTime} onChange={handleInputChange} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Portion Size</label>
                <input name="portion" value={formData.portion} onChange={handleInputChange} />
              </div>

              <div className={styles.inputGroup}>
                <label>Ingredients (comma separated)</label>
                <input name="ingredients" value={formData.ingredients} onChange={handleInputChange} />
              </div>

              <div className={styles.inputGroup}>
                <label>Deals (comma separated)</label>
                <input name="deals" value={formData.deals} onChange={handleInputChange} />
              </div>

              <div className={styles.formFooter}>
                <Button type="submit" size="lg" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
