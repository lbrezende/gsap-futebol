"use client";

import { useEffect, useState } from "react";
import { formatBRL } from "@/lib/format";
import type { Sector } from "./StadiumMap";

type Step = "review" | "buyer" | "card" | "done";

export default function CheckoutDrawer({
  sector,
  onClose,
}: {
  sector: Sector | null;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("review");
  const [quantity, setQuantity] = useState(1);
  const [buyer, setBuyer] = useState({ name: "", email: "", cpf: "" });
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (sector) {
      setOpen(true);
      setStep("review");
      setQuantity(1);
    } else {
      setOpen(false);
    }
  }, [sector]);

  if (!sector) return null;

  const total = sector.priceCents * quantity;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sectorId: sector!.id,
          quantity,
          buyer,
          cardLast4: card.number.replace(/\s/g, "").slice(-4),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setOrderId(data.orderId);
        setStep("done");
      } else {
        alert(data.error ?? "Falha ao processar.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto bg-[#03060f] p-8 shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-white/60 hover:text-white"
          aria-label="Fechar"
        >
          ✕
        </button>

        {step === "review" && (
          <>
            <p className="text-xs uppercase tracking-[0.4em] text-brand-yellow">
              Revisar pedido
            </p>
            <h3 className="font-display mt-2 text-4xl uppercase">
              {sector.name}
            </h3>
            <p className="mt-2 text-sm text-white/70">{sector.description}</p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Quantidade</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-8 w-8 rounded-full bg-white/10 text-lg leading-none hover:bg-white/20"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(8, q + 1))
                    }
                    className="h-8 w-8 rounded-full bg-white/10 text-lg leading-none hover:bg-white/20"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-sm text-white/70">Preço unitário</span>
                <span>{formatBRL(sector.priceCents)}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-sm text-white/70">Total</span>
                <span className="font-display text-3xl text-brand-yellow">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setStep("buyer")}
              className="mt-6 w-full rounded-full bg-brand-yellow py-4 text-sm font-semibold text-black transition hover:bg-yellow-300"
            >
              Continuar →
            </button>
            <p className="mt-3 text-center text-xs text-white/50">
              Os dados de pagamento são pedidos só no próximo passo.
            </p>
          </>
        )}

        {step === "buyer" && (
          <>
            <button
              onClick={() => setStep("review")}
              className="text-xs text-white/60 hover:text-white"
            >
              ← Voltar
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-brand-yellow">
              Dados pessoais
            </p>
            <h3 className="font-display mt-2 text-4xl uppercase">
              Quem vai ao estádio?
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep("card");
              }}
              className="mt-6 space-y-4"
            >
              <Field
                label="Nome completo"
                value={buyer.name}
                onChange={(v) => setBuyer({ ...buyer, name: v })}
                placeholder="Como aparece no documento"
                required
              />
              <Field
                label="E-mail"
                type="email"
                value={buyer.email}
                onChange={(v) => setBuyer({ ...buyer, email: v })}
                placeholder="seu@email.com"
                required
              />
              <Field
                label="CPF"
                value={buyer.cpf}
                onChange={(v) => setBuyer({ ...buyer, cpf: v })}
                placeholder="000.000.000-00"
                required
              />

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-brand-yellow py-4 text-sm font-semibold text-black transition hover:bg-yellow-300"
              >
                Continuar para pagamento →
              </button>
            </form>
          </>
        )}

        {step === "card" && (
          <>
            <button
              onClick={() => setStep("buyer")}
              className="text-xs text-white/60 hover:text-white"
            >
              ← Voltar
            </button>
            <p className="mt-4 text-xs uppercase tracking-[0.4em] text-brand-yellow">
              Pagamento
            </p>
            <h3 className="font-display mt-2 text-4xl uppercase">
              Cartão de crédito
            </h3>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-white/70">{quantity}× {sector.name}</span>
                <span className="font-display text-2xl text-brand-yellow">
                  {formatBRL(total)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePay} className="mt-6 space-y-4">
              <Field
                label="Número do cartão"
                value={card.number}
                onChange={(v) => setCard({ ...card, number: formatCardNumber(v) })}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                maxLength={19}
                required
              />
              <Field
                label="Nome impresso no cartão"
                value={card.name}
                onChange={(v) => setCard({ ...card, name: v.toUpperCase() })}
                placeholder="JOAO M SILVA"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Validade"
                  value={card.exp}
                  onChange={(v) => setCard({ ...card, exp: formatExp(v) })}
                  placeholder="MM/AA"
                  inputMode="numeric"
                  maxLength={5}
                  required
                />
                <Field
                  label="CVV"
                  value={card.cvv}
                  onChange={(v) => setCard({ ...card, cvv: v.replace(/\D/g, "") })}
                  placeholder="123"
                  inputMode="numeric"
                  maxLength={4}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 w-full rounded-full bg-brand-yellow py-4 text-sm font-semibold text-black transition hover:bg-yellow-300 disabled:opacity-50"
              >
                {submitting ? "Processando..." : `Pagar ${formatBRL(total)}`}
              </button>
              <p className="text-center text-xs text-white/50">
                🔒 Compra protegida. Dados criptografados.
              </p>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="font-display text-7xl">🎉</div>
            <h3 className="font-display mt-4 text-4xl uppercase text-brand-yellow">
              É hexa!
            </h3>
            <p className="mt-3 max-w-sm text-sm text-white/70">
              Seu ingresso para <strong>{sector.name}</strong> foi confirmado.
              Enviamos o e-ticket para <strong>{buyer.email}</strong>.
            </p>
            <p className="mt-6 text-xs text-white/40">Pedido #{orderId?.slice(-8)}</p>
            <button
              onClick={onClose}
              className="mt-8 rounded-full border border-white/20 px-6 py-3 text-sm hover:bg-white/5"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-widest text-white/60">
        {label}
      </span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-yellow focus:outline-none"
      />
    </label>
  );
}

function formatCardNumber(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExp(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + "/" + digits.slice(2);
}
