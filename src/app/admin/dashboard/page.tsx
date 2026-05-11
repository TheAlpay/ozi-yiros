"use client";

import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Plus, Edit, Trash2, LogOut, Package } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/admin/login');
      } else {
        fetchProducts();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (loading) return <div className={styles.loading}>Loading Dashboard...</div>;

  return (
    <div className={`${styles.page} container animate-fade-in`}>
      <div className={styles.header}>
        <div>
          <h1>Product Management</h1>
          <p>Manage your menu items, prices, and nutritional info.</p>
        </div>
        <div className={styles.actions}>
          <Link href="/admin/products/new">
            <Button className={styles.addBtn}>
              <Plus size={20} />
              <span>Add Product</span>
            </Button>
          </Link>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  <Package size={48} className={styles.emptyIcon} />
                  <p>No products found. Start by adding one!</p>
                </td>
              </tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.image} alt="" className={styles.thumbnail} />
                  </td>
                  <td className={styles.productName}>{product.name}</td>
                  <td><span className={styles.badge}>{product.category}</span></td>
                  <td className={styles.price}>${product.price?.toFixed(2)}</td>
                  <td><span className={styles.activeBadge}>Active</span></td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={`/admin/products/${product.id}/edit`}>
                        <button className={styles.editBtn}><Edit size={18} /></button>
                      </Link>
                      <button 
                        className={styles.deleteBtn} 
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
