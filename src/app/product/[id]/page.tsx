"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ChevronLeft, Clock, Flame, Leaf, Share2, Info } from 'lucide-react';
import { Product } from '@/lib/types';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!db || !params.id) return;
      try {
        const docRef = doc(db, "products", params.id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product?.name, text: product?.ingredients, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-[3px] border-[#004B87] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-serif text-slate-800 mb-4">Product Not Found</h1>
        <button onClick={() => router.push('/')} className="text-[#004B87] flex items-center gap-2 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C3E50] font-sans selection:bg-[#004B87] selection:text-white pb-20">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-serif text-lg text-[#004B87] font-medium">Product Details</span>
        <div className="relative">
          <button
            onClick={handleShare}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-600"
            title={copied ? 'Link copied!' : 'Share'}
          >
            <Share2 className="w-5 h-5" />
          </button>
          {copied && (
            <span className="absolute -bottom-9 right-0 text-xs bg-slate-800 text-white px-2 py-1 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 pt-10">
        <span className="inline-block px-3 py-1 bg-blue-50 text-[#004B87] text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">
          {product.category}
        </span>

        <div className="flex justify-between items-start gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-serif text-slate-900 font-bold leading-tight">
            {product.name}
          </h1>
          <div className="text-2xl font-serif text-[#004B87] whitespace-nowrap bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            ${Number(product.price).toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center">
            <Clock className="w-5 h-5 text-slate-400 mb-2" />
            <span className="text-xs text-slate-400 uppercase font-medium">Prep Time</span>
            <span className="text-sm font-semibold text-slate-700">{product.prepTime || '5-10m'}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center">
            <Flame className="w-5 h-5 text-[#C2410C] mb-2" />
            <span className="text-xs text-slate-400 uppercase font-medium">Calories</span>
            <span className="text-sm font-semibold text-slate-700">
              {product.calories > 0 ? `${product.calories} kcal` : 'N/A'}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center">
            <Info className="w-5 h-5 text-emerald-600 mb-2" />
            <span className="text-xs text-slate-400 uppercase font-medium">Dietary</span>
            <span className="text-sm font-semibold text-slate-700">
              {product.isVegetarian
                ? <span className="text-emerald-700">Vegetarian</span>
                : 'Standard'}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-serif font-bold text-slate-800 mb-4 border-b pb-2">
            Description &amp; Ingredients
          </h3>
          <p className="text-slate-600 leading-relaxed font-light text-lg italic">
            &ldquo;{product.ingredients}&rdquo;
          </p>
          <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Every Ozi Yiros dish is prepared with fresh, locally sourced ingredients.
              Our meats are marinated daily using traditional family recipes to ensure
              the most authentic Greek street food experience in Warner.
            </p>
          </div>
        </div>

        {(product.isDeal || product.isVegetarian) && (
          <div className="flex gap-3 mb-8 flex-wrap">
            {product.isDeal && (
              <span className="flex items-center gap-1.5 text-[#C2410C] bg-[#FFF5F1] px-3 py-1.5 rounded-full text-sm font-medium">
                <Flame className="w-4 h-4" /> Special Deal
              </span>
            )}
            {product.isVegetarian && (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <Leaf className="w-4 h-4" /> Vegetarian
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => router.push('/')}
          className="w-full bg-[#004B87] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-900/10 hover:bg-[#003A69] transition-all active:scale-95"
        >
          Explore More Options
        </button>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none opacity-5 overflow-hidden z-[-1]">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 100 L20 0 L40 100 L60 0 L80 100 L100 0" stroke="#004B87" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </div>
  );
}
