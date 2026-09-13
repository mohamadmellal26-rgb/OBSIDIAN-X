'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import "./header.css";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  categoryName?: string;
}

const API_BASE_URL = 'http://localhost:8080/api/v1';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [wishlistCount, setWishlistCount] = useState(5);

  // حالات خاصة بالبحث والقائمة المنسدلة عند النقر على حقل الإدخال
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // جلب المنتجات عند تحميل الهيدر لتصفيتها بناءً على البحث
  useEffect(() => {
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => console.error("Failed to fetch products for search", err));
  }, []);

  // إغلاق القائمة عند النقر خارج حقل البحث أو القائمة
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // تصفية المنتجات حسب ما يكتبه المستخدم
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="site-header">
      {/* 1. Top Bar */}
      <div className="top-bar">
        <div className="top-bar-container">
          <div>
            <span className="promo-tag">Special Offer</span>
            <span>Free shipping on orders over $300!</span>
          </div>
          <div className="top-links">
            <a href="tel:+21300000000">Support: +213 000 000 000</a>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="main-header">
        <div className="main-header-container">
          {/* Logo */}
          <Link href="/" className="brand-logo">
            <div className="logo-icon" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/logo.png" alt="OBSIDIAN-X Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="logo-text">OBSIDIAN-X</span>
          </Link>

          {/* Search Form with Dropdown */}
          <div className="search-container-wrapper" ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="search-input"
                placeholder="Search for products, categories, or brands..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                style={{ width: '100%' }}
              />
              <button type="submit" className="search-button" aria-label="Search">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </form>

            {/* قائمة المقترحات أو المنتجات التي تظهر عند النقر أو الكتابة */}
            {isSearchOpen && (
              <div 
                className="search-dropdown-menu" 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  marginTop: '8px',
                  maxHeight: '350px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  padding: '8px'
                }}
              >
                {filteredProducts.length === 0 ? (
                  <div style={{ padding: '12px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                    No products found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredProducts.map(product => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      onClick={() => setIsSearchOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        color: '#111',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f9f9f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'; }}
                      />
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.title}
                        </span>
                        <span style={{ fontSize: '12px', color: '#666', fontWeight: 600 }}>
                          {product.price}
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="header-actions">
            {/* Wishlist */}
            <Link href="/wishlist" className="action-item" aria-label="Wishlist">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="action-item" aria-label="Shopping Cart">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && (
                <span className="badge badge-emerald">{cartCount}</span>
              )}
            </Link>

            {/* Account */}
            <Link href="/account" className="action-item" aria-label="My Account">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar */}
      <nav className="main-nav">
        <div className="nav-container">
          <ul className="nav-list">
            <li>
              <Link href="/categories">All Categories</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            <li>
              <Link href="/offers">Deals & Offers</Link>
            </li>
            <li>
              <Link href="/new-arrivals">New Arrivals</Link>
            </li>
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}