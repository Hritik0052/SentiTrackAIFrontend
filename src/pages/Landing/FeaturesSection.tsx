import { Section, SectionHeading } from "../../components/ui/Section"
import { FeatureCard } from "../../components/ui/FeatureCard"
import { FEATURES } from "../../data/features"

export function FeaturesSection() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Everything you need"
        title="A complete toolkit for reflective journaling"
        description="From a blank page to deep self-awareness — SentiTrack AI supports every step of your journaling practice."
      />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} index={i} />
        ))}
      </div>
    </Section>
  )
}
