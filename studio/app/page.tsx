import { EnterpriseSection } from "@/src/components/EnterpriseSection";
import { HomeFeaturedWork } from "@/src/components/HomeFeaturedWork";
import { HomeHero } from "@/src/components/HomeHero";

export default function HomePage() {
  return (
    <div className="frame-home">
      <HomeHero />
      <HomeFeaturedWork />
      <EnterpriseSection variant="frame" />
    </div>
  );
}
