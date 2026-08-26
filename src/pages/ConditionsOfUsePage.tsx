import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  ShieldCheck,
  CreditCard,
  Truck,
  RefreshCw,
  AlertTriangle,
  Scale,
  Lock,
  Search,
  Printer,
  ChevronRight,
  HelpCircle,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  badge?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const ConditionsOfUsePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('acceptance');

  const handlePrint = () => {
    window.print();
  };

  const sections: Section[] = useMemo(
    () => [
      {
        id: 'acceptance',
        title: '1. Acceptance of Terms & Eligibility',
        badge: 'Core Requirement',
        icon: <CheckCircle2 size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Welcome to <strong>JAYVEERMart</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us,&rdquo; or &ldquo;Platform&rdquo;), operated by JAYVEERMart Enterprise Private Limited. By accessing, browsing, registering, or making purchases on <code>jayveermart.com</code> and related applications, you acknowledge that you have read, understood, and agreed to be bound by these Conditions of Use, along with our{' '}
              <Link to="/privacy-notice" style={{ color: '#4f46e5', fontWeight: 600, textDecoration: 'underline' }}>
                Privacy Notice
              </Link>{' '}
              and all applicable operating rules.
            </p>
            <div style={{ backgroundColor: '#f8fafc', borderLeft: '4px solid #4f46e5', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>Age Requirement & Legal Capacity</h4>
              <p style={{ fontSize: '0.875rem', color: '#475569', margin: 0 }}>
                You must be at least 18 years of age or possess legal capacity under the Indian Contract Act, 1872 to enter into binding transactions. Minors may use our services solely under the supervision and explicit consent of a parent or legal guardian.
              </p>
            </div>
            <p style={{ lineHeight: 1.7 }}>
              If you do not agree to these terms in their entirety, you must discontinue accessing the Platform immediately. We reserve the right to modify these terms at any time with notice posted on this page.
            </p>
          </div>
        ),
      },
      {
        id: 'account-security',
        title: '2. User Accounts, Security & Authentication',
        badge: 'Security',
        icon: <Lock size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              When creating an account on JAYVEERMart, you agree to provide authentic, current, and complete details including your full legal name, valid mobile number, and active email address.
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem', lineHeight: 1.8, color: '#334155' }}>
              <li>
                <strong>Credential Confidentiality:</strong> You are solely responsible for safeguarding your password, OTPs (One Time Passwords), and login tokens. Any activity originating from your authenticated session will be attributed to you.
              </li>
              <li>
                <strong>Unauthorized Access Notification:</strong> If you suspect unauthorized access or compromise of your login credentials, you must notify our security team at{' '}
                <a href="mailto:security@jayveermart.com" style={{ color: '#4f46e5', fontWeight: 600 }}>
                  security@jayveermart.com
                </a>{' '}
                within 24 hours.
              </li>
              <li>
                <strong>Account Termination:</strong> JAYVEERMart reserves the right to suspend or terminate accounts that engage in fraudulent behavior, impersonation, chargeback abuse, or terms violation without prior notice.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'products-pricing',
        title: '3. Products, Pricing & Catalog Accuracy',
        badge: 'Transparent Pricing',
        icon: <ShieldCheck size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We take extreme care to display accurate descriptions, high-definition product imagery, technical specifications, and current stock availability for all products across electronics, fashion, home, and appliances.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: '#0f172a' }}>Inclusive of Taxes</h5>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>All prices listed on the storefront are in Indian Rupees (₹ INR) and include applicable Goods and Services Tax (GST).</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h5 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: '#0f172a' }}>Pricing Error Correction</h5>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>In the rare event of a technical typographical error resulting in a mispriced listing, we reserve the right to cancel the order and provide a 100% full refund.</p>
              </div>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              Actual product packaging and materials may contain different or additional information than shown on our website. Please inspect physical labels, warnings, and directions before using or consuming any product.
            </p>
          </div>
        ),
      },
      {
        id: 'orders-billing',
        title: '4. Orders, Payment Processing & Invoicing',
        badge: 'Secure Billing',
        icon: <CreditCard size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Placing an order constitutes an offer to purchase. An order is deemed accepted only after order confirmation email/SMS dispatch with a unique Order Tracking ID (e.g. <code>ORD-XXXXX</code>).
            </p>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '1rem', marginBottom: '0.75rem' }}>Supported Payment Methods</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { name: 'UPI & QR Code', desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                { name: 'Credit & Debit Cards', desc: 'Visa, Mastercard, RuPay, Amex' },
                { name: 'Net Banking', desc: '50+ Major Indian Banks' },
                { name: 'Cash on Delivery (COD)', desc: 'Available for orders up to ₹25,000' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: 'white' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
              All online card and UPI transactions are encrypted and processed through RBI-compliant, PCI-DSS Level 1 certified payment gateways. JAYVEERMart never stores your full card numbers, CVV codes, or net banking passwords.
            </p>
          </div>
        ),
      },
      {
        id: 'shipping-delivery',
        title: '5. Shipping, Dispatch & Express Delivery SLAs',
        badge: 'Fulfillment',
        icon: <Truck size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We partner with India&apos;s leading logistics providers (including Blue Dart, Delhivery, Ecom Express, and Xpressbees) to ensure speedy, secure fulfillment.
            </p>
            <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1e293b', color: 'white' }}>
                    <th style={{ padding: '10px 14px', borderRadius: '6px 0 0 0' }}>Region</th>
                    <th style={{ padding: '10px 14px' }}>Estimated Transit SLA</th>
                    <th style={{ padding: '10px 14px', borderRadius: '0 6px 0 0' }}>Standard Shipping Charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Metro Cities (Tier 1)</td>
                    <td style={{ padding: '10px 14px' }}>24 - 48 Hours</td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 700 }}>FREE over ₹1,000 (Else ₹49)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Urban & Tier 2 Cities</td>
                    <td style={{ padding: '10px 14px' }}>2 - 4 Business Days</td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 700 }}>FREE over ₹1,000 (Else ₹49)</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}>Rest of India / Rural Pin Codes</td>
                    <td style={{ padding: '10px 14px' }}>4 - 7 Business Days</td>
                    <td style={{ padding: '10px 14px', color: '#10b981', fontWeight: 700 }}>FREE over ₹1,000 (Else ₹79)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
              In circumstances involving adverse weather, natural disasters, state elections, or unforeseen transit blockades, delivery timelines may experience minor delays. Live tracking links are provided in your{' '}
              <Link to="/my-orders" style={{ color: '#4f46e5', fontWeight: 600 }}>
                My Orders
              </Link>{' '}
              dashboard.
            </p>
          </div>
        ),
      },
      {
        id: 'returns-refunds',
        title: '6. 7-Day Hassle-Free Returns & Replacement Policy',
        badge: 'Customer First',
        icon: <RefreshCw size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Customer satisfaction is our highest priority. Most brand items purchased on JAYVEERMart are eligible for return or replacement within <strong>7 days</strong> of delivery.
            </p>
            <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ color: '#065f46', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Eligible Conditions for Return / Replacement:</h4>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#047857', lineHeight: 1.7 }}>
                <li>Product received is physically damaged, defective, or non-functional.</li>
                <li>Item delivered differs significantly from the description, brand, or color ordered.</li>
                <li>Size or fit issue on apparel and footwear (with all original tags intact).</li>
                <li>Missing components, accessories, or manuals inside the box.</li>
              </ul>
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>Refund Turnaround Time:</h4>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
              Once our courier partner collects the return and the item passes basic quality verification at our fulfillment hub, refunds are triggered immediately:
            </p>
            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#475569', lineHeight: 1.7 }}>
              <li><strong>UPI / Instant Refund:</strong> 2 - 24 Hours directly to your source VPA.</li>
              <li><strong>Credit / Debit Cards:</strong> 3 - 5 Banking Business Days.</li>
              <li><strong>Cash on Delivery (COD):</strong> Bank transfer via NEFT / IMPS to provided account details.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'intellectual-property',
        title: '7. Intellectual Property & Trademark Rights',
        badge: 'Copyright',
        icon: <Scale size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              All software, source code, visual UI elements, brand logos, graphic icons, audio clips, data compilations, product images, and text content featured on this platform are the proprietary intellectual property of JAYVEERMart Enterprise or its respective brand licensors, protected by Indian and international copyright and trademark laws.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
              You may not scrape, frame, mirror, reverse-engineer, decompile, or systematically extract data from our application without prior written express permission from JAYVEERMart Enterprise.
            </p>
          </div>
        ),
      },
      {
        id: 'user-conduct',
        title: '8. Prohibited Conduct & Platform Integrity',
        badge: 'Compliance',
        icon: <AlertTriangle size={20} color="#ef4444" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Users agree to access the platform exclusively for lawful personal or commercial retail purchasing. When interacting with JAYVEERMart, you explicitly agree not to:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
              {[
                'Deploy automated spiders, web crawlers, or bot scripts to place bulk speculative orders.',
                'Engage in payment fraud, identity theft, or unauthorized card token usage.',
                'Post defamatory, abusive, obscene, or fraudulent product reviews.',
                'Interfere with or overload platform servers, CDN caches, or security firewalls.',
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '0.75rem 1rem', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', fontSize: '0.8125rem', color: '#9f1239' }}>
                  ⚠️ {item}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              Violations may result in immediate account revocation, IP range blocklisting, and civil/criminal legal action under the Information Technology Act, 2000.
            </p>
          </div>
        ),
      },
      {
        id: 'governing-law',
        title: '9. Limitation of Liability & Governing Jurisdiction',
        badge: 'Legal',
        icon: <BookOpen size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              To the maximum extent permitted by applicable Indian Law, JAYVEERMart shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from product usage or platform downtime. Our aggregate liability shall not exceed the amount actually paid by you for the specific product under dispute.
            </p>
            <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <h5 style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.25rem' }}>Jurisdiction & Dispute Resolution</h5>
              <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>
                These Conditions of Use shall be governed by and construed in accordance with the Laws of India. Any disputes or claims arising out of or related to platform operations shall be subject to the exclusive jurisdiction of the competent courts in <strong>Bengaluru, Karnataka, India</strong>.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'grievance-contact',
        title: '10. Grievance Redressal Officer & Contact Desk',
        badge: 'Contact',
        icon: <HelpCircle size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 and Consumer Protection (E-Commerce) Rules, 2020, the details of our appointed Grievance Officer are:
            </p>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Mr. Harshvardhan Sathvara</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>Senior Grievance Redressal Officer & Legal Counsel</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}><strong>Entity:</strong> JAYVEERMart Enterprise Pvt. Ltd.</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}><strong>Address:</strong> Tech Park Tower B, Outer Ring Road, Bengaluru, Karnataka - 560103, India</div>
              <div style={{ fontSize: '0.875rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> <strong>Email:</strong> grievance-officer@jayveermart.com
              </div>
              <div style={{ fontSize: '0.875rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} /> <strong>Toll-Free Support:</strong> +91 1800 123 4567 (Mon-Sat, 9:00 AM - 7:00 PM IST)
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.75rem' }}>
              We acknowledge consumer complaints within 48 hours and strive to resolve all consumer grievances within one month from the date of receipt.
            </p>
          </div>
        ),
      },
    ],
    []
  );

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.id.toLowerCase().includes(q)
    );
  }, [sections, searchQuery]);

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Hero Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
          color: 'white',
          padding: '3.5rem 1.5rem 3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#818cf8' }}>Legal & Policies</span>
            <ChevronRight size={14} />
            <span style={{ color: 'white', fontWeight: 600 }}>Conditions of Use</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(129, 140, 248, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  color: '#c7d2fe',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                <FileText size={14} /> Enterprise Legal Agreement
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.75rem', color: 'white' }}>
                Conditions of Use
              </h1>
              <p style={{ color: '#cbd5e1', maxWidth: '650px', fontSize: '1rem', lineHeight: 1.6 }}>
                These Conditions of Use govern your access to and purchase transactions on JAYVEERMart. Please review them carefully before placing orders.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrint}
                className="btn btn-outline"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <Printer size={16} /> Print / Save PDF
              </button>
              <Link
                to="/privacy-notice"
                className="btn btn-primary"
                style={{
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <ShieldCheck size={16} /> View Privacy Notice
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              fontSize: '0.8125rem',
              color: '#94a3b8',
            }}
          >
            <div><strong>Effective Date:</strong> January 1, 2026</div>
            <div><strong>Last Updated:</strong> October 2026 (v3.2)</div>
            <div><strong>Applicable Law:</strong> Republic of India (IT Act 2000)</div>
            <div><strong>Reading Time:</strong> ~7 minutes</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ marginTop: '2.5rem' }}>
        {/* Search / Filter Toolbar */}
        <div
          className="card"
          style={{
            padding: '1rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-color)',
          }}
        >
          <Search size={20} color="#64748b" />
          <input
            type="text"
            placeholder="Search within terms (e.g. returns, refunds, delivery, payment, liability)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.9375rem',
              backgroundColor: 'transparent',
              color: '#0f172a',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Clear
            </button>
          )}
        </div>

        {/* 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 300px) minmax(0, 1fr)', gap: '2.5rem', alignItems: 'start' }}>
          {/* Sticky Table of Contents Sidebar */}
          <aside
            style={{
              position: 'sticky',
              top: '90px',
              backgroundColor: 'white',
              borderRadius: '16px',
              border: '1px solid var(--border-color)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto',
            }}
            className="hide-mobile"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
              <BookOpen size={18} color="#4f46e5" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Table of Contents</h3>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#4f46e5' : '#475569',
                      backgroundColor: isActive ? '#eef2ff' : 'transparent',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {sec.title}
                    </span>
                    {isActive && <ChevronRight size={14} />}
                  </a>
                );
              })}
            </nav>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Related Documentation
              </div>
              <Link to="/privacy-notice" style={{ fontSize: '0.8125rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                Privacy Notice <ExternalLink size={12} />
              </Link>
              <a href="mailto:support@jayveermart.com" style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Customer Helpdesk <ExternalLink size={12} />
              </a>
            </div>
          </aside>

          {/* Section Clauses Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {filteredSections.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Search size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No clauses found matching &ldquo;{searchQuery}&rdquo;</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Try using different terms or click below to clear your search query.</p>
                <button onClick={() => setSearchQuery('')} className="btn btn-primary btn-sm">
                  Reset Search
                </button>
              </div>
            ) : (
              filteredSections.map((sec) => (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="card"
                  style={{
                    padding: '2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    scrollMarginTop: '100px',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: '#eef2ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {sec.icon}
                      </div>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        {sec.title}
                      </h2>
                    </div>

                    {sec.badge && (
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {sec.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ color: '#334155', fontSize: '0.9375rem' }}>
                    {sec.content}
                  </div>
                </section>
              ))
            )}

            {/* Bottom Support Callout Card */}
            <div
              style={{
                backgroundColor: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                background: '#1e1b4b',
                color: 'white',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                marginTop: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', marginBottom: '0.35rem' }}>
                  Have questions regarding these Conditions of Use?
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0 }}>
                  Our customer care and legal support team is available 24/7 to clarify any policy questions.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="mailto:support@jayveermart.com"
                  className="btn btn-outline"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                >
                  <Mail size={16} /> Email Support
                </a>
                <Link
                  to="/store"
                  className="btn btn-primary"
                  style={{
                    backgroundColor: '#818cf8',
                    color: '#0f172a',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                >
                  Return to Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionsOfUsePage;
