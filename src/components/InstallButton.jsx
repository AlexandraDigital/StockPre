import React, { useState } from 'react';
import { Download, TrendingUp } from 'lucide-react';

const InstallButton = () => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInstall = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsInstalled(true);
    }, 1500);
  };

  const handleOpen = () => {
    window.location.href = 'https://stockpre.pages.dev';
  };

  return (
    <div className="flex items-center gap-4">
      {/* SVG Stock Icon */}
      <div className="flex items-center">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          <defs>
            <linearGradient id="candleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="40" height="40" rx="8" fill="rgba(99, 102, 241, 0.1)" />

          {/* Candlestick 1 */}
          <g filter="url(#glow)">
            <line x1="8" y1="24" x2="8" y2="28" stroke="url(#candleGradient)" strokeWidth="2" strokeLinecap="round" />
            <rect x="6" y="18" width="4" height="6" fill="url(#candleGradient)" rx="1" />
          </g>

          {/* Candlestick 2 */}
          <g filter="url(#glow)">
            <line x1="14" y1="20" x2="14" y2="28" stroke="url(#candleGradient)" strokeWidth="2" strokeLinecap="round" />
            <rect x="12" y="14" width="4" height="6" fill="url(#candleGradient)" rx="1" />
          </g>

          {/* Candlestick 3 */}
          <g filter="url(#glow)">
            <line x1="20" y1="16" x2="20" y2="28" stroke="url(#candleGradient)" strokeWidth="2" strokeLinecap="round" />
            <rect x="18" y="10" width="4" height="6" fill="url(#candleGradient)" rx="1" />
          </g>

          {/* Candlestick 4 */}
          <g filter="url(#glow)">
            <line x1="26" y1="18" x2="26" y2="28" stroke="url(#candleGradient)" strokeWidth="2" strokeLinecap="round" />
            <rect x="24" y="12" width="4" height="6" fill="url(#candleGradient)" rx="1" />
          </g>

          {/* Candlestick 5 */}
          <g filter="url(#glow)">
            <line x1="32" y1="14" x2="32" y2="28" stroke="url(#candleGradient)" strokeWidth="2" strokeLinecap="round" />
            <rect x="30" y="8" width="4" height="6" fill="url(#candleGradient)" rx="1" />
          </g>

          {/* Dollar Sign */}
          <text x="20" y="35" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#fbbf24">$</text>
        </svg>
      </div>

      {/* Install Button */}
      <button
        onClick={isInstalled ? handleOpen : handleInstall}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
          isInstalled
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
        }`}
      >
        {isLoading ? (
          <>
            <span className="inline-block animate-spin">⟳</span>
            Installing...
          </>
        ) : isInstalled ? (
          <>
            <TrendingUp size={16} />
            Open StockPre
          </>
        ) : (
          <>
            <Download size={16} />
            Install App
          </>
        )}
      </button>
    </div>
  );
};

export default InstallButton;