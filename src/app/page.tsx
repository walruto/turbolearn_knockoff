import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Courses from "@/components/sections/courses";
import Testimonials from "@/components/sections/testimonials";
import CTA from "@/components/sections/cta";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Courses />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
