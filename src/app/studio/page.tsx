import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StudioExperience from "@/components/studio/StudioExperience";

export const metadata: Metadata = {
  title: "Studio Ilémi",
  description:
    "Studio créatif Ilémi — générez des images IA gratuitement (Pollinations Flux), testez vidéo et liens audio.",
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
