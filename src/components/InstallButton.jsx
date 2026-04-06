import { useState, useEffect } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // Check if installed on iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator && window.navigator.standalone === true);

    if (isIOS && !isInStandaloneMode) {
      setIsVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsVisible(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setIsVisible(false);
    setIsInstalling(false);
  };

  if (isInstalled) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: "#00ff8822",
          border: "1px solid #00ff88",
          borderRadius: "4px",
          color: "#00ff88",
          fontSize: "0.85rem",
          fontWeight: "bold",
          fontFamily: "monospace",
        }}
      >
        ✓ Installed
      </div>
    );
  }

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={handleInstallClick}
      disabled={isInstalling}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 1.2rem",
        background: "#00d9ff",
        color: "#080d14",
        border: "none",
        borderRadius: "4px",
        fontWeight: "bold",
        fontSize: "0.9rem",
        fontFamily: "monospace",
        cursor: isInstalling ? "not-allowed" : "pointer",
        transition: "opacity 0.2s, transform 0.1s",
        opacity: isInstalling ? 0.6 : 1,
        transform: isInstalling ? "scale(0.98)" : "scale(1)",
      }}
      onMouseDown={(e) => {
        if (!isInstalling) e.currentTarget.style.transform = "scale(0.96)";
      }}
      onMouseUp={(e) => {
        if (!isInstalling) e.currentTarget.style.transform = "scale(1)";
      }}
      onMouseLeave={(e) => {
        if (!isInstalling) e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <span>{isInstalling ? "⟳" : "↓"}</span>
      <span>{isInstalling ? "Installing…" : "Install App"}</span>
    </button>
  );
}
