"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type VideoState = {
  el: HTMLVideoElement | null;
  duration: number;
  ready: boolean;
};

export default function ScrollVideoHeader() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const v1Ref = useRef<HTMLVideoElement>(null);
  const v2Ref = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [v1Loaded, setV1Loaded] = useState(false);
  const [v2Loaded, setV2Loaded] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    const overlay = overlayRef.current;
    if (!section || !v1 || !v2 || !overlay) return;

    const video1: VideoState = { el: v1, duration: 0, ready: false };
    const video2: VideoState = { el: v2, duration: 0, ready: false };

    const onMeta1 = () => {
      video1.duration = v1.duration || 0;
      video1.ready = true;
      setV1Loaded(true);
    };
    const onMeta2 = () => {
      video2.duration = v2.duration || 0;
      video2.ready = true;
      setV2Loaded(true);
    };

    if (v1.readyState >= 1) onMeta1();
    else v1.addEventListener("loadedmetadata", onMeta1);

    if (v2.readyState >= 1) onMeta2();
    else v2.addEventListener("loadedmetadata", onMeta2);

    // Timeline pinned that drives:
    //  0.00 -> 0.45 : video1 plays 0 -> end (currentTime mapped to scrub)
    //  0.45 -> 0.55 : "Brasil Exa" overlay reveal + crossfade
    //  0.55 -> 1.00 : video2 plays 0 -> end
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=4000",
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1 — video1 progress
      tl.to(v1, {
        currentTime: () => Math.max(0.001, (video1.duration || 1) - 0.05),
        ease: "none",
        duration: 0.45,
      }, 0);

      // Phase 1.5 — fade out v1, fade in overlay
      tl.to(v1, { autoAlpha: 0, ease: "power1.inOut", duration: 0.05 }, 0.45);
      tl.fromTo(
        overlay,
        { autoAlpha: 0, scale: 0.85, letterSpacing: "0.4em" },
        { autoAlpha: 1, scale: 1, letterSpacing: "0.05em", ease: "power3.out", duration: 0.08 },
        0.46
      );
      tl.to(overlay, { autoAlpha: 0, scale: 1.4, ease: "power2.in", duration: 0.05 }, 0.55);

      // Phase 2 — fade in v2 + scrub
      tl.to(v2, { autoAlpha: 1, ease: "power1.out", duration: 0.05 }, 0.55);
      tl.to(v2, {
        currentTime: () => Math.max(0.001, (video2.duration || 1) - 0.05),
        ease: "none",
        duration: 0.45,
      }, 0.55);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      v1.removeEventListener("loadedmetadata", onMeta1);
      v2.removeEventListener("loadedmetadata", onMeta2);
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, [v1Loaded, v2Loaded]);

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
        className="absolute inset-0 h-full w-full object-cover"
      />
      <video
        ref={v2Ref}
        src="/jogador2.mp4"
        muted
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

      {/* "Brasil Exa" overlay */}
      <div
        ref={overlayRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      >
        <div className="text-center">
          <p className="font-display text-[10vw] leading-[0.9] text-white drop-shadow-[0_0_60px_rgba(250,204,21,0.6)]">
            <span className="shine-text">BRASIL</span>
          </p>
          <p className="mt-2 font-display text-[14vw] leading-[0.85] tracking-tight text-brand-yellow drop-shadow-[0_0_80px_rgba(22,163,74,0.7)]">
            EXA
          </p>
          <p className="mt-6 text-sm uppercase tracking-[0.5em] text-white/70">
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
