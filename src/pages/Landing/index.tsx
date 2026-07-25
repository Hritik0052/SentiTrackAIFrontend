import { usePageMeta } from "../../hooks/usePageMeta"
import { CtaSection } from "./CtaSection"
import { FeaturesSection } from "./FeaturesSection"
import { HeroSection } from "./HeroSection"
import { HowItWorksSection } from "./HowItWorksSection"
import { StatsSection } from "./StatsSection"

export default function LandingPage() {
  usePageMeta("SentiTrack AI — Understand your mind, one entry at a time")
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CtaSection />
    </>
  )
}
