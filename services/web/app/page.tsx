import { Hero } from "@/components/hero";
import { SignatureMoment } from "@/components/signature-moment";
import { DossierShell } from "@/components/dossier-shell";
import { ProjectCaseStudies } from "@/components/project-case-study";
import { SkillsPanel } from "@/components/skills-panel";
import { AboutPanel } from "@/components/about-panel";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <SignatureMoment />
      <DossierShell>
        <ProjectCaseStudies />
        <SkillsPanel />
        <AboutPanel />
        <ContactSection />
      </DossierShell>
    </main>
  );
}
