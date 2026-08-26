import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/admin/products', label: 'Products', icon: <Package size={18} /> },
    { to: '/admin/categories', label: 'Categories', icon: <Layers size={18} /> },
    { to: '/admin/brands', label: 'Brands', icon: <Tag size={18} /> },
    { to: '/admin/orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
    { to: '/admin/reviews', label: 'Customer Reviews', icon: <MessageSquare size={18} /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { to: '/admin/settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Admin Sidebar */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#0f172a',
          color: '#cbd5e1',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          borderRight: '1px solid #1e293b',
        }}
      >
        {/* Admin Brand */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
              JAYVEER<span style={{ color: '#818cf8' }}>Admin</span>
            </div>
            <div style={{ fontSize: '0.6875rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Control Center v3.0
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'white' : '#94a3b8',
                backgroundColor: isActive ? '#4f46e5' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              })}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Storefront Link & Admin User Info */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px',
              backgroundColor: '#1e293b',
              borderRadius: 'var(--radius-md)',
              color: '#a5b4fc',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={14} /> Back to Storefront
          </Link>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowY: 'auto' }}>
        {/* Dynamic Nested Page Content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
