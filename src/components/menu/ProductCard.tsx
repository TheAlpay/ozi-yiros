import React from 'react';
import styles from './ProductCard.module.css';
import { Clock, Flame, Info } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  calories: number;
  prepTime: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} className={styles.image} />
        <div className={styles.categoryBadge}>{product.category}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{product.name}</h3>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
        </div>
        
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>{product.prepTime}</span>
          </div>
          <div className={styles.metaItem}>
            <Flame size={16} />
            <span>{product.calories} kcal</span>
          </div>
        </div>
        
        <Link href={`/product/${product.id}`} className={styles.detailsButton}>
          <Info size={18} />
          <span>Full Details</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
