import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Offres from "@/components/Offres";
import PourquoiNous from "@/components/PourquoiNous";
import CommentCaMarche from "@/components/CommentCaMarche";
import CtaBand from "@/components/CtaBand";
import APropos from "@/components/APropos";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Offres />
        <PourquoiNous />
        <CommentCaMarche />
        <CtaBand />
        <APropos />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
