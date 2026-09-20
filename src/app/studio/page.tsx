import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StudioExperience from "@/components/studio/StudioExperience";

export const metadata: Metadata = {
  title: "Studio Ilémi",
  description:
    "Studio créatif Ilémi — Image, Vidéo, Son. Espace membre pour expérimenter l'IA créative.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return (
    <>
      <Header />
      <main>
        <StudioExperience />
      </main>
      <Footer />
    </>
  );
}
