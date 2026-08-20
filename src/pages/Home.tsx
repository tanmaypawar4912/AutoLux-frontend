import Hero from "../components/home/Hero";
import FeaturedCars from "../components/home/FeaturedCars";
import WhyChoose from "../components/home/WhyChoose";
import CallToAction from "../components/home/CallToAction";
import BrowseBrands from "../components/home/BrowseBrands";
import RecentlyViewed from "../components/RecentlyViewed";

const Home = () => {
  return (
    <div className="relative overflow-x-hidden bg-white">
      <Hero />

      <div className="relative z-20 bg-white">
        <FeaturedCars />

        <RecentlyViewed />

        <BrowseBrands />

        <WhyChoose />

        <CallToAction />
      </div>
    </div>
  );
};

export default Home;