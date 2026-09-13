'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/component/header';
import { Store, ArrowLeft } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

interface Category {
  id: number;
  name: string;
}

export default function SellProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    badge: 'New',
    categoryId: '1',
  });

  // جلب الأقسام تلقائياً من السيرفر إن وجد، أو استخدام قائمة افتراضية
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setFormData(prev => ({ ...prev, categoryId: String(data[0].id) }));
        }
      })
      .catch(() => {
        setCategories([
          { id: 1, name: 'Electronics & Gadgets' },
          { id: 2, name: 'Fashion & Apparel' },
          { id: 3, name: 'Home & Living' },
          { id: 4, name: 'Digital Tools & Software' }
        ]);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // استخراج البريد الإلكتروني للمستخدم الحالي من الـ localStorage لربط المنتج بحسابه حصرياً
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = savedUser.email || '';

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          title: formData.title,
          price: formData.price.startsWith('$') ? formData.price : `$${formData.price}`,
          originalPrice: formData.originalPrice ? (formData.originalPrice.startsWith('$') ? formData.originalPrice : `$${formData.originalPrice}`) : undefined,
          discount: formData.discount ? `${formData.discount}%` : undefined,
          image: formData.image,
          images: [formData.image],
          badge: formData.badge,
          rating: 5.0,
          categoryId: parseInt(formData.categoryId),
          userEmail: userEmail, // ربط المنتج بإيميل الحساب الحالي ليتم جدولته وعرضه وحذفه بواسطة هذا الحساب فقط
        }),
      });

      if (!response.ok) throw new Error('Failed to submit product to server');

      alert('Your product has been successfully listed for sale!');
      router.push('/account');
    } catch (err: any) {
      alert(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px', direction: 'ltr' }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px', fontWeight: 600, color: '#000' }}
        >
          <ArrowLeft size={18} /> Back to Account
        </button>

        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Store size={26} style={{ color: '#000' }} />
            <h1 style={{ fontSize: '22px', fontWeight: 'bold', margin: 0, color: '#111' }}>Add & Sell Your Product</h1>
          </div>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>Enter your product details to display it instantly on the public store interface.</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: '#333' }}>Product Title</label>
              <input 
                type="text" 
                placeholder="e.g. Obsidian Smart Watch" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                required 
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: '#333' }}>Price ($)</label>
                <input 
                  type="text" 
                  placeholder="75.00" 
                  value={formData.price} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: '#333' }}>Original Price (Optional)</label>
                <input 
                  type="text" 
                  placeholder="100.00" 
                  value={formData.originalPrice} 
                  onChange={e => setFormData({...formData, originalPrice: e.target.value})} 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: '#333' }}>Image URL</label>
                <input 
                  type="url" 
                  placeholder="https://images.unsplash.com/..." 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  required 
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: '#333' }}>Category</label>
                <select 
                  value={formData.categoryId} 
                  onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', outline: 'none' }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '14px', color: '#333' }}>Product Badge</label>
              <select 
                value={formData.badge} 
                onChange={e => setFormData({...formData, badge: e.target.value})}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', background: '#fff', outline: 'none' }}
              >
                <option value="New">New 🌟</option>
                <option value="Hot">Hot 🔥</option>
                <option value="Sale">Sale 🏷️</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{ background: '#000000', color: '#fff', border: 'none', width: '100%', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              {isSubmitting ? 'Publishing Product...' : 'Publish Product & Sell Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}