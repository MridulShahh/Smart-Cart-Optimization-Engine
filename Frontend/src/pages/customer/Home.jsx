import MainLayout from "../../layouts/MainLayout";

import HeroSection from "../../components/home/HeroSection";
import SearchSection from "../../components/home/SearchSection";
import RecommendationPreview from "../../components/home/RecommendationPreview";
import TrendingProducts from "../../components/home/TrendingProducts";
import Categories from "../../components/home/Categories";

function Home() {
  return (
    <MainLayout>
      <HeroSection />

      <SearchSection />

      <TrendingProducts />

      <RecommendationPreview />

      <Categories />
    </MainLayout>
  );
}

export default Home;