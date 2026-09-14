'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './HorizontalScrollContainer.css';

export interface CategoryItem {
  id: string | number;
  label: string;
  icon?: string;
  active?: boolean;
}

export interface ProductItem {
  id: number | string;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  rating?: number;
  categoryId?: number | string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All Products', icon: '🔥', active: true },
  { id: 1, label: 'Keyboards', icon: '⌨️' },
  { id: 2, label: 'Mice', icon: '🖱️' },
  { id: 3, label: 'Audio', icon: '🎧' },
];

// 🔗 الاعتماد المباشر على سيرفر Render وتصفية المسار من أي سلاش زائدة
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://obsidian-x.onrender.com';
const API_URL = `${BASE_URL.replace(/\/+$/, '')}/api/v1`;

export const CategoryChip: React.FC<{
  item: CategoryItem;
  isSelected: boolean;
  onClick: () => void;
}> = ({ item, isSelected, onClick }) => (
  <button
    className={`chip-button ${isSelected ? 'active' : ''}`}
    onClick={onClick}
  >
    {item.icon && <span className="chip-icon">{item.icon}</span>}
    <span>{item.label}</span>
  </button>
);

export const ProductCard: React.FC<{
  product: ProductItem;
  onProductClick?: (product: ProductItem) => void;
}> = ({ product, onProductClick }) => (
  <div 
    className="product-card" 
    onClick={() => onProductClick?.(product)} 
    style={{ cursor: 'pointer' }}
  >
    {product.badge && <span className="product-badge">{product.badge}</span>}
    <div className="product-image-box">
      <img src={product.image} alt={product.title} draggable={false} />
    </div>
    <div className="product-details">
      <h4 className="product-title">{product.title}</h4>
      <div className="product-price-box">
        <span className="current-price">{product.price}</span>
        {product.originalPrice && (
          <span className="old-price">{product.originalPrice}</span>
        )}
      </div>
      {product.rating && <div className="product-rating">⭐ {product.rating}</div>}
    </div>
  </div>
);

interface HorizontalScrollContainerProps {
  categories?: CategoryItem[];
  scrollAmount?: number;
  onSelectProduct?: (product: ProductItem) => void;
}

export const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  categories = DEFAULT_CATEGORIES,
  scrollAmount = 300,
  onSelectProduct,
}) => {
  const router = useRouter();
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>(
    categories.find((c) => c.active)?.id || 'all'
  );

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const query = selectedCategoryId && selectedCategoryId !== 'all' ? `?category_id=${selectedCategoryId}` : '';
        const response = await fetch(`${API_URL}/products${query}`);
        
        if (!response.ok) {
          throw new Error('فشل جلب المنتجات من السيرفر');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'حدث خطأ أثناء الاتصال بالسيرفر');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategoryId]);

  const handleVerticalScroll = (direction: 'up' | 'down') => {
    if (!productRef.current) return;
    const offset = direction === 'up' ? -scrollAmount : scrollAmount;
    productRef.current.scrollBy({ top: offset, behavior: 'smooth' });
  };

  const handleHorizontalScroll = (direction: 'left' | 'right') => {
    if (!categoryRef.current) return;
    const offset = direction === 'left' ? -200 : 200;
    categoryRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <div className="section-wrapper">
      <div className="scroll-wrapper categories-wrapper">
        <button
          className="scroll-btn left-btn"
          onClick={() => handleHorizontalScroll('left')}
        >
          &#10094;
        </button>
        <div className="horizontal-scroll-container" ref={categoryRef}>
          <div className="horizontal-scroll-content">
            {categories.map((cat) => (
              <CategoryChip
                key={cat.id}
                item={cat}
                isSelected={selectedCategoryId === cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
              />
            ))}
          </div>
        </div>
        <button
          className="scroll-btn right-btn"
          onClick={() => handleHorizontalScroll('right')}
        >
          &#10095;
        </button>
      </div>

      <div className="vertical-scroll-wrapper">
        <button
          className="v-scroll-btn top-btn"
          onClick={() => handleVerticalScroll('up')}
        >
          &#9679;
        </button>

        <div className="vertical-scroll-container" ref={productRef}>
          {isLoading ? (
            <p style={{ padding: '40px', textAlign: 'center', width: '100%' }}>جاري تحميل المنتجات...</p>
          ) : error ? (
            <p style={{ padding: '40px', textAlign: 'center', color: 'red', width: '100%' }}>{error}</p>
          ) : (
            <div className="products-grid">
              {products.length > 0 ? (
                products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onProductClick={(p) => {
                      if (onSelectProduct) {
                        onSelectProduct(p);
                      } else {
                        router.push(`/product/${p.id}`);
                      }
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))
              ) : (
                <p style={{ padding: '20px', textAlign: 'center', width: '100%' }}>
                  لا توجد منتجات في هذا التصنيف.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          className="v-scroll-btn bottom-btn"
          onClick={() => handleVerticalScroll('down')}
        >
          &#9679;
        </button>
      </div>
    </div>
  );
};

export default HorizontalScrollContainer;