import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ALL_VIEWS, ROUTE_MAP, type ViewItem } from './data/views.ts';
import {
  ShoppingBag,
  Store,
  Truck,
  ShieldCheck,
  Smartphone,
  Monitor,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Search,
  ExternalLink,
  Layers,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  X,
  Keyboard,
  Compass
} from 'lucide-react';

type Persona = 'Customer Experience' | 'Merchant Operations' | 'Wholesale & Sourcing' | 'Super Admin';

const getViewPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export default function App() {
  // Sync state with URL hash
  const initialView = useMemo(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      if (ROUTE_MAP[hash.toLowerCase()]) {
        const foundBySlug = ALL_VIEWS.find((v) => v.id === ROUTE_MAP[hash.toLowerCase()]);
        if (foundBySlug) return foundBySlug;
      }
      const found = ALL_VIEWS.find(
        (v) => v.id.toLowerCase() === hash.toLowerCase() || v.filename.toLowerCase() === hash.toLowerCase()
      );
      if (found) return found;
      const indexNum = parseInt(hash.replace(/\D/g, ''), 10);
      if (!isNaN(indexNum)) {
        const foundByIndex = ALL_VIEWS.find((v) => v.index === indexNum);
        if (foundByIndex) return foundByIndex;
      }
    }
    // Default to Customer Home Dashboard (view 2) or Price Comparison (view 1)
    return ALL_VIEWS[1] || ALL_VIEWS[0];
  }, []);

  const [currentView, setCurrentView] = useState<ViewItem>(initialView);
  const [selectedPersona, setSelectedPersona] = useState<Persona>(initialView.category);
  const [isMobileMode, setIsMobileMode] = useState<boolean>(initialView.isMobile);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Cross-screen link interception inside iframe
  const handleIframeLoad = () => {
    setIsLoadingIframe(false);
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      doc.addEventListener('click', (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a, button, [data-path]');
        if (!target) return;

        const dataPath = target.getAttribute('data-path');
        if (dataPath && ROUTE_MAP[dataPath]) {
          const targetViewId = ROUTE_MAP[dataPath];
          const found = ALL_VIEWS.find((v) => v.id === targetViewId);
          if (found) {
            e.preventDefault();
            e.stopPropagation();
            setCurrentView(found);
            return;
          }
        }

        const ariaLabel = target.getAttribute('aria-label');
        if (ariaLabel?.toLowerCase() === 'cart') {
          e.preventDefault();
          e.stopPropagation();
          const cartView = ALL_VIEWS.find((v) => v.id === 'v03');
          if (cartView) setCurrentView(cartView);
          return;
        }

        const textContent = target.textContent?.trim().toLowerCase() || '';
        if (textContent.includes('merchant portal')) {
          e.preventDefault();
          e.stopPropagation();
          const merchantView = ALL_VIEWS.find((v) => v.id === 'v21');
          if (merchantView) setCurrentView(merchantView);
          return;
        }
      });
    } catch {
      // Ignore cross-origin issues if any
    }
  };

  // Listen to postMessage navigation from iframe runtime
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NAVIGATE') {
        const rawPath = (event.data.path || '').toString().trim().toLowerCase();
        const path = rawPath.replace(/^\/+/, '').replace(/\.html$/, '');

        const MOBILE_MAP: Record<string, string> = {
          'home': 'v08',
          'store-discovery': 'v08',
          'price-compare': 'v09',
          'compare': 'v09',
          'my-cart': 'v07',
          'cart': 'v07',
          'checkout': 'v07',
          'product-details': 'v06',
          'details': 'v06',
          'auth': 'v10',
          'login': 'v10',
          'register': 'v10',
          'welcome': 'v10',
          'verification': 'v16',
          'verification-dossier': 'v16',
          'dossier': 'v16',
          'scan-and-verify': 'v15',
          'scanner': 'v15',
          'scanner-hud': 'v15',
          'district-demand': 'v18',
          'demands': 'v18',
          'demand-hub': 'v18',
          'requests': 'v17',
          'request-hub': 'v17',
          'merchant-dashboard': 'v23',
          'store-dashboard': 'v23',
          'overview': 'v23',
          'inventory-sku-studio': 'v26',
          'inventory': 'v26',
          'sku-studio': 'v26',
          'live-orders-dispatch': 'v25',
          'orders': 'v25',
          'live-orders': 'v25',
          'customer-requests-bids': 'v24',
          'customer-requests': 'v24',
          'merchant-portal': 'v23',
          'wholesale-sourcing': 'v33',
          'wholesale': 'v33',
          'bulk-product-catalogue': 'v34',
          'catalogue': 'v34',
          'merchant-rfqs-and-quotations': 'v35',
          'rfqs': 'v35',
          'purchase-orders': 'v36',
          'supply-and-dispatch-fleet': 'v37',
          'dispatch': 'v37',
          'supplier-onboarding': 'v38',
          'compliance': 'v38'
        };

        let targetId = (isMobileMode || currentView.isMobile) && MOBILE_MAP[path]
          ? MOBILE_MAP[path]
          : ROUTE_MAP[path];

        if (!targetId) {
          const directMatch = ALL_VIEWS.find(
            (v) =>
              v.id.toLowerCase() === path ||
              v.filename.toLowerCase() === path ||
              v.filename.replace('.html', '').toLowerCase() === path ||
              `v${v.index}` === path ||
              `v0${v.index}` === path ||
              `${v.index}` === path
          );
          if (directMatch) targetId = directMatch.id;
        }

        if (targetId) {
          const found = ALL_VIEWS.find((v) => v.id === targetId);
          if (found && found.id !== currentView.id) {
            setCurrentView(found);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentView, isMobileMode]);

  // Update hash when view changes
  useEffect(() => {
    window.location.hash = currentView.id;
    setSelectedPersona(currentView.category);
    // Auto switch mobile mode if view is marked as mobile
    if (currentView.isMobile) {
      setIsMobileMode(true);
    }
    setIsLoadingIframe(true);
  }, [currentView]);

  // Listen to hash changes (e.g. browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const found = ALL_VIEWS.find(
          (v) => v.id.toLowerCase() === hash.toLowerCase() || v.filename.toLowerCase() === hash.toLowerCase()
        );
        if (found && found.id !== currentView.id) {
          setCurrentView(found);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentView]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === ']') {
        navigateNext();
      } else if (e.key === 'ArrowLeft' || e.key === '[') {
        navigatePrev();
      } else if (e.key.toLowerCase() === 'm') {
        setIsMobileMode((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        setIsFullscreen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowCatalogModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowCatalogModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView]);

  const personaViews = useMemo(() => {
    return ALL_VIEWS.filter((v) => v.category === selectedPersona);
  }, [selectedPersona]);

  const filteredViews = useMemo(() => {
    if (!searchQuery.trim()) return ALL_VIEWS;
    const q = searchQuery.toLowerCase();
    return ALL_VIEWS.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.shortTitle.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.tags.some((t) => t.toLowerCase().includes(q)) ||
        v.id.toLowerCase().includes(q) ||
        `view ${v.index}`.includes(q)
    );
  }, [searchQuery]);

  const navigateNext = () => {
    const currentIndex = ALL_VIEWS.findIndex((v) => v.id === currentView.id);
    const nextIndex = (currentIndex + 1) % ALL_VIEWS.length;
    setCurrentView(ALL_VIEWS[nextIndex]);
  };

  const navigatePrev = () => {
    const currentIndex = ALL_VIEWS.findIndex((v) => v.id === currentView.id);
    const prevIndex = (currentIndex - 1 + ALL_VIEWS.length) % ALL_VIEWS.length;
    setCurrentView(ALL_VIEWS[prevIndex]);
  };

  const personas: { id: Persona; label: string; icon: React.ReactNode; color: string; count: number }[] = [
    {
      id: 'Customer Experience',
      label: 'Consumer Hub',
      icon: <ShoppingBag className="w-4 h-4" />,
      color: 'from-emerald-700 to-teal-900',
      count: ALL_VIEWS.filter((v) => v.category === 'Customer Experience').length,
    },
    {
      id: 'Merchant Operations',
      label: 'Merchant Portal',
      icon: <Store className="w-4 h-4" />,
      color: 'from-blue-700 to-indigo-900',
      count: ALL_VIEWS.filter((v) => v.category === 'Merchant Operations').length,
    },
    {
      id: 'Wholesale & Sourcing',
      label: 'B2B Wholesale & APMC',
      icon: <Truck className="w-4 h-4" />,
      color: 'from-amber-700 to-orange-900',
      count: ALL_VIEWS.filter((v) => v.category === 'Wholesale & Sourcing').length,
    },
    {
      id: 'Super Admin',
      label: 'Super Admin Sentinel',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'from-purple-700 to-slate-900',
      count: ALL_VIEWS.filter((v) => v.category === 'Super Admin').length,
    },
  ];

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation & View Controller Bar (Collapsible with Fullscreen toggle) */}
      {!isFullscreen && (
        <header className="shrink-0 z-30 bg-[#0c1f17]/95 border-b border-emerald-900/40 backdrop-blur-md px-3 sm:px-5 py-2.5 shadow-lg">
          <div className="flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
            {/* Brand & Forensic Ledger Tag */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <span className="font-extrabold text-base tracking-tight text-white font-['Plus_Jakarta_Sans']">
                      VeriGrocery<span className="text-amber-400">.AI</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      GS1 LEDGER
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Cauvery Delta • Nagapattinam Hub
                  </p>
                </div>
              </div>

              {/* View Catalog Quick Launcher */}
              <button
                onClick={() => setShowCatalogModal(true)}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 text-xs font-semibold transition-all shadow-sm active:scale-95"
                title="Browse all 51 views (Ctrl+K)"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>All 51 Views</span>
                <span className="text-[10px] bg-emerald-900/90 text-emerald-300 px-1 rounded font-mono">⌘K</span>
              </button>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-emerald-900/50 overflow-x-auto max-w-full scrollbar-none">
              {personas.map((p) => {
                const isActive = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPersona(p.id);
                      // Switch to the first view of this persona if current view is not in it
                      const firstInCat = ALL_VIEWS.find((v) => v.category === p.id);
                      if (firstInCat && currentView.category !== p.id) {
                        setCurrentView(firstInCat);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-950 border border-emerald-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive ? 'bg-emerald-950/60 text-emerald-200' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {p.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* View Selector & Controls */}
            <div className="flex items-center gap-2 ml-auto shrink-0">
              {/* Prev / Current View / Next */}
              <div className="flex items-center bg-slate-900/90 rounded-xl border border-emerald-900/60 p-0.5 shadow-sm">
                <button
                  onClick={navigatePrev}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                  title="Previous Screen (Left Arrow or [)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Dropdown for current category */}
                <select
                  value={currentView.id}
                  onChange={(e) => {
                    const selected = ALL_VIEWS.find((v) => v.id === e.target.value);
                    if (selected) setCurrentView(selected);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-200 outline-none px-2 py-1 cursor-pointer max-w-[200px] sm:max-w-[260px] truncate"
                >
                  <optgroup label={`${selectedPersona} (${personaViews.length} views)`}>
                    {personaViews.map((v) => (
                      <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                        {v.index < 10 ? `0${v.index}` : v.index}. {v.isMobile ? '📱 ' : '🖥️ '} {v.title}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Other Views">
                    {ALL_VIEWS.filter((v) => v.category !== selectedPersona).map((v) => (
                      <option key={v.id} value={v.id} className="bg-slate-900 text-slate-300">
                        {v.index < 10 ? `0${v.index}` : v.index}. [{v.category.split(' ')[0]}] {v.title}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <button
                  onClick={navigateNext}
                  className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors"
                  title="Next Screen (Right Arrow or ])"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Viewport Frame Mode Toggle (Desktop vs Mobile Bezel) */}
              <div className="flex items-center bg-slate-900/90 rounded-xl border border-emerald-900/60 p-0.5">
                <button
                  onClick={() => setIsMobileMode(false)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    !isMobileMode
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Desktop Full Layout"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsMobileMode(true)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                    isMobileMode
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title="Mobile Device Chassis"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Reload iframe */}
              <button
                onClick={() => setIframeKey((k) => k + 1)}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-emerald-900/60 transition-colors"
                title="Reload Current View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Open raw view in new tab */}
              <a
                href={getViewPath(currentView.path)}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-emerald-900/60 transition-colors"
                title="Open Standalone HTML in New Tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>

              {/* Fullscreen view */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-emerald-900/60 transition-colors"
                title="Enter Fullscreen Mode (Press F)"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Floating Controls in Fullscreen Mode */}
      {isFullscreen && (
        <div className="fixed top-3 right-4 z-50 flex items-center gap-2 bg-slate-900/90 border border-emerald-600/40 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xl">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            #{currentView.index} {currentView.shortTitle}
          </span>
          <button
            onClick={navigatePrev}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-300"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={navigateNext}
            className="p-1 hover:bg-slate-800 rounded-full text-slate-300"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCatalogModal(true)}
            className="p-1 hover:bg-slate-800 rounded-full text-amber-400"
            title="Browse All Views"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-1 hover:bg-slate-800 rounded-full text-emerald-400 ml-1"
            title="Exit Fullscreen Mode"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area: Renders the Exact Original HTML */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center">
        {/* Loading Indicator */}
        {isLoadingIframe && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none transition-opacity">
            <div className="w-12 h-12 rounded-full border-4 border-emerald-600/20 border-t-emerald-500 animate-spin"></div>
            <p className="mt-3 text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              Loading Forensic Ledger View...
            </p>
          </div>
        )}

        {isMobileMode ? (
          /* Mobile Device Frame with Authentic Shell */
          <div className="py-3 px-2 flex flex-col items-center justify-center h-full w-full">
            <div className="relative w-[390px] h-[844px] max-h-[calc(100vh-4.5rem)] rounded-[48px] bg-slate-900 border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden ring-1 ring-slate-700/60">
              {/* Device Top Speaker / Dynamic Island Notch */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-20 flex items-center justify-between px-3 pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-500/80"></span>
              </div>

              {/* Viewport iFrame */}
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={getViewPath(currentView.path)}
                title={currentView.title}
                onLoad={handleIframeLoad}
                className="w-full h-full border-none bg-white rounded-[38px] overflow-y-auto"
                style={{ colorScheme: 'light' }}
              />

              {/* Device Bottom Home Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/60 rounded-full z-20 pointer-events-none"></div>
            </div>

            {/* Mobile View Caption & Toggle Info */}
            <div className="mt-2 text-center text-xs text-slate-400 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-400">
                iPhone 15 Chassis (390 x 844)
              </span>
              <span>•</span>
              <button
                onClick={() => setIsMobileMode(false)}
                className="text-amber-400 hover:underline font-medium"
              >
                Switch to Full Desktop Width
              </button>
            </div>
          </div>
        ) : (
          /* Desktop Responsive Frame (Full Viewport) */
          <div className="w-full h-full relative">
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={getViewPath(currentView.path)}
              title={currentView.title}
              onLoad={handleIframeLoad}
              className="w-full h-full border-none bg-white"
              style={{ colorScheme: 'light' }}
            />
          </div>
        )}
      </main>

      {/* 51-View Master Catalog Modal / Spotlight Search */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-emerald-800/80 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden ring-1 ring-emerald-500/20">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                    VeriGrocery Master Screen Directory
                  </h2>
                  <p className="text-xs text-slate-400">
                    Explore all 51 forensic grocery intelligence views across 4 platform roles
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/60">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by screen name, role (Merchant, B2B, Admin, Consumer), feature (Cart, Scanner, SKU, Fraud)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-emerald-500 text-sm text-white placeholder:text-slate-500 outline-none transition-colors"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Grid of Views */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {['Customer Experience', 'Merchant Operations', 'Wholesale & Sourcing', 'Super Admin'].map(
                (cat) => {
                  const itemsInCat = filteredViews.filter((v) => v.category === cat);
                  if (itemsInCat.length === 0) return null;

                  return (
                    <div key={cat} className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-emerald-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          {cat} ({itemsInCat.length})
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {itemsInCat.map((item) => {
                          const isSelected = item.id === currentView.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setCurrentView(item);
                                setShowCatalogModal(false);
                              }}
                              className={`flex items-start text-left gap-3 p-3 rounded-xl border transition-all text-xs group ${
                                isSelected
                                  ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                                  : 'bg-slate-950/50 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-mono font-bold text-[11px] ${
                                  isSelected
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-800 text-slate-400 group-hover:text-white'
                                }`}
                              >
                                {item.index < 10 ? `0${item.index}` : item.index}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                                    {item.title}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                  {item.isMobile ? (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 text-[10px] font-medium border border-blue-800/40">
                                      <Smartphone className="w-2.5 h-2.5" /> Mobile
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium">
                                      <Monitor className="w-2.5 h-2.5" /> Desktop
                                    </span>
                                  )}

                                  {item.tags.slice(1, 3).map((tag) => (
                                    <span
                                      key={tag}
                                      className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Modal Footer with Keyboard Shortcuts info */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">
                    ← / →
                  </kbd>{' '}
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">
                    M
                  </kbd>{' '}
                  Mobile Toggle
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono text-[10px]">
                    F
                  </kbd>{' '}
                  Fullscreen
                </span>
              </div>
              <div>
                <span>51 Total Verified Documents Preserved</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
