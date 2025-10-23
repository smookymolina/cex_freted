import HeroSection from '../components/home/HeroSection';
import SellerFlowOverview from '../components/home/SellerFlowOverview';
import BuyerHighlights from '../components/home/BuyerHighlights';
import TrustSignals from '../components/home/TrustSignals';
import FeaturedContent from '../components/home/FeaturedContent';
import SustainabilityShowcase from '../components/home/SustainabilityShowcase';

export default function Home() {
  return (
    <>
      <HeroSection />
      <SellerFlowOverview />
      <BuyerHighlights />
      <TrustSignals />
      <FeaturedContent />
      <SustainabilityShowcase />
    </>
  );
}
