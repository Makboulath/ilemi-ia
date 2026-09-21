import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ApprendreHub from "@/components/apprendre/ApprendreHub";

export const metadata: Metadata = {
  title: "Apprendre avec Ilémi",
  description:
    "Hub de formation IA : parcours Débutant, Créateur et Pro, leçons, quiz et progression.",
  robots: { index: false, follow: false },
};

export default function ApprendrePage() {
  return (
    <>
      <Header />
      <main id="contenu-principal" className="bg-cream text-ink">
        <ApprendreHub />
      </main>
      <Footer />
    </>
  );
}
