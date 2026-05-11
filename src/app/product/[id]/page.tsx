import React from 'react';
import styles from './ProductDetail.module.css';
import { Clock, Flame, ArrowLeft, Leaf, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

// For now, same mock logic
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Classic Lamb Yiros",
    price: 15.90,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800",
    calories: 650,
    prepTime: "10-15 min",
    description: "Slow-roasted tender lamb, tomato, red onion, parsley, chips, and our signature tzatziki wrapped in fluffy pita.",
    category: "Yiros",
    ingredients: ["Australian Lamb", "Pita Bread", "Tomato", "Red Onion", "Fresh Parsley", "Tzatziki", "Potatoes"],
    portion: "Regular",
    deals: ["Lunch Special: $13.50 (Mon-Fri)"]
  }
];

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // In real app: fetch from Firestore
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];

  return (
    <div className={`${styles.page} container animate-fade-in`}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={20} />
        <span>Back to Menu</span>
      </Link>

      <div className={styles.layout}>
        <div className={styles.imageSection}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <span className={styles.category}>{product.category}</span>
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.stats}>
            <div className={styles.statBox}>
              <Clock size={24} className={styles.icon} />
              <div>
                <p className={styles.statLabel}>Prep Time</p>
                <p className={styles.statValue}>{product.prepTime}</p>
              </div>
            </div>
            <div className={styles.statBox}>
              <Flame size={24} className={styles.icon} />
              <div>
                <p className={styles.statLabel}>Calories</p>
                <p className={styles.statValue}>{product.calories} kcal</p>
              </div>
            </div>
          </div>

          <div className={styles.details}>
            <h3 className={styles.sectionTitle}>Ingredients</h3>
            <div className={styles.ingredients}>
              {product.ingredients.map((ing, i) => (
                <span key={i} className={styles.tag}>{ing}</span>
              ))}
            </div>

            <h3 className={styles.sectionTitle}>Portion Size</h3>
            <p className={styles.portionText}>{product.portion}</p>

            {product.deals.length > 0 && (
              <div className={styles.deals}>
                <h3 className={styles.sectionTitle}>Current Deals</h3>
                {product.deals.map((deal, i) => (
                  <p key={i} className={styles.dealText}>🔥 {deal}</p>
                ))}
              </div>
            )}
          </div>

          <div className={styles.footer}>
             <div className={styles.disclaimer}>
               <ShieldAlert size={16} />
               <span>Nutritional values are approximate.</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
