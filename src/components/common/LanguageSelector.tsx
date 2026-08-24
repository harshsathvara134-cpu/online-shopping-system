import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';

export const LanguageSelector: React.FC = () => {
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
      {/* Trigger Button */}
      <button
        type="button"
        id="language-selector-btn"
        onClick={() => setIsOpen((p) => !p)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 10px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
          transition: 'border-color 0.2s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-color)')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span role="img" aria-label="India" style={{ fontSize: '1rem', lineHeight: 1 }}>🇮🇳</span>
        <span style={{ fontWeight: 800, color: '#1e293b' }}>{current.code}</span>
        <ChevronDown
          size={13}
          color="var(--text-muted)"
          style={{ marginTop: '1px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
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
                  aria-selected={isSelected}
                  onClick={() => handleSelect(lang.code)}
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
            <span>Shopping on <strong>NexusMart.in</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
