"use client";

import { useState } from "react";
import { formatBRL } from "@/lib/format";
import CheckoutDrawer from "./CheckoutDrawer";

export type Sector = {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceCents: number;
  available: number;
  description: string | null;
  color: string;
};

export default function StadiumMap({ sectors }: { sectors: Sector[] }) {
  const [hovered, setHovered] = useState<Sector | null>(null);
  const [selected, setSelected] = useState<Sector | null>(null);

  const bySlug = (s: string) => sectors.find((x) => x.slug === s);

  // Map slug -> SVG path/area (zones around the field)
  const zones: { sector: Sector | undefined; d: string }[] = [
    {
      sector: bySlug("premium-central"),
      d: "M 200 110 L 600 110 L 580 160 L 220 160 Z",
    },
    {
      sector: bySlug("vip-lateral"),
      d: "M 200 540 L 600 540 L 620 590 L 180 590 Z",
    },
    {
      sector: bySlug("arquibancada-norte"),
      d: "M 110 200 L 160 220 L 160 480 L 110 500 Z",
    },
    {
      sector: bySlug("arquibancada-sul"),
      d: "M 690 200 L 640 220 L 640 480 L 690 500 Z",
    },
    {
      sector: bySlug("arquibancada-leste"),
      d: "M 200 60 L 600 60 L 600 110 L 200 110 Z",
    },
    {
      sector: bySlug("arquibancada-oeste"),
      d: "M 200 590 L 600 590 L 600 640 L 200 640 Z",
    },
    {
      sector: bySlug("popular"),
      d: "M 60 60 L 110 60 L 110 640 L 60 640 Z M 690 60 L 740 60 L 740 640 L 690 640 Z",
    },
  ];

  return (
    <section
      id="arquibancada"
      className="relative bg-[#05122e] py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-yellow">
            mapa interativo
          </p>
          <h2 className="font-display mt-4 text-5xl uppercase md:text-7xl">
            Escolha sua <span className="shine-text">posição</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Clique em qualquer setor da arquibancada para ver disponibilidade,
            preço e finalizar a compra. Mais perto do gramado, mais perto da
            história.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a1f4a] to-[#03060f] p-6">
            <svg
              viewBox="0 0 800 700"
              className="h-auto w-full"
              role="img"
              aria-label="Mapa do estádio"
            >
              {/* Field */}
              <rect
                x="200"
                y="170"
                width="400"
                height="360"
                rx="8"
                fill="#16a34a"
                opacity="0.85"
              />
              <rect
                x="200"
                y="170"
                width="400"
                height="360"
                rx="8"
                fill="url(#stripes)"
                opacity="0.25"
              />
              <circle
                cx="400"
                cy="350"
                r="55"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.7"
              />
              <line
                x1="400"
                y1="170"
                x2="400"
                y2="530"
                stroke="white"
                strokeWidth="2"
                opacity="0.7"
              />
              <rect
                x="200"
                y="270"
                width="60"
                height="160"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.7"
              />
              <rect
                x="540"
                y="270"
                width="60"
                height="160"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.7"
              />

              <defs>
                <pattern
                  id="stripes"
                  patternUnits="userSpaceOnUse"
                  width="40"
                  height="40"
                >
                  <rect width="40" height="40" fill="#16a34a" />
                  <rect x="20" width="20" height="40" fill="#15803d" />
                </pattern>
              </defs>

              {/* Sectors */}
              {zones.map((z) => {
                if (!z.sector) return null;
                const isSelected = selected?.id === z.sector.id;
                const isHovered = hovered?.id === z.sector.id;
                return (
                  <path
                    key={z.sector.id}
                    d={z.d}
                    fill={z.sector.color}
                    fillOpacity={isSelected ? 1 : isHovered ? 0.85 : 0.55}
                    stroke={isSelected ? "white" : "rgba(255,255,255,0.4)"}
                    strokeWidth={isSelected ? 3 : 1.5}
                    style={{ cursor: "pointer", transition: "all 200ms" }}
                    onMouseEnter={() => setHovered(z.sector ?? null)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(z.sector ?? null)}
                  />
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/70">
              {sectors.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded"
                    style={{ background: s.color }}
                  />
                  <span>{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar — info/cta */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            {(hovered || selected) ? (
              <SectorInfo
                sector={(selected ?? hovered)!}
                isSelected={!!selected}
                onBuy={() => selected && setSelected(selected)}
                onClear={() => setSelected(null)}
              />
            ) : (
              <div className="text-sm text-white/60">
                <p className="font-display text-2xl uppercase text-white">
                  Passe o mouse
                </p>
                <p className="mt-2">
                  ou clique em um setor do mapa para ver preço, disponibilidade
                  e descrição.
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>

      <CheckoutDrawer
        sector={selected}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}

function SectorInfo({
  sector,
  isSelected,
  onBuy,
  onClear,
}: {
  sector: Sector;
  isSelected: boolean;
  onBuy: () => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div
        className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-widest"
        style={{ background: sector.color + "33", color: sector.color }}
      >
        {sector.category}
      </div>
      <h3 className="font-display mt-3 text-3xl uppercase">{sector.name}</h3>
      <p className="mt-2 text-sm text-white/70">{sector.description}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="font-display text-5xl text-brand-yellow">
          {formatBRL(sector.priceCents)}
        </span>
        <span className="text-sm text-white/50">/ ingresso</span>
      </div>

      <div className="mt-2 text-xs text-white/50">
        {sector.available} ingressos disponíveis
      </div>

      <button
        onClick={onBuy}
        className="mt-6 w-full rounded-full bg-brand-yellow py-3 text-sm font-semibold text-black transition hover:bg-yellow-300"
      >
        {isSelected ? "Continuar para checkout →" : "Selecionar este setor"}
      </button>

      {isSelected && (
        <button
          onClick={onClear}
          className="mt-2 w-full text-xs text-white/50 hover:text-white/80"
        >
          Cancelar seleção
        </button>
      )}
    </div>
  );
}
