import { EnterpriseSection } from "@/src/components/EnterpriseSection";
import { HomeContact } from "@/src/components/HomeContact";
import { HomeFeaturedWork } from "@/src/components/HomeFeaturedWork";
import { HomeFeedback } from "@/src/components/HomeFeedback";
import { HomeHero } from "@/src/components/HomeHero";
import { ProposalSection } from "@/src/components/ProposalSection";
import { HomeHowIWork } from "@/src/components/HomeHowIWork";
import { SkillTags } from "@/src/components/SkillTags";
import { site } from "@/src/content/site";

export default function HomePage() {
  return (
    <div className="frame-home">
      <HomeHero />
      <HomeFeaturedWork />
      <ProposalSection />
      <HomeFeedback />
      <HomeHowIWork />
      <EnterpriseSection variant="frame" />
      <section id="tools" className="frame-tools" aria-labelledby="tools-heading">
        <h2 id="tools-heading">Tools</h2>
        <SkillTags skills={site.skills} />
      </section>
      <HomeContact />
    </div>
  );
}
