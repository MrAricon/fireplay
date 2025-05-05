import HeroSection from "@/components/hero-section"
import FeaturedGames from "@/components/featured-games"
import AboutSection from "@/components/about-section"
import HowItWorks from "@/components/how-it-works"
import CallToAction from "@/components/call-to-action"

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedGames />
      <AboutSection />
      <HowItWorks />
      <CallToAction />
    </div>
  )
}