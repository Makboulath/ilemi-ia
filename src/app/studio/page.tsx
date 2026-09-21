import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StudioExperience from "@/components/studio/StudioExperience";

export const metadata: Metadata = {
  title: "Studio créatif",
  description:
    "Studio créatif ilémi.IA — générez des images IA (démo Pollinations), explorez la vidéo et les outils audio.",
  openGraph: {
    title: "Studio créatif | ilémi.IA",
    description:
      "Générez des images IA, explorez la vidéo courte et les outils audio.",
  },
};

export default function StudioPage() {
  return (
    <>
      <Header />
      <main id="contenu-principal">
        <StudioExperience />
      </main>
      <Footer />
    </>
  );
}
