import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Cases from "@/components/Cases";
import ContactForm from "@/components/ContactForm";
import Stats from "@/components/Stats";
import FAQ from "@/components/FAQ";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Cases />
        <ContactForm />
        <Stats />
        <FAQ />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
