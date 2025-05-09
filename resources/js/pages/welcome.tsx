import AppTemplate from "@/components/templates/app-template";
import Jumbotron from "@/components/layouts/jumbotron";
import HeroLayout from "@/components/layouts/hero-layout";
import AboutLayout from "@/components/layouts/FAQ-layout";
import { Head } from '@inertiajs/react';

export default function Home() {
  return (
    <AppTemplate >
      <Head title="Welcome" />
      <Jumbotron />
      <HeroLayout aria-label="main section" />
      <AboutLayout />
    </AppTemplate>
  );
};