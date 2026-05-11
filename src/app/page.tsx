import styles from "./page.module.css";
import ProductCard from "@/components/menu/ProductCard";

// Mock data for initial design
const MOCK_PRODUCTS = [
  {
    id: "1",
    name: "Classic Lamb Yiros",
    price: 15.90,
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800",
    calories: 650,
    prepTime: "10-15 min",
    description: "Slow-roasted tender lamb, tomato, red onion, parsley, chips, and our signature tzatziki wrapped in fluffy pita.",
    category: "Yiros"
  },
  {
    id: "2",
    name: "Chicken Souvlaki Plate",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1626700051175-656fc7bc30dd?auto=format&fit=crop&q=80&w=800",
    calories: 720,
    prepTime: "15-20 min",
    description: "Two skewers of marinated chicken breast, served with Greek salad, pita bread, and lemon-oregano potatoes.",
    category: "Plates"
  },
  {
    id: "3",
    name: "Halloumi Fries",
    price: 9.50,
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?auto=format&fit=crop&q=80&w=800",
    calories: 420,
    prepTime: "5-8 min",
    description: "Golden fried Cypriot halloumi sticks served with pomegranate molasses and fresh mint.",
    category: "Sides"
  },
  {
    id: "4",
    name: "Greek Village Salad",
    price: 12.00,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    calories: 310,
    prepTime: "5-7 min",
    description: "Cucumber, tomato, green peppers, Kalamata olives, red onion, and a large slab of authentic Greek feta.",
    category: "Salads"
  }
];

const CATEGORIES = ["All", "Yiros", "Plates", "Salads", "Sides", "Drinks"];

export default function Home() {
  return (
    <div className={`${styles.page} container animate-fade-in`}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Taste of Greece in <span className={styles.highlight}>Brisbane</span></h1>
        <p className={styles.subtitle}>Scan, order, and enjoy the freshest Mediterranean street food.</p>
      </section>

      <nav className={styles.categoryNav}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={cat === "All" ? styles.activeCategory : styles.categoryBtn}>
            {cat}
          </button>
        ))}
      </nav>

      <div className={styles.productGrid}>
        {MOCK_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
