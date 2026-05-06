"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const V1_FRAMES = 42;
const V2_FRAMES = 42;
const TOTAL_FRAMES = V1_FRAMES + V2_FRAMES;

const NATIVE_W = 1024;
const NATIVE_H = 681;

function urlFor(group: "v1" | "v2", n: number) {
  return `/frames/${group}/f${String(n).padStart(3, "0")}.jpg`;
}

export default function ScrollVideoHeader() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ frame: 0, overlay: 0 });
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload all frames into Image objects
  useEffect(() => {
    let cancelled = false;
    const all: HTMLImageElement[] = [];
    let loaded = 0;

    function makeOne(src: string) {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
        img.onload = () => {
          loaded += 1;
          setProgress(loaded / TOTAL_FRAMES);
          resolve(img);
        };
        img.onerror = () => {
          loaded += 1;
          setProgress(loaded / TOTAL_FRAMES);
          resolve(img);
        };
      });
    }

    (async () => {
      // Prioritize first frames so we can paint immediately
      const urls: string[] = [];
      for (let i = 1; i <= V1_FRAMES; i++) urls.push(urlFor("v1", i));
      for (let i = 1; i <= V2_FRAMES; i++) urls.push(urlFor("v2", i));

      // Load first 8 sequentially, rest in parallel
      for (let i = 0; i < Math.min(8, urls.length); i++) {
        if (cancelled) return;
        const img = await makeOne(urls[i]);
        all[i] = img;
        if (i === 0) {
          // First frame ready — draw immediately
          imagesRef.current = all;
          drawFrame(0);
        }
      }
      // Rest in parallel
      const rest = urls.slice(8).map((u, idx) =>
        makeOne(u).then((img) => {
          all[idx + 8] = img;
        })
      );
      await Promise.all(rest);
      if (cancelled) return;
      imagesRef.current = all;
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Canvas drawing — object-cover behavior
  function drawFrame(idx: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const imgs = imagesRef.current;
    const img = imgs[Math.max(0, Math.min(imgs.length - 1, idx))];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Match canvas to viewport size with DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cw, ch);

    // object-cover: fit canvas, crop image
    const iw = img.naturalWidth || NATIVE_W;
    const ih = img.naturalHeight || NATIVE_H;
    const cs = cw / ch;
    const is = iw / ih;
    let sx = 0, sy = 0, sw = iw, sh = ih;
    if (is > cs) {
      sw = ih * cs;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / cs;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    ctx.restore();
  }

  // Set up ScrollTrigger
  useEffect(() => {
    const section = sectionRef.current;
    const overlay = overlayRef.current;
    if (!section || !overlay) return;
    if (!ready) return;

    // 0% -> p1End : video1 (frames 0..N-1)
    // p1End -> p2Start : overlay BRASIL É HEXA over LAST frame of video1 (frozen)
    // p2Start -> 100% : video2 (frames 0..N-1)
    // Bigger hold window for the text so it has time to breathe
    const p1End = 0.40;
    const p2Start = 0.60;

    const totalScroll = 4200;

    const ctx = gsap.context(() => {
      gsap.set(overlay, { autoAlpha: 0 });

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScroll}`,
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          let frame = 0;
          let overlayAlpha = 0;
          let overlayScale = 0.7;
          let overlayBlur = 20;

          if (p <= p1End) {
            // Phase 1 — video1
            const t = p / p1End;
            frame = Math.min(V1_FRAMES - 1, Math.floor(t * V1_FRAMES));
          } else if (p < p2Start) {
            // Phase 2 — last frame of video1, overlay reveals
            frame = V1_FRAMES - 1;
            const t = (p - p1End) / (p2Start - p1End);
            // 0 -> 0.5 : reveal, 0.5 -> 1 : hold (will fade out next phase via crossfade)
            const reveal = Math.min(1, t * 2);
            overlayAlpha = reveal;
            overlayScale = 0.7 + 0.3 * reveal;
            overlayBlur = 20 - 20 * reveal;
          } else {
            // Phase 3 — video2 (overlay fades out at start)
            const t = (p - p2Start) / (1 - p2Start);
            // First 20% of phase 3 still has overlay fading out
            if (t < 0.2) {
              const fade = 1 - t / 0.2;
              overlayAlpha = fade;
              overlayScale = 1 + (1 - fade) * 0.15;
              overlayBlur = (1 - fade) * 8;
              frame = V1_FRAMES - 1;
            } else {
              const t2 = (t - 0.2) / 0.8;
              frame = V1_FRAMES + Math.min(V2_FRAMES - 1, Math.floor(t2 * V2_FRAMES));
            }
          }

          if (frame !== stateRef.current.frame) {
            stateRef.current.frame = frame;
            drawFrame(frame);
          }

          // Apply overlay style directly (cheap)
          overlay.style.opacity = String(overlayAlpha);
          overlay.style.transform = `scale(${overlayScale})`;
          overlay.style.filter = `blur(${overlayBlur}px)`;
        },
      });
    }, section);

    const onResize = () => {
      drawFrame(stateRef.current.frame);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    // Initial paint
    drawFrame(0);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [ready]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: "block" }}
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* "BRASIL É HEXA" overlay */}
      <div
        ref={overlayRef}
        style={{ opacity: 0, transform: "scale(0.7)", filter: "blur(20px)" }}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/65 backdrop-blur-[3px]"
      >
        <div className="text-center">
          <p className="font-display text-[11vw] leading-[0.9] text-white drop-shadow-[0_0_60px_rgba(250,204,21,0.6)]">
            <span className="shine-text">BRASIL</span>
          </p>
          <p className="font-display text-[6vw] leading-[1] text-white/90 drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]">
            É
          </p>
          <p className="font-display text-[16vw] leading-[0.85] tracking-tight text-brand-yellow drop-shadow-[0_0_80px_rgba(22,163,74,0.7)]">
            HEXA
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.5em] text-white/80">
            o sexto título tá chegando
          </p>
        </div>
      </div>

      {/* Top nav */}
      <div className="absolute top-0 z-30 flex w-full items-center justify-between px-8 py-6">
        <div className="font-display text-xl tracking-widest text-white">
          FIFA <span className="text-brand-yellow">2026</span>
        </div>
        <nav className="hidden gap-8 text-sm uppercase tracking-widest text-white/80 md:flex">
          <a href="#ingressos" className="hover:text-brand-yellow">Ingressos</a>
          <a href="#arquibancada" className="hover:text-brand-yellow">Setores</a>
          <a href="#faq" className="hover:text-brand-yellow">FAQ</a>
        </nav>
        <a
          href="#ingressos"
          className="rounded-full bg-brand-yellow px-5 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
        >
          Comprar
        </a>
      </div>

      {/* Loading bar (only while frames preloading) */}
      {!ready && (
        <div className="absolute bottom-12 left-1/2 z-30 -translate-x-1/2 text-center">
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-brand-yellow transition-[width]"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-white/50">
            preparando o chute…
          </p>
        </div>
      )}

      {/* Scroll hint */}
      {ready && (
        <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center text-xs uppercase tracking-[0.5em] text-white/60">
          role para chutar ↓
        </div>
      )}
    </section>
  );
}
