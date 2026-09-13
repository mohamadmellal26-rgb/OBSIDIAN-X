"use client";

import React from "react";
import Link from "next/link";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Section: Brand Info & Newsletter */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="brand-logo">
              {/* تم التعديل إلى O ليتطابق مع الـ Header */}
              <div className="logo-icon">O</div>
              <span className="logo-text">OBSIDIAN-X</span>
            </Link>
            <p className="brand-desc">
              Next-generation tech essentials engineered with precision and minimal aesthetics.
            </p>
          </div>

          <div className="newsletter-box">
            <h4 className="newsletter-title">STAY IN THE LOOP</h4>
            <p className="newsletter-desc">
              Subscribe to receive exclusive offers and product updates.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Middle Section: Quick Links */}
        <div className="footer-grid">
          <div className="footer-column">
            <h5 className="column-title">SHOP</h5>
            <ul>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/new-arrivals">New Arrivals</Link></li>
              <li><Link href="/offers">Featured Deals</Link></li>
              <li><Link href="/categories">Categories</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="column-title">SUPPORT</h5>
            <ul>
              <li><Link href="/faq">Help Center & FAQ</Link></li>
              <li><Link href="/shipping">Shipping & Delivery</Link></li>
              <li><Link href="/returns">Returns & Exchanges</Link></li>
              <li><Link href="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="column-title">COMPANY</h5>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/press">Press & Media</Link></li>
              <li><Link href="/stores">Store Locator</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="column-title">LEGAL</h5>
            <ul>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/warranty">Warranty Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} OBSIDIAN-X Inc. All rights reserved.
          </p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noreferrer">TWITTER</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">INSTAGRAM</a>
            <a href="https://github.com" target="_blank" rel="noreferrer">GITHUB</a>
          </div>
        </div>
      </div>
    </footer>
  );
}