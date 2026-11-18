import { EnterpriseSection } from "@/src/components/EnterpriseSection";
import { HomeContact } from "@/src/components/HomeContact";
import { HomeFeaturedWork } from "@/src/components/HomeFeaturedWork";
import { HomeFeedback } from "@/src/components/HomeFeedback";
import { HomeHero } from "@/src/components/HomeHero";
import { ProposalSection } from "@/src/components/ProposalSection";
import { HomeHowIWork } from "@/src/components/HomeHowIWork";

export default function HomePage() {
  return (
    <div className="frame-home">
      <HomeHero />
      <HomeFeaturedWork />
      <ProposalSection />
      <HomeFeedback />
      <HomeHowIWork />
      <EnterpriseSection variant="frame" />
      <HomeContact />
    </div>
  );
}
