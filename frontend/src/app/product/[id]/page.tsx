'use client';

import React, { useState, useEffect, use } from 'react';
import './ProductMainSection.css';
import Header from '@/app/component/header';
import { Star, Send } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export interface Review {
  id: string | number;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  createdAt?: string;
  date?: string;
}

export interface ProductItem {
  id: string | number;
  title: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  soldCount?: number;
  reviews?: Review[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function ProductPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // حالات إضافة تقييم وتعليق جديد
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || id === 'undefined') {
        setError('معرف المنتج غير صالح');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('المنتج غير موجود أو حدث خطأ في السيرفر');
        }
        const data: ProductItem = await response.json();
        setProduct(data);
        
        // جلب التعليقات الحقيقية من السيرفر أو مصفوفة فارغة إذا لم تكن موجودة
        setReviewsList(data.reviews || []);

        const imagesList = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);
        if (imagesList.length > 0) {
          setSelectedImage(imagesList[0]);
        }
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء تحميل البيانات');
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // دالة إضافة تقييم جديد وإرساله للباك إند وتحديث المتوسط تلقائياً
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmittingReview(true);
    
    // جلب بيانات المستخدم المخزنة محلياً لتمرير الاسم والإيميل
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = savedUser.name || savedUser.username || 'Anonymous User';
    const userEmail = savedUser.email || '';

    const payload = {
      userName: userName,
      userEmail: userEmail,
      rating: Number(newRating),
      comment: newComment
    };

    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'X-User-Email': userEmail
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      const result = await res.json();
      
      // إضافة التقييم الجديد للقائمة المحلية وتحديث واجهة المنتج فوراً
      const addedReview = result.review || {
        id: Date.now(),
        userName,
        rating: newRating,
        comment: newComment,
        createdAt: new Date().toISOString()
      };

      const updatedReviews = [addedReview, ...reviewsList];
      setReviewsList(updatedReviews);

      // إعادة حساب المتوسط محلياً لتحديث النجوم مباشرة في الواجهة دون الحاجة لإعادة تحميل الصفحة
      const totalRating = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const newAvgRating = totalRating / updatedReviews.length;

      setProduct(prev => prev ? {
        ...prev,
        rating: Number(newAvgRating.toFixed(1)),
        reviewsCount: updatedReviews.length
      } : null);

      setNewComment('');
      setNewRating(5);
      alert('Review added successfully!');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'حدث خطأ أثناء إرسال التقييم');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header />
        <div style={{ textAlign: 'center', padding: '100px 20px', fontSize: '18px' }}>
          جاري تحميل تفاصيل المنتج...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <Header />
        <div className="product-not-found" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Product Not Found</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>{error || 'لم يتم العثور على المنتج المطلوب.'}</p>
        </div>
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);

  return (
    <div>
      <Header />
      <div className="product-page-container">
        <div className="product-grid">
          
          {/* Gallery Column */}
          <div className="gallery-section">
            {imagesList.length > 0 && (
              <div className="vertical-thumbnails">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                  >
                    <img src={img} alt={product.title} />
                  </button>
                ))}
              </div>
            )}
            <div className="main-preview-container">
              <img src={selectedImage || product.image} alt={product.title} />
            </div>
          </div>

          {/* Details Column */}
          <div className="details-section">
            <h1 className="product-title">{product.title}</h1>

            <div className="meta-row">
              {product.rating !== undefined && product.rating > 0 && (
                <span className="stars">
                  {'★'.repeat(Math.round(product.rating))} {product.rating}
                </span>
              )}
              <span className="reviews">({reviewsList.length} reviews)</span>
              {product.soldCount !== undefined && (
                <span className="sold">{product.soldCount}+ sold</span>
              )}
            </div>

            <div className="promo-banner">
              <div className="promo-badge-title">Special Deal</div>
              <div className="price-row">
                <span className="current-price">{product.price}</span>
                {product.discount && (
                  <span className="discount-badge">{product.discount} OFF</span>
                )}
              </div>
              {product.originalPrice && (
                <div className="original-price">{product.originalPrice}</div>
              )}
              <div className="tax-note">Tax included • Extra discount at checkout</div>
            </div>

            <div className="color-selector-section">
              <div className="selector-title">Color: <span>Default</span></div>
              <div className="color-options">
                <div className="color-opt-item active">
                  <img src={selectedImage || product.image} alt={product.title} />
                </div>
              </div>
            </div>
          </div>

          {/* Buy Box Column */}
          <div className="buy-box-section">
            <div className="brand-guarantee-badge">
              <span className="guarantee-brand">OBSIDIAN-X</span>
              <span className="guarantee-text">Quality Guaranteed</span>
            </div>

            <div className="shipping-info-block">
              <div className="info-item highlight-green">
                <span className="icon">🚚</span>
                <div>
                  <strong>Free Express Shipping</strong>
                  <p>Estimated Delivery: 3 - 5 Business Days</p>
                </div>
              </div>

              <div className="info-item">
                <span className="icon">🔄</span>
                <div>
                  <strong>Return Policy</strong>
                  <p>Free returns within 14 days</p>
                </div>
              </div>

              <div className="info-item">
                <span className="icon">🛡️</span>
                <div>
                  <strong>100% Secure Checkout</strong>
                  <p>Encrypted data & safe transactions</p>
                </div>
              </div>
            </div>

            <div className="quantity-control-wrapper">
              <span className="quantity-label">Quantity</span>
              <div className="quantity-counter">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input type="text" readOnly value={quantity} />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons-wrapper">
              <button className="buy-now-btn">Buy Now</button>
              <button className="add-cart-btn">Add to Cart</button>
            </div>

            <div className="secondary-actions">
              <button className="sub-action-btn">❤️ Wishlist</button>
              <button className="sub-action-btn">🔗 Share</button>
            </div>
          </div>

        </div>

        {/* قسم التقييمات والتعليقات أسفل المنتج */}
        <div style={{ marginTop: '60px', background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #eee' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#111' }}>
            Customer Reviews & Ratings ({reviewsList.length})
          </h2>

          {/* نموذج إضافة تقييم جديد */}
          <form onSubmit={handleAddReview} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '12px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>Write a Review</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Rating:</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: star <= newRating ? '#f59e0b' : '#d1d5db' }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <textarea
                rows={3}
                placeholder="Share your thoughts about this product..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingReview}
              style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Send size={16} /> {isSubmittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>

          {/* قائمة التعليقات الحالية */}
          {reviewsList.length === 0 ? (
            <p style={{ color: '#666', fontSize: '14px' }}>No reviews yet. Be the first to review this product!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviewsList.map((rev) => (
                <div key={rev.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#111' }}>{rev.userName}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : rev.date}
                    </span>
                  </div>
                  <div style={{ color: '#f59e0b', fontSize: '14px', marginBottom: '6px' }}>
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </div>
                  <p style={{ color: '#444', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}