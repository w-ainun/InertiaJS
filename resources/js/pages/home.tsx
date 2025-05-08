import AppTemplate from "@/components/templates/app-template";
import Jumbotron from "@/components/layouts/jumbotron";
import HeroLayout from "@/components/layouts/hero-layout";
// import AdsLayout from "@/components/layouts/ads-layout";
import AboutLayout from "@/components/layouts/FAQ-layout";

export default function Home() {
  return (
    <AppTemplate className="bg-[#FFFFFF]">
      <Jumbotron />
      <HeroLayout aria-label="main section" className="mx-16"/>
      {/* <AdsLayout className="mx-16 mt-20" /> */}
      <AboutLayout className="mx-16 mt-20 h-screen rounded-2xl bg-neutral-200 p-24" />
    </AppTemplate>
  );
};