import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  UserCheck,
  Server,
  FileText,
  Search,
  Printer,
  ChevronRight,
  HelpCircle,
  Mail,
  Phone,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  KeyRound,
  Download,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface PrivacySection {
  id: string;
  title: string;
  badge?: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const PrivacyNoticePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('intro');

  const handlePrint = () => {
    window.print();
  };

  const sections: PrivacySection[] = useMemo(
    () => [
      {
        id: 'intro',
        title: '1. Commitment & DPDP Act Compliance',
        badge: 'Legal Basis',
        icon: <ShieldCheck size={20} color="#10b981" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              At <strong>JAYVEERMart Enterprise</strong> (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;), we take your privacy and personal data autonomy with the utmost seriousness. This Privacy Notice outlines how we collect, process, store, and safeguard your personal information across our website (<code>jayveermart.com</code>) and mobile applications.
            </p>
            <div style={{ backgroundColor: '#ecfdf5', borderLeft: '4px solid #10b981', padding: '1rem 1.25rem', borderRadius: '0 8px 8px 0', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                Digital Personal Data Protection (DPDP) Act & Global Standards
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#047857', margin: 0 }}>
                Our privacy framework complies strictly with the <strong>Digital Personal Data Protection Act, 2023 (India)</strong>, the Information Technology Act, 2000, and incorporates international data privacy principles including transparent consent and data minimization.
              </p>
            </div>
            <p style={{ lineHeight: 1.7, color: '#334155' }}>
              By creating an account or using JAYVEERMart, you consent to the data collection and handling practices described in this notice. You retain the right to withdraw your consent or request data deletion at any time.
            </p>
          </div>
        ),
      },
      {
        id: 'data-collection',
        title: '2. Information We Collect',
        badge: 'Data Matrix',
        icon: <Database size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We collect information you directly provide to us, as well as telemetry automatically recorded during your storefront interactions:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                  <UserCheck size={16} color="#4f46e5" /> Identity & Profile Data
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Full name, email address, mobile phone number, delivery shipping addresses, pin code, state, and avatar profile preferences.
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                  <Lock size={16} color="#4f46e5" /> Transaction & Payment Tokens
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Order history, invoice receipts, item identifiers, masked payment tokens (last 4 digits/VPA handle) provided by certified payment gateways.
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                  <Server size={16} color="#4f46e5" /> Device & Technical Telemetry
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  IP address, browser user-agent, operating system, screen resolution, referral URLs, language preference, and page load latency.
                </p>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.35rem' }}>
                  <Sparkles size={16} color="#4f46e5" /> AI Chatbot Interactions
                </div>
                <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
                  Conversational inquiries submitted to our Nexus AI Assistant to provide live recommendations, order assistance, and support resolution.
                </p>
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              <strong>Note on Sensitive Payment Information:</strong> JAYVEERMart does not store full credit/debit card numbers, CVVs, or Net Banking credentials on its application servers.
            </p>
          </div>
        ),
      },
      {
        id: 'data-usage',
        title: '3. How We Process & Utilize Your Data',
        badge: 'Purpose',
        icon: <Eye size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We utilize collected data strictly for lawful, legitimate business objectives that enhance your shopping journey:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8, color: '#334155', marginBottom: '1rem' }}>
              <li><strong>Order Fulfillment & Delivery:</strong> Relaying destination address and contact info to our logistics partners for timely order dispatch and delivery confirmation OTPs.</li>
              <li><strong>Customer Support & Issue Resolution:</strong> Investigating return requests, refunds, defective items, or order tracking queries via live chat, email, or telephone.</li>
              <li><strong>Fraud Detection & System Security:</strong> Analyzing anomalous login attempts, brute-force OTP attempts, velocity attacks, or unauthorized payment disputes.</li>
              <li><strong>Smart Personalization & Recommendations:</strong> Recommending tailored catalog items, deals, and category updates based on your browsing interests and wishlist.</li>
              <li><strong>Legal & Tax Compliance:</strong> Generating mandatory GST tax invoices and maintaining accounting ledgers as required by Indian commercial statutes.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'cookies-tracking',
        title: '4. Cookies & Local Storage Technologies',
        badge: 'Preferences',
        icon: <KeyRound size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We use cookies, browser local storage, and session tokens to ensure our single-page application functions seamlessly:
            </p>
            <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1e293b', color: 'white', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>Cookie / Key</th>
                    <th style={{ padding: '10px 14px' }}>Type</th>
                    <th style={{ padding: '10px 14px' }}>Purpose & Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}><code>nexus_auth_token</code></td>
                    <td style={{ padding: '10px 14px' }}>Essential</td>
                    <td style={{ padding: '10px 14px' }}>Maintains secure authenticated session token. Expires on logout or 30 days.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}><code>nexus_cart_items</code></td>
                    <td style={{ padding: '10px 14px' }}>Functional</td>
                    <td style={{ padding: '10px 14px' }}>Retains your selected cart and wishlist items across browser reloads.</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600 }}><code>nexusmart_lang</code></td>
                    <td style={{ padding: '10px 14px' }}>Preference</td>
                    <td style={{ padding: '10px 14px' }}>Saves your preferred language selection (EN, HI, GU, TA, TE, KN, ML, BN, MR).</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
              You may manage or disable cookies via your browser settings; however, disabling essential session tokens will prevent logging into your account or completing checkout.
            </p>
          </div>
        ),
      },
      {
        id: 'third-party-sharing',
        title: '5. Third-Party Sharing & Secure Gateways',
        badge: 'No Data Sale',
        icon: <Lock size={20} color="#10b981" />,
        content: (
          <div>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <h4 style={{ color: '#166534', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Our Strict No-Sale Commitment</h4>
              <p style={{ color: '#15803d', fontSize: '0.875rem', margin: 0 }}>
                JAYVEERMart <strong>NEVER</strong> sells, rents, monetizes, or trades your personal information or contact details to third-party marketing brokers or advertisers.
              </p>
            </div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Data is shared strictly with vetted, enterprise-grade service partners on a need-to-know basis:
            </p>
            <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8, color: '#334155' }}>
              <li><strong>Logistics Couriers:</strong> Delivery name, address, and mobile number provided to Blue Dart, Delhivery, Ecom Express for delivery completion.</li>
              <li><strong>Payment Gateways:</strong> Encrypted transaction tokens processed via RBI-licensed aggregators (Razorpay / PayU / Cashfree).</li>
              <li><strong>Cloud Infrastructure:</strong> High-availability encrypted cloud databases hosted on Google Cloud Platform & Firebase with Multi-AZ redundancy.</li>
              <li><strong>Legal Authorities:</strong> Solely upon receiving a lawful, authenticated warrant or judicial court order issued by authorized Indian law enforcement agencies.</li>
            </ul>
          </div>
        ),
      },
      {
        id: 'data-security',
        title: '6. Bank-Grade Security & Encryption Standards',
        badge: 'ISO / AES-256',
        icon: <ShieldCheck size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We implement comprehensive technical, organizational, and physical security safeguards to prevent data loss, unauthorized access, or leakage:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: 'white' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.25rem' }}>🔒 TLS 1.3 Encryption</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>All network communication is encrypted with modern SSL/TLS 1.3 certificates in transit.</p>
              </div>
              <div style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: 'white' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.25rem' }}>🛡️ AES-256 Storage</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>User credentials and database collections are encrypted at rest using AES-256 encryption.</p>
              </div>
              <div style={{ padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: 'white' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.25rem' }}>🔑 Salted Password Hashes</div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Passwords are hashed using cryptographically secure Argon2/bcrypt one-way key derivation.</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'retention-deletion',
        title: '7. Data Retention & Right to Account Deletion',
        badge: 'Data Lifecycle',
        icon: <Trash2 size={20} color="#ef4444" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              We retain personal data only for as long as your account remains active or as required to fulfill purchases and satisfy statutory tax requirements under Indian law (typically 7 years for GST commercial records).
            </p>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <h4 style={{ color: '#991b1b', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                Account Erasure & Right to Be Forgotten
              </h4>
              <p style={{ color: '#b91c1c', fontSize: '0.875rem', margin: 0 }}>
                You may request complete erasure of your account and personal identifiers at any time by heading to your{' '}
                <Link to="/my-profile" style={{ color: '#991b1b', fontWeight: 700, textDecoration: 'underline' }}>
                  My Profile settings
                </Link>{' '}
                or contacting <code>privacy@jayveermart.com</code>. Deletions are processed within 7 business days.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: 'user-rights',
        title: '8. Your Rights & Privacy Choices',
        badge: 'Empowerment',
        icon: <UserCheck size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              Under the Digital Personal Data Protection Act, you have substantial rights regarding your data:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { title: 'Right of Access', desc: 'Request a copy of all personal records and purchase logs associated with your account.' },
                { title: 'Right to Correction', desc: 'Update inaccurate names, phone numbers, or addresses directly in your profile dashboard.' },
                { title: 'Right to Consent Withdrawal', desc: 'Opt-out of promotional SMS or email newsletters at any time via a single click.' },
                { title: 'Right to Grievance Redressal', desc: 'Escalate unaddressed data privacy disputes directly to our Data Protection Officer.' },
              ].map((r, i) => (
                <div key={i} style={{ padding: '0.875rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.25rem' }}>✓ {r.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748b' }}>{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: 'dpo-contact',
        title: '9. Data Protection Officer (DPO) & Redressal',
        badge: 'Official Contact',
        icon: <HelpCircle size={20} color="#4f46e5" />,
        content: (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
              If you have inquiries, wish to exercise your statutory rights, or wish to file a privacy grievance, please reach out to our designated Data Protection Officer:
            </p>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Data Protection & Privacy Desk</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}><strong>Officer:</strong> Mr. Harshvardhan Sathvara (Lead Privacy Officer)</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}><strong>Organization:</strong> JAYVEERMart Enterprise Pvt. Ltd.</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}><strong>Address:</strong> Tech Park Tower B, Outer Ring Road, Bengaluru, Karnataka - 560103, India</div>
              <div style={{ fontSize: '0.875rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> <strong>Email:</strong> privacy@jayveermart.com / dpo@jayveermart.com
              </div>
              <div style={{ fontSize: '0.875rem', color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} /> <strong>Direct Helpline:</strong> +91 1800 123 4567
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.75rem' }}>
              All privacy requests are acknowledged within 24 hours and resolved within 15 business days.
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
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
          color: 'white',
          padding: '3.5rem 1.5rem 3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: '#a7f3d0', marginBottom: '1.25rem' }}>
            <Link to="/" style={{ color: '#d1fae5', textDecoration: 'none' }}>Home</Link>
            <ChevronRight size={14} />
            <span style={{ color: '#a7f3d0' }}>Legal & Policies</span>
            <ChevronRight size={14} />
            <span style={{ color: 'white', fontWeight: 600 }}>Privacy Notice</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  color: '#ecfdf5',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                <ShieldCheck size={14} /> DPDP Act (2023) Compliant
              </div>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, letterSpacing: '-0.5px', marginBottom: '0.75rem', color: 'white' }}>
                Privacy Notice
              </h1>
              <p style={{ color: '#d1fae5', maxWidth: '650px', fontSize: '1rem', lineHeight: 1.6 }}>
                Your privacy is paramount. Learn how JAYVEERMart handles your personal data, protects your financial tokens, and ensures total user autonomy.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handlePrint}
                className="btn btn-outline"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
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
                to="/conditions-of-use"
                className="btn"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#065f46',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.875rem',
                }}
              >
                <FileText size={16} /> View Conditions of Use
              </Link>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2rem',
              fontSize: '0.8125rem',
              color: '#a7f3d0',
            }}
          >
            <div><strong>Effective Date:</strong> January 1, 2026</div>
            <div><strong>Last Updated:</strong> October 2026 (v3.2)</div>
            <div><strong>Data Privacy Standard:</strong> DPDP Act 2023 & ISO 27001</div>
            <div><strong>Read Time:</strong> ~6 minutes</div>
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
            placeholder="Search within privacy notice (e.g. cookies, encryption, deletion, AI chatbot, sharing)..."
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
              <BookOpen size={18} color="#059669" />
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Privacy Navigation</h3>
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
                      color: isActive ? '#059669' : '#475569',
                      backgroundColor: isActive ? '#ecfdf5' : 'transparent',
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
              <Link to="/conditions-of-use" style={{ fontSize: '0.8125rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                Conditions of Use <ExternalLink size={12} />
              </Link>
              <Link to="/my-profile" style={{ fontSize: '0.8125rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Manage Account Privacy <ExternalLink size={12} />
              </Link>
            </div>
          </aside>

          {/* Section Clauses Body */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {filteredSections.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <Search size={40} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No privacy topics found matching &ldquo;{searchQuery}&rdquo;</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Try searching for &apos;cookies&apos;, &apos;encryption&apos;, or &apos;deletion&apos;.</p>
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
                          backgroundColor: '#ecfdf5',
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
                          color: '#065f46',
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

            {/* Privacy Inquiries Callout */}
            <div
              style={{
                backgroundColor: '#064e3b',
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
                  Need to exercise your data privacy rights?
                </h3>
                <p style={{ color: '#a7f3d0', fontSize: '0.875rem', margin: 0 }}>
                  Contact our Data Protection Desk or request a full data export directly from your account.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a
                  href="mailto:privacy@jayveermart.com"
                  className="btn btn-outline"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                >
                  <Mail size={16} /> Contact Privacy Desk
                </a>
                <Link
                  to="/my-profile"
                  className="btn"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    fontWeight: 700,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                  }}
                >
                  My Profile Settings
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNoticePage;
