import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "../../components/ui/Button"
import { Container } from "../../components/ui/Container"

export function CtaSection() {
  return (
    <section className="py-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-animated px-8 py-16 text-center shadow-2xl shadow-brand-500/30 sm:px-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_60%)]" />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start your journaling journey today
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
            Join SentiTrack AI and turn everyday reflection into lasting self-awareness. It's free to
            get started.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              to="/register"
              size="lg"
              className="!bg-white !text-brand-700 !shadow-none hover:!-translate-y-0.5"
              icon={<ArrowRight className="h-4.5 w-4.5" />}
            >
              Create your account
            </Button>
            <Button
              to="/about"
              size="lg"
              variant="ghost"
              className="!text-white hover:!text-white/80"
            >
              Learn more
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
