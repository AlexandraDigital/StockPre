import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, TrendingUp } from 'lucide-react';

// SVG Stock Icon Component
const StockIcon: React.FC = () => {
  return (
    <svg
      viewBox="0 0 200 200"
      width="200"
      height="200"
      className="animate-pulse"
      style={{
        filter: 'drop-shadow(0 10px 30px rgba(168, 85, 247, 0.3))',
      }}
    >
      {/* Background gradient circle */}
      <defs>
        <linearGradient id="stockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer circle background */}
      <circle cx="100" cy="100" r="95" fill="url(#stockGradient)" opacity="0.15" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="url(#stockGradient)" strokeWidth="2" opacity="0.4" />

      {/* Central glowing circle */}
      <circle
        cx="100"
        cy="100"
        r="70"
        fill="none"
        stroke="url(#stockGradient)"
        strokeWidth="3"
        opacity="0.6"
        filter="url(#glow)"
      />

      {/* Candlestick chart pattern - uptrend */}
      {/* Candle 1 */}
      <g>
        <line x1="50" y1="120" x2="50" y2="80" stroke="url(#stockGradient)" strokeWidth="3" strokeLinecap="round" />
        <rect x="45" y="85" width="10" height="20" fill="url(#stockGradient)" opacity="0.8" rx="2" />
      </g>

      {/* Candle 2 */}
      <g>
        <line x1="75" y1="110" x2="75" y2="60" stroke="url(#stockGradient)" strokeWidth="3" strokeLinecap="round" />
        <rect x="70" y="65" width="10" height="25" fill="url(#stockGradient)" opacity="0.9" rx="2" />
      </g>

      {/* Candle 3 */}
      <g>
        <line x1="100" y1="95" x2="100" y2="50" stroke="url(#stockGradient)" strokeWidth="3" strokeLinecap="round" />
        <rect x="95" y="55" width="10" height="30" fill="url(#stockGradient)" rx="2" />
      </g>

      {/* Candle 4 */}
      <g>
        <line x1="125" y1="100" x2="125" y2="70" stroke="url(#stockGradient)" strokeWidth="3" strokeLinecap="round" />
        <rect x="120" y="75" width="10" height="20" fill="url(#stockGradient)" opacity="0.85" rx="2" />
      </g>

      {/* Candle 5 */}
      <g>
        <line x1="150" y1="85" x2="150" y2="45" stroke="url(#stockGradient)" strokeWidth="3" strokeLinecap="round" />
        <rect x="145" y="50" width="10" height="30" fill="url(#stockGradient)" opacity="0.95" rx="2" />
      </g>

      {/* Uptrend arrow */}
      <g opacity="0.7">
        <line x1="75" y1="140" x2="140" y2="75" stroke="url(#stockGradient)" strokeWidth="2.5" strokeLinecap="round" />
        <polygon
          points="140,75 145,90 128,85"
          fill="url(#stockGradient)"
        />
      </g>

      {/* Dollar sign accent */}
      <text
        x="100"
        y="165"
        fontSize="28"
        fontWeight="bold"
        fill="url(#stockGradient)"
        textAnchor="middle"
        opacity="0.7"
      >
        $
      </text>
    </svg>
  );
};

// Install Button Component
const InstallButton: React.FC = () => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const handleInstall = () => {
    setIsInstalling(true);
    // Simulate installation
    setTimeout(() => {
      setIsInstalling(false);
      setIsInstalled(true);
    }, 2000);
  };

  const openApp = () => {
    window.open('https://stockpre.pages.dev', '_blank');
  };

  return (
    <div className="flex flex-col gap-6 items-center">
      {isInstalled ? (
        <button
          onClick={openApp}
          className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <TrendingUp size={20} />
          Open StockPre
        </button>
      ) : (
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className={`btn btn-lg gap-2 shadow-lg hover:shadow-xl transition-all ${
            isInstalling ? 'btn-disabled' : 'btn-primary'
          }`}
        >
          {isInstalling ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Installing...
            </>
          ) : (
            <>
              <Download size={20} />
              Install StockPre
            </>
          )}
        </button>
      )}

      <div className="text-center text-sm text-base-content/60 max-w-xs">
        {isInstalled ? (
          <p>✨ StockPre is ready to analyze your investments!</p>
        ) : (
          <p>Get real-time stock analysis with AI-powered insights and candlestick charts</p>
        )}
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-100 to-base-200 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-base-content mb-2">StockPre</h1>
        <p className="text-base-content/70 text-lg">AI-Powered Stock Dashboard</p>
      </div>

      {/* Icon Container */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-purple-500 to-violet-500 opacity-20 rounded-full"></div>
        <div className="relative z-10">
          <StockIcon />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-2xl">
        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body items-center text-center">
            <div className="text-3xl">📈</div>
            <h3 className="card-title text-base">Real-Time Prices</h3>
            <p className="text-sm text-base-content/70">Live market data updated every 30 seconds</p>
          </div>
        </div>

        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body items-center text-center">
            <div className="text-3xl">🤖</div>
            <h3 className="card-title text-base">AI Analysis</h3>
            <p className="text-sm text-base-content/70">AI-powered predictions and insights</p>
          </div>
        </div>

        <div className="card bg-base-200/50 border border-base-300">
          <div className="card-body items-center text-center">
            <div className="text-3xl">📊</div>
            <h3 className="card-title text-base">Technical Charts</h3>
            <p className="text-sm text-base-content/70">Interactive candlestick analysis</p>
          </div>
        </div>
      </div>

      {/* Install Button */}
      <InstallButton />

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-base-content/50">
        <p>Made with ❤️ for stock traders and AI enthusiasts</p>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(<App />);
