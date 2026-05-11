import React from 'react';
import styles from './Header.module.css';
import Link from 'next/link';
import { MapPin, ShoppingBag } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.ozi}>OZI</span>
          <span className={styles.yiros}>YIROS</span>
        </Link>
        
        <div className={styles.actions}>
          <div className={styles.location}>
            <MapPin size={18} className={styles.icon} />
            <span>Brisbane, AU</span>
          </div>
          
          <Link href="/admin/login" className={styles.adminLink}>
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
