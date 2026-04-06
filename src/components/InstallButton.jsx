import { useState } from 'react';

export default function InstallButton() {
  const [installed, setInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInstall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setInstalled(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleOpen = () => {
    window.location.href = 'https://stockpre.pages.dev';
  };

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.8rem',
    },
    icon: {
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
      boxShadow: '0 8px 16px rgba(124, 58, 237, 0.3)',
      animation: isLoading ? 'pulse 1.5s infinite' : 'float 3s ease-in-out infinite',
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.6rem 1.2rem',
      background: installed ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
      fontFamily: 'monospace',
      whiteSpace: 'nowrap',
    },
    buttonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(6, 182, 212, 0.4)',
    },
    spinnerKeyframes: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
    `,
  };

  return (
    <>
      <style>{styles.spinnerKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.icon}>
          <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Candlestick Chart SVG */}
            <defs>
              <linearGradient id="candleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#e0e0e0', stopOpacity: 0.6 }} />
              </linearGradient>
            </defs>
            
            {/* Grid background */}
            <line x1="10" y1="85" x2="90" y2="85" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="10" y1="65" x2="90" y2="65" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="10" y1="45" x2="90" y2="45" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="10" y1="25" x2="90" y2="25" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            <line x1="10" y1="10" x2="10" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            
            {/* Candlesticks - Uptrend */}
            {/* Candle 1 - Down */}
            <line x1="25" y1="35" x2="25" y2="75" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" />
            <rect x="18" y="55" width="14" height="15" fill="rgba(239, 68, 68, 0.7)" />
            
            {/* Candle 2 - Up */}
            <line x1="40" y1="25" x2="40" y2="70" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="2" />
            <rect x="33" y="40" width="14" height="30" fill="rgba(34, 197, 94, 0.8)" />
            
            {/* Candle 3 - Down */}
            <line x1="55" y1="30" x2="55" y2="65" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="2" />
            <rect x="48" y="45" width="14" height="15" fill="rgba(239, 68, 68, 0.7)" />
            
            {/* Candle 4 - Up */}
            <line x1="70" y1="20" x2="70" y2="60" stroke="rgba(34, 197, 94, 0.9)" strokeWidth="2" />
            <rect x="63" y="35" width="14" height="25" fill="rgba(34, 197, 94, 0.8)" />
            
            {/* Dollar sign accent */}
            <text x="82" y="60" fontSize="20" fontWeight="bold" fill="rgba(255,255,255,0.6)" fontFamily="monospace">$</text>
            
            {/* Uptrend arrow indicator */}
            <polyline points="78,68 88,58 88,68" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <button
          style={styles.button}
          onClick={installed ? handleOpen : handleInstall}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, { transform: 'translateY(0)', boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)' })}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                <circle cx="12" cy="12" r="10" />
              </svg>
              Installing...
            </>
          ) : installed ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13 2 13 9 20 9"></polyline>
              </svg>
              Open App
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Install App
            </>
          )}
        </button>
      </div>
    </>
  );
}
