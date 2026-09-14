'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/component/header';
import AuthModal, { UserData } from '@/app/component/AuthModal';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ShoppingBag, 
  Clock, 
  Calendar,
  Store,
  User as UserIcon,
  Mail,
  Lock,
  Trash2
} from 'lucide-react';
import './AccountPage.css';

interface Order {
  id: string;
  date: string;
  total: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  itemsCount: number;
}

interface Product {
  id: number;
  title: string;
  price: string;
  originalPrice?: string;
  image: string;
  badge?: string;
  userEmail?: string;
}

// ✅ صحيح: يقرأ من متغير البيئة أو يعود للمحلي عند التطوير
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` 
  : 'http://localhost:8080/api/v1';

export default function AccountPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'my-products' | 'addresses' | 'settings'>('overview');

  const [user, setUser] = useState({ name: '', email: '', joinedDate: 'September 2026' });
  const [formState, setFormState] = useState({ name: '', email: '', password: '' });
  const [orders, setOrders] = useState<Order[]>([]);
  const [myProducts, setMyProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(prev => ({ ...prev, name: parsed.name || 'User', email: parsed.email || '' }));
        setIsLoggedIn(true);
        fetchMyProducts(parsed.email);
      } catch (e) { console.error(e); }
    } else {
      setIsAuthModalOpen(true);
    }
  }, []);

  const fetchMyProducts = async (userEmail?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const currentEmail = userEmail || user.email;
          // فلترة المنتجات بحيث تعرض فقط المنتجات التي صممها هذا الحساب حصرياً
          const filtered = data.filter((p: Product) => p.userEmail && p.userEmail === currentEmail);
          setMyProducts(filtered);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  useEffect(() => {
    setFormState({ name: user.name, email: user.email, password: '' });
  }, [user]);

  const handleLoginSuccess = (userData: UserData) => {
    setUser(prev => ({ ...prev, name: userData.name || 'User', email: userData.email }));
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    fetchMyProducts(userData.email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsAuthModalOpen(true);
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, name: formState.name, email: formState.email };
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    alert('Account settings updated successfully!');
  };

  // دالة حذف المنتج مع إرسال إيميل المستخدم للتأكد من الملكية في الباك إند
  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete your designed product?')) return;

    try {
      const token = localStorage.getItem('token') || '';
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-User-Email': user.email // إرسال الإيميل للتحقق في الـ Backend
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to delete the product');
      }

      // تحديث الحالة المحلية لإزالة المنتج المحذوف فوراً
      setMyProducts(prev => prev.filter(p => p.id !== productId));
      alert('Your product has been deleted successfully');
    } catch (err: any) {
      alert(err.message || 'Error deleting product');
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <Header />
        <div className="login-page-wrapper">
          <div className="login-card">
            <div className="login-header">
              <h2>Access Restricted</h2>
              <p>Please sign in to view your account dashboard.</p>
            </div>
            <button onClick={() => setIsAuthModalOpen(true)} className="login-submit-btn" style={{ width: '100%' }}>
              Sign In / Register
            </button>
          </div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="account-page-container">
        <div className="account-layout">
          
          <aside className="account-sidebar">
            <div className="user-profile-summary">
              <div className="avatar-wrapper">
                <span className="avatar-placeholder">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="user-name">{user.name}</h3>
              <p className="user-email">{user.email}</p>
            </div>

            <nav className="account-nav">
              <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                <LayoutDashboard size={18} /><span>Dashboard</span>
              </button>
              <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                <Package size={18} /><span>My Orders</span>
              </button>
              <button className={`nav-item ${activeTab === 'my-products' ? 'active' : ''}`} onClick={() => setActiveTab('my-products')}>
                <Store size={18} /><span>My Designed Products ({myProducts.length})</span>
              </button>
              <button className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`} onClick={() => setActiveTab('addresses')}>
                <MapPin size={18} /><span>Addresses</span>
              </button>
              
              <button className="nav-item" onClick={() => router.push('/sell-product')} style={{ color: '#000000', fontWeight: 'bold' }}>
                <Store size={18} /><span>Sell Your Product</span>
              </button>

              <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                <Settings size={18} /><span>Account Settings</span>
              </button>
              <button className="nav-item logout-btn" onClick={handleLogout}>
                <LogOut size={18} /><span>Logout</span>
              </button>
            </nav>
          </aside>

          <main className="account-content">
            {activeTab === 'overview' && (
              <div className="tab-content">
                <div className="section-header">
                  <h3 className="section-title" style={{ margin: 0 }}>Dashboard Overview</h3>
                  <button onClick={() => router.push('/sell-product')} className="primary-action-btn">
                    <Store size={16} /> Start Selling
                  </button>
                </div>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon-wrapper"><ShoppingBag size={20} /></div>
                    <div><h4>Total Orders</h4><p className="stat-value">{orders.length}</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrapper"><Store size={20} /></div>
                    <div><h4>Designed Products</h4><p className="stat-value">{myProducts.length}</p></div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon-wrapper"><Calendar size={20} /></div>
                    <div><h4>Member Since</h4><p className="stat-value">{user.joinedDate}</p></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="tab-content">
                <h2 className="section-title">My Orders</h2>
                <p style={{ color: '#6c757d', fontSize: '14px' }}>No orders found.</p>
              </div>
            )}

            {activeTab === 'my-products' && (
              <div className="tab-content">
                <div className="section-header" style={{ marginBottom: '20px' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>Products Designed By You</h2>
                  <button onClick={() => router.push('/sell-product')} className="primary-action-btn">
                    <Store size={16} /> Add New Product
                  </button>
                </div>

                {myProducts.length === 0 ? (
                  <p style={{ color: '#6c757d', fontSize: '14px' }}>You haven't designed or listed any products yet.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                    {myProducts.map(product => (
                      <div key={product.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '12px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px' }} 
                          onError={(e)=>{ (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'; }}
                        />
                        <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '4px 0', color: '#111' }}>{product.title}</h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <span style={{ fontWeight: 'bold', color: '#000' }}>{product.price}</span>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 'bold' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="tab-content">
                <h2 className="section-title">Saved Addresses</h2>
                <p style={{ color: '#6c757d', fontSize: '14px' }}>No addresses added.</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="tab-content">
                <h2 className="section-title">Account Settings</h2>
                <form className="settings-form" onSubmit={handleSaveChanges}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <UserIcon size={18} className="field-icon" />
                      <input 
                        type="text" 
                        value={formState.name} 
                        onChange={e => setFormState({...formState, name: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="field-icon" />
                      <input 
                        type="email" 
                        value={formState.email} 
                        onChange={e => setFormState({...formState, email: e.target.value})} 
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Password (Optional)</label>
                    <div className="input-with-icon">
                      <Lock size={18} className="field-icon" />
                      <input 
                        type="password" 
                        placeholder="Leave blank to keep current" 
                        value={formState.password} 
                        onChange={e => setFormState({...formState, password: e.target.value})} 
                      />
                    </div>
                  </div>

                  <button type="submit" className="primary-action-btn">Save Changes</button>
                </form>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}