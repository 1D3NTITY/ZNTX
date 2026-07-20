import { Hero } from "@/components/hero";
import { NetworkMap } from "@/components/network-map";
import { SkillsPanel } from "@/components/skills-panel";
import { AboutPanel } from "@/components/about-panel";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <NetworkMap />
      <SkillsPanel />
      <AboutPanel />
      <ContactSection />
    </main>
  );
}
