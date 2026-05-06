export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#03060f] to-[#05122e] py-32">
      <div className="bg-grid absolute inset-0 opacity-50" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-yellow/60 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-1.5 text-xs uppercase tracking-[0.4em] text-brand-yellow">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-yellow" />
          venda oficial · ingressos limitados
        </span>

        <h1 className="font-display mt-8 text-[clamp(4rem,12vw,12rem)] leading-[0.85] uppercase">
          <span className="block text-white">A copa</span>
          <span className="block">
            <span className="shine-text">do mundo</span>
          </span>
          <span className="block text-white/90">vai começar.</span>
        </h1>

        <p className="mt-10 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
          11 de junho de 2026. Três países. 48 seleções. Uma só obsessão:{" "}
          <strong className="text-brand-yellow">o hexa</strong>. Depois de 24
          anos esperando, o Brasil volta ao maior palco do futebol — e dessa
          vez você não vai assistir pela TV. Vai estar no estádio, vai sentir
          o gramado tremer, vai gritar gol junto com 80 mil pessoas. Garanta
          seu ingresso antes que o mundo inteiro chegue na frente.
        </p>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <a
            href="#arquibancada"
            className="group inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 text-base font-semibold text-black transition hover:bg-yellow-300"
          >
            Escolher meu lugar
            <svg
              className="transition group-hover:translate-x-1"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#ingressos"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base text-white/90 transition hover:border-white/40 hover:bg-white/5"
          >
            Ver tipos de ingresso
          </a>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 md:grid-cols-4">
          {[
            ["48", "seleções"],
            ["104", "partidas"],
            ["16", "cidades-sede"],
            ["3,5M", "ingressos"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-display text-5xl text-brand-yellow">{n}</dt>
              <dd className="mt-1 text-sm uppercase tracking-widest text-white/60">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
