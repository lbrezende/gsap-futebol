"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollVideoHeader() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [v1Ready, setV1Ready] = useState(false);
  const [v2Ready, setV2Ready] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    const overlay = overlayRef.current;
    if (!section || !v1 || !v2 || !overlay) return;
    if (!v1Ready || !v2Ready) return;

    const d1 = v1.duration || 1;
    const d2 = v2.duration || 1;

    // Total scroll distance — scaled by total video duration so we have ~600px
    // of scroll per second of video. Smooth scrub feel.
    const totalScroll = Math.round((d1 + d2) * 600 + 800);

    // Phase split: video1 plays for d1/(d1+d2) of the timeline, then a brief
    // overlay reveal, then video2 plays for d2/(d1+d2). The overlay window is
    // a small fraction of total time.
    const overlayShare = 0.12;
    const movingShare = 1 - overlayShare;
    const p1 = (d1 / (d1 + d2)) * movingShare;
    const p2 = movingShare - p1;

    // Initial state
    gsap.set(v2, { autoAlpha: 0 });
    gsap.set(v1, { autoAlpha: 1 });
    gsap.set(overlay, { autoAlpha: 0 });
    v1.currentTime = 0;
    v2.currentTime = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // PHASE 1 — video1 plays 0 -> end (linear)
      tl.to(v1, {
        currentTime: Math.max(0.01, d1 - 0.05),
        ease: "none",
        duration: p1,
      }, 0);

      // PHASE 2 — overlay BRASIL HEXA fades in over the LAST FRAME of video1
      // (video1 stays visible, frozen at last frame)
      const overlayStart = p1;
      const overlayDur = overlayShare;

      tl.fromTo(
        overlay,
        { autoAlpha: 0, scale: 0.7, filter: "blur(20px)" },
        { autoAlpha: 1, scale: 1, filter: "blur(0px)", ease: "power3.out", duration: overlayDur * 0.45 },
        overlayStart
      );
      // Hold visible at full opacity
      tl.to(overlay, { autoAlpha: 1, duration: overlayDur * 0.20 }, overlayStart + overlayDur * 0.45);
      // Fade out + zoom (transitioning to video2)
      tl.to(
        overlay,
        { autoAlpha: 0, scale: 1.15, filter: "blur(8px)", ease: "power2.in", duration: overlayDur * 0.35 },
        overlayStart + overlayDur * 0.65
      );

      // Crossfade: video1 -> video2 happens during overlay tail
      const crossStart = overlayStart + overlayDur * 0.55;
      tl.to(v1, { autoAlpha: 0, ease: "power1.inOut", duration: overlayDur * 0.45 }, crossStart);
      tl.to(v2, { autoAlpha: 1, ease: "power1.inOut", duration: overlayDur * 0.45 }, crossStart);

      // PHASE 3 — video2 plays 0 -> end
      tl.to(v2, {
        currentTime: Math.max(0.01, d2 - 0.05),
        ease: "none",
        duration: p2,
      }, p1 + overlayShare);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, [v1Ready, v2Ready]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <video
        ref={v1Ref}
        src="/jogador1.mp4"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={() => setV1Ready(true)}
        onLoadedData={() => setV1Ready(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={v2Ref}
        src="/jogador2.mp4"
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={() => setV2Ready(true)}
        onLoadedData={() => setV2Ready(true)}
        style={{ opacity: 0 }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* "BRASIL HEXA" overlay (over last frame of video 1) */}
      <div
        ref={overlayRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
      >
        <div className="text-center">
          <p className="font-display text-[10vw] leading-[0.9] text-white drop-shadow-[0_0_60px_rgba(250,204,21,0.6)]">
            <span className="shine-text">BRASIL</span>
          </p>
          <p className="mt-2 font-display text-[15vw] leading-[0.85] tracking-tight text-brand-yellow drop-shadow-[0_0_80px_rgba(22,163,74,0.7)]">
            HEXA
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.5em] text-white/80">
            o sexto está chegando
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

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2 text-center text-xs uppercase tracking-[0.5em] text-white/60">
        role para chutar ↓
      </div>
    </section>
  );
}
