import { formatBRL } from "@/lib/format";
import type { Sector } from "./StadiumMap";

export default function TicketTypes({ sectors }: { sectors: Sector[] }) {
  // Group by category
  const byCategory = sectors.reduce<Record<string, Sector[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <section
      id="ingressos"
      className="bg-gradient-to-b from-[#05122e] to-[#03060f] py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.4em] text-brand-yellow">
            tipos de ingresso
          </p>
          <h2 className="font-display mt-4 text-5xl uppercase md:text-7xl">
            4 categorias.<br />
            <span className="shine-text">Uma decisão.</span>
          </h2>
        </div>

        <div className="space-y-4">
          {Object.entries(byCategory).map(([cat, list]) => {
            const minPrice = Math.min(...list.map((s) => s.priceCents));
            return (
              <details
                key={cat}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition open:bg-white/[0.06]"
              >
                <summary className="flex cursor-pointer items-center justify-between list-none">
                  <div className="flex items-center gap-4">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ background: list[0].color }}
                    />
                    <span className="font-display text-2xl uppercase">{cat}</span>
                    <span className="text-xs text-white/50">
                      {list.length} {list.length === 1 ? "setor" : "setores"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-white/60">a partir de</span>
                    <span className="font-display text-2xl text-brand-yellow">
                      {formatBRL(minPrice)}
                    </span>
                    <span className="text-white/40 transition group-open:rotate-180">▾</span>
                  </div>
                </summary>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {list.map((s) => (
                    <a
                      key={s.id}
                      href="#arquibancada"
                      className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-brand-yellow/40 hover:bg-white/10"
                    >
                      <span
                        className="mt-1 inline-block h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{s.name}</h3>
                          <span className="font-display text-lg text-brand-yellow">
                            {formatBRL(s.priceCents)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white/60">
                          {s.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </details>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#arquibancada"
            className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 text-base font-semibold text-black transition hover:bg-yellow-300"
          >
            Selecionar no mapa →
          </a>
        </div>
      </div>
    </section>
  );
}
