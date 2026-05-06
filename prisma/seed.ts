import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sectors = [
  {
    slug: "premium-central",
    name: "Premium Central",
    category: "Categoria 1",
    priceCents: 489000,
    available: 120,
    color: "#facc15",
    description:
      "Vista frontal para o gramado, atrás dos bancos de reservas. Acesso ao lounge VIP com open-bar e buffet completo.",
  },
  {
    slug: "vip-lateral",
    name: "VIP Lateral",
    category: "Categoria 1",
    priceCents: 329000,
    available: 240,
    color: "#fb923c",
    description:
      "Setor coberto, ângulo lateral privilegiado entre meio-de-campo e área. Inclui acesso ao lounge VIP.",
  },
  {
    slug: "arquibancada-norte",
    name: "Arquibancada Norte",
    category: "Categoria 2",
    priceCents: 189000,
    available: 540,
    color: "#22d3ee",
    description:
      "Atrás do gol, energia da torcida brasileira. Vista panorâmica do estádio inteiro.",
  },
  {
    slug: "arquibancada-sul",
    name: "Arquibancada Sul",
    category: "Categoria 2",
    priceCents: 189000,
    available: 540,
    color: "#22d3ee",
    description:
      "Atrás do gol, lado oposto. Setor da torcida visitante com vista privilegiada.",
  },
  {
    slug: "arquibancada-leste",
    name: "Arquibancada Leste",
    category: "Categoria 3",
    priceCents: 129000,
    available: 720,
    color: "#34d399",
    description:
      "Lateral leste, totalmente coberta. Custo-benefício imbatível para curtir o espetáculo.",
  },
  {
    slug: "arquibancada-oeste",
    name: "Arquibancada Oeste",
    category: "Categoria 3",
    priceCents: 129000,
    available: 720,
    color: "#34d399",
    description:
      "Lateral oeste com vista para o pôr do sol durante os jogos da tarde. Setor familiar.",
  },
  {
    slug: "popular",
    name: "Popular",
    category: "Categoria 4",
    priceCents: 79000,
    available: 1200,
    color: "#a78bfa",
    description:
      "Setor democrático, energia pura. Acesso ao mesmo gramado, mesma emoção, preço acessível.",
  },
];

async function main() {
  for (const s of sectors) {
    await prisma.sector.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log(`Seeded ${sectors.length} sectors`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
