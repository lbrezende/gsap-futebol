export default function Footer() {
  return (
    <footer
      id="faq"
      className="border-t border-white/10 bg-black py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="font-display text-2xl tracking-widest">
              FIFA <span className="text-brand-yellow">2026</span>
            </div>
            <p className="mt-3 text-sm text-white/60">
              Plataforma oficial de venda de ingressos para a Copa do Mundo de
              2026. Brasil, Estados Unidos, México e Canadá.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40">
              Suporte
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-brand-yellow">Política de reembolso</a></li>
              <li><a href="#" className="hover:text-brand-yellow">Termos de uso</a></li>
              <li><a href="#" className="hover:text-brand-yellow">Privacidade</a></li>
              <li><a href="#" className="hover:text-brand-yellow">Falar com a gente</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-white/40">
              Acessibilidade
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>Audiodescrição em todos os jogos</li>
              <li>Setores PCD em cada arquibancada</li>
              <li>Atendimento em LIBRAS</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
          © 2026 FIFA. Tudo bem cuidado pra você gritar gol.
        </div>
      </div>
    </footer>
  );
}
