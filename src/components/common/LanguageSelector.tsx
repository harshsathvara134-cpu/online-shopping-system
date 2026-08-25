import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

interface LanguageSelectorProps {
  idPrefix?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ idPrefix = 'desktop' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const current = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', zIndex: 9000 }}>
      {/* Amazon nav-line-2 style trigger */}
      <button
        type="button"
        id={`language-selector-btn-${idPrefix}`}
        onClick={() => setIsOpen((p) => !p)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '5px 8px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'white',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.2s ease, background 0.2s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--primary)';
          e.currentTarget.style.background = '#f8f7ff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-color)';
          e.currentTarget.style.background = 'white';
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title={`Language: ${current.nativeName}`}
      >
        {/* Flag next to Language code */}
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', lineHeight: 1 }}>
          {/* India flag — SVG inline for pixel-perfect rendering */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 900 600"
            width="20"
            height="14"
            style={{ borderRadius: '2px', display: 'block', flexShrink: 0 }}
            aria-label="India"
            role="img"
          >
            <rect width="900" height="600" fill="#FF9933"/>
            <rect y="200" width="900" height="200" fill="#fff"/>
            <rect y="400" width="900" height="200" fill="#128807"/>
            {/* Ashoka Chakra */}
            <circle cx="450" cy="300" r="70" fill="none" stroke="#000080" strokeWidth="8"/>
            <circle cx="450" cy="300" r="10" fill="#000080"/>
            {Array.from({ length: 24 }).map((_, i) => {
              const angle = (i * 360) / 24;
              const rad = (angle * Math.PI) / 180;
              const x2 = 450 + 60 * Math.sin(rad);
              const y2 = 300 - 60 * Math.cos(rad);
              return (
                <line
                  key={i}
                  x1="450"
                  y1="300"
                  x2={x2}
                  y2={y2}
                  stroke="#000080"
                  strokeWidth="3"
                />
              );
            })}
          </svg>
          {/* Language code */}
          <span style={{ fontSize: '0.8125rem', fontWeight: 800, color: '#1e293b', letterSpacing: '0.02em' }}>
            {current.code}
          </span>
        </span>

        {/* Chevron */}
        <ChevronDown
          size={12}
          color="#64748b"
          style={{
            marginLeft: '2px',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="animate-fade-in"
          role="listbox"
          aria-label="Select Language"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 12px 35px rgba(0,0,0,0.18)',
            border: '1px solid #e2e8f0',
            zIndex: 99999,
            padding: '12px 14px',
            overflow: 'hidden',
          }}
        >
          {/* Arrow pointer */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              width: '10px',
              height: '10px',
              backgroundColor: 'white',
              borderLeft: '1px solid #e2e8f0',
              borderTop: '1px solid #e2e8f0',
            }}
          />

          <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.03em' }}>
            🌐 Change Language
          </div>

          {/* Language list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  role="option"
                  type="button"
                  aria-selected={isSelected}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(lang.code);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(lang.code);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '7px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: 'none',
                    backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                    color: isSelected ? '#e65100' : '#1e293b',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.85rem',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Radio indicator */}
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid #e65100' : '1.5px solid #94a3b8',
                      backgroundColor: 'white',
                      flexShrink: 0,
                      transition: 'border 0.15s ease',
                    }}
                  />
                  <span>{lang.nativeName}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#94a3b8' }}>{lang.code}</span>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ margin: '10px 0 6px', borderTop: '1px solid #f1f5f9' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <span>🇮🇳</span>
            <span>Shopping on <strong>JAYVEERMart.in</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
