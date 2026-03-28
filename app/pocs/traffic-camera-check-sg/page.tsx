"use client";

import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

import { routes, type Route, type RouteCamera } from "./data";
import styles from "./page.module.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
});

// ─── API types ───────────────────────────────────────────────────────────────

type ApiCamera = {
  camera_id: string;
  image: string;
  timestamp: string;
  location: { latitude: number; longitude: number };
  image_metadata: { height: number; width: number; md5: string };
};

type ApiResponse = {
  items: Array<{
    timestamp: string;
    cameras: ApiCamera[];
  }>;
};

// ─── SWR fetcher ─────────────────────────────────────────────────────────────

async function fetchCameras(): Promise<ApiCamera[]> {
  const res = await fetch(
    "https://api.data.gov.sg/v1/transport/traffic-images",
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch traffic images");
  const json: ApiResponse = await res.json();
  return json.items?.[0]?.cameras ?? [];
}

function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return isoString;
  }
}

// ─── Camera frame ─────────────────────────────────────────────────────────────

type FrameProps = {
  routeCamera: RouteCamera;
  apiCamera: ApiCamera | undefined;
  isSelected: boolean;
  index: number;
  total: number;
  onClick: () => void;
};

function CameraFrame({
  routeCamera,
  apiCamera,
  isSelected,
  index,
  total,
  onClick,
}: FrameProps) {
  const available = !!apiCamera;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <div className={styles.frameStop}>
      {/* Route line segments */}
      <div className={styles.lineRow}>
        <div
          className={`${styles.lineSeg} ${styles.lineLeft} ${isFirst ? styles.lineInvisible : ""}`}
        />
        <motion.button
          type="button"
          className={`${styles.frameNode} ${isSelected ? styles.frameNodeSelected : ""}`}
          onClick={onClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`View camera at ${routeCamera.label}`}
          aria-pressed={isSelected}
        >
          <motion.div
            layoutId={`frame-${routeCamera.cameraId}`}
            className={`${styles.frameThumbnail} ${isSelected ? styles.frameThumbnailSelected : ""}`}
          >
            {available ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={apiCamera.image}
                alt={`Traffic camera at ${routeCamera.label}`}
                className={styles.frameImg}
              />
            ) : (
              <div className={styles.frameUnavailable}>
                <span className={styles.frameUnavailableText}>Camera unavailable right now</span>
              </div>
            )}
          </motion.div>
        </motion.button>
        <div
          className={`${styles.lineSeg} ${styles.lineRight} ${isLast ? styles.lineInvisible : ""}`}
        />
      </div>

      {/* Stop label */}
      <p className={styles.stopLabel}>{routeCamera.label}</p>
      {available && (
        <p className={styles.stopTime}>{formatTime(apiCamera.timestamp)}</p>
      )}
    </div>
  );
}

// ─── Focus view ───────────────────────────────────────────────────────────────

type FocusViewProps = {
  routeCamera: RouteCamera;
  apiCamera: ApiCamera | undefined;
  onClose: () => void;
};

function FocusView({ routeCamera, apiCamera, onClose }: FocusViewProps) {
  const available = !!apiCamera;

  return (
    <motion.div
      className={styles.focusOverlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.focusCard}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className={styles.focusHeader}>
          <div>
            <p className={styles.focusLabel}>{routeCamera.label}</p>
            {available && (
              <p className={styles.focusTime}>
                Last updated {formatTime(apiCamera.timestamp)}
              </p>
            )}
          </div>
          <button
            type="button"
            className={styles.focusClose}
            onClick={onClose}
            aria-label="Close focus view"
          >
            ✕
          </button>
        </div>

        <motion.div
          layoutId={`frame-${routeCamera.cameraId}`}
          className={styles.focusImageWrap}
        >
          {available ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={apiCamera.image}
              alt={`Traffic camera at ${routeCamera.label}`}
              className={styles.focusImg}
            />
          ) : (
            <div className={styles.focusUnavailable}>
              <span>Camera unavailable right now</span>
            </div>
          )}
        </motion.div>

        {available && (
          <div className={styles.focusMeta}>
            <span>
              {apiCamera.location.latitude.toFixed(4)}°N,{" "}
              {apiCamera.location.longitude.toFixed(4)}°E
            </span>
            <span>Camera {routeCamera.cameraId}</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TrafficCameraCheckPage() {
  const [activeRouteId, setActiveRouteId] = useState<string>(routes[0].id);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);

  const { data: apiCameras, isLoading, error, mutate } = useSWR<ApiCamera[]>(
    "traffic-images",
    fetchCameras,
    {
      refreshInterval: 3 * 60 * 1000, // 3 minutes
      revalidateOnFocus: false,
    }
  );

  const activeRoute: Route = routes.find((r) => r.id === activeRouteId) ?? routes[0];

  const cameraMap = new Map<string, ApiCamera>(
    (apiCameras ?? []).map((c) => [c.camera_id, c])
  );

  const selectedRouteCamera = selectedCameraId
    ? activeRoute.cameras.find((c) => c.cameraId === selectedCameraId) ?? null
    : null;

  function handleRouteChange(routeId: string) {
    setActiveRouteId(routeId);
    setSelectedCameraId(null);
  }

  function handleRefresh() {
    mutate();
  }

  return (
    <main className={`${styles.page} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <div className={styles.shell}>

        {/* Header */}
        <header className={styles.topbar}>
          <Link href="/" className={styles.backLink}>← Back to gallery</Link>
          <span className={styles.topbarBadge}>LTA Traffic Cameras</span>
          <button
            type="button"
            className={styles.refreshBtn}
            onClick={handleRefresh}
            aria-label="Refresh camera images"
          >
            {isLoading ? "Updating…" : "Refresh cameras"}
          </button>
        </header>

        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Check the road before you head out.</h1>
          <p className={styles.heroSub}>
            Pick your route and scan each camera along the way — so you leave knowing what&apos;s ahead.
          </p>
        </section>

        {/* Route tabs */}
        <nav className={styles.routeTabs} aria-label="Select route">
          {routes.map((route) => (
            <button
              key={route.id}
              type="button"
              className={`${styles.routeTab} ${route.id === activeRouteId ? styles.routeTabActive : ""}`}
              onClick={() => handleRouteChange(route.id)}
            >
              {route.name}
            </button>
          ))}
        </nav>

        {/* Route subtitle */}
        <p className={styles.routeSubtitle}>
          {activeRoute.from} to {activeRoute.to}
        </p>

        {/* API error state */}
        {error && (
          <div className={styles.errorBanner}>
            Could not load camera images. Check your connection and try refreshing.
          </div>
        )}

        {/* Storyboard strip */}
        <section className={styles.stripSection} aria-label="Route camera storyboard">
          <div className={styles.stripScroll}>
            <div className={styles.strip}>
              {activeRoute.cameras.map((routeCamera, index) => (
                <CameraFrame
                  key={routeCamera.cameraId}
                  routeCamera={routeCamera}
                  apiCamera={cameraMap.get(routeCamera.cameraId)}
                  isSelected={selectedCameraId === routeCamera.cameraId}
                  index={index}
                  total={activeRoute.cameras.length}
                  onClick={() =>
                    setSelectedCameraId(
                      selectedCameraId === routeCamera.cameraId
                        ? null
                        : routeCamera.cameraId
                    )
                  }
                />
              ))}
            </div>
          </div>

          {/* Loading skeleton overlay */}
          {isLoading && !apiCameras && (
            <div className={styles.loadingRow}>
              {activeRoute.cameras.map((c) => (
                <div key={c.cameraId} className={styles.skeleton} />
              ))}
            </div>
          )}
        </section>

        {/* Hint */}
        <p className={styles.tapHint}>Tap a camera to enlarge</p>
      </div>

      {/* Focus view */}
      <AnimatePresence>
        {selectedRouteCamera && (
          <FocusView
            key={selectedRouteCamera.cameraId}
            routeCamera={selectedRouteCamera}
            apiCamera={cameraMap.get(selectedRouteCamera.cameraId)}
            onClose={() => setSelectedCameraId(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
