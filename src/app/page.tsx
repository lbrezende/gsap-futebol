import { prisma } from "@/lib/prisma";
import ScrollVideoHeader from "@/components/ScrollVideoHeader";
import Hero from "@/components/Hero";
import StadiumMap from "@/components/StadiumMap";
import TicketTypes from "@/components/TicketTypes";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sectors = await prisma.sector.findMany({
    orderBy: { priceCents: "desc" },
  });

  return (
    <main>
      <ScrollVideoHeader />
      <Hero />
      <StadiumMap sectors={sectors} />
      <TicketTypes sectors={sectors} />
      <Footer />
    </main>
  );
}
