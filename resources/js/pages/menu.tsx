import HeaderLayout from "@/components/layouts/header-layout";
import NavbarLayout from "@/components/layouts/navbar-layout";

export default function Home() {
  return (
    <>
      <HeaderLayout />
      <NavbarLayout />
      <h1>href={route("home")}</h1>
    </>
  );
};