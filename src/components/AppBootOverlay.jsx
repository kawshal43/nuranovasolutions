import { useEffect, useState } from "react";
import { siteMediaManifest } from "../data/siteMedia";
import "./AppBootOverlay.css";

const MIN_BOOT_MS = 900;
const EXIT_DELAY_MS = 380;
const ASSET_TIMEOUT_MS = 2200;

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function detectAssetType(url) {
  const clean = url.split("?")[0].toLowerCase();

  if (clean.endsWith(".mp4") || clean.endsWith(".webm") || clean.endsWith(".mov")) {
    return "video";
  }

  if (clean.endsWith(".glb") || clean.endsWith(".gltf")) {
    return "model";
  }

  return "image";
}

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    const finish = () => resolve();

    img.onload = finish;
    img.onerror = finish;
    img.src = url;

    if (img.complete) finish();
  });
}

function preloadVideo(url) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const finish = () => resolve();

    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = finish;
    video.onerror = finish;
    video.src = url;
    video.load();

    window.setTimeout(finish, ASSET_TIMEOUT_MS);
  });
}

function preloadBinary(url) {
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const controller = "AbortController" in window ? new AbortController() : null;
    const timeoutId = window.setTimeout(() => {
      controller?.abort();
      done();
    }, ASSET_TIMEOUT_MS);

    fetch(url, {
      credentials: "same-origin",
      cache: "force-cache",
      signal: controller?.signal,
    })
      .catch(() => null)
      .finally(() => {
        window.clearTimeout(timeoutId);
        done();
      });
  });
}

async function warmAsset(url) {
  const type = detectAssetType(url);

  if (type === "image") {
    await preloadImage(url);
    return;
  }

  if (type === "video") {
    await preloadVideo(url);
    return;
  }

  await preloadBinary(url);
}

async function warmMedia(urls, onProgress) {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  if (!uniqueUrls.length) {
    onProgress(1);
    return;
  }

  let completed = 0;

  await Promise.allSettled(
    uniqueUrls.map(async (url) => {
      await warmAsset(url);
      completed += 1;
      onProgress(completed / uniqueUrls.length);
    })
  );
}

export default function AppBootOverlay({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      await Promise.allSettled([
        warmMedia(siteMediaManifest, (value) => {
          if (!cancelled) {
            setProgress(value);
          }
        }),
        wait(MIN_BOOT_MS),
      ]);

      if (cancelled) return;

      setProgress(1);
      setIsLeaving(true);
      window.setTimeout(() => {
        if (!cancelled) {
          onComplete();
        }
      }, EXIT_DELAY_MS);
    };

    start();

    return () => {
      cancelled = true;
    };
  }, [onComplete]);

  const visibleProgress = Math.max(progress, 0.14);
  const status = progress > 0.96 ? "Almost ready" : "Loading";

  return (
    <div className={`app-boot-overlay ${isLeaving ? "is-leaving" : ""}`}>
      <div className="app-boot-aurora" aria-hidden="true" />

      <div className="app-boot-shell" aria-live="polite">
        <div className="app-boot-logo-stage" aria-hidden="true">
          <span className="app-boot-logo-glow" />
          <span className="app-boot-logo-shine" />
          <img className="app-boot-logo" src="/Logo.PNG" alt="" />
        </div>

        <div className="app-boot-copy">
          <span className="app-boot-title">NuraNova Solutions</span>
          <p>{status}</p>
        </div>

        <div className="app-boot-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${visibleProgress})` }} />
        </div>
      </div>
    </div>
  );
}
