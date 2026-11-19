import HeroBanner from "@/components/home/HeroBanner";
import FeaturedEquipmentSection from "@/components/home/FeaturedEquipmentSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import PopularRecentSection from "@/components/home/PopularRecentSection";
import ClosingCtaSection from "@/components/home/ClosingCtaSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedEquipmentSection />
      <CategoriesSection />
      <WhyChooseUsSection />
      <ReviewsSection />
      <HowItWorksSection />
      <PopularRecentSection />
      <ClosingCtaSection />
    </>
  );
}
