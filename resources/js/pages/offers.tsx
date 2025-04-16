import HeaderLayout from "@/components/layouts/header-layout";
import NavbarLayout from "@/components/layouts/navbar-layout";

export default function Home() {
  return (
    <>
      <HeaderLayout className="flex justify-between items-center mx-16 h-14 bg-neutral-200 rounded-b-2xl" />
      <NavbarLayout className="flex justify-between items-center mx-16 my-5 font-bold" />
      <h1>Lorem Str::Limit(params, limit), Arr::First</h1>
      {/* <Link href="#">{{ $offer["name"] }}</Link> */}
      {/* <p>{{ $offer->created_at->format("j F Y") }}</p> */}
      {/* <p>{{ $offer->created_at->diffForHumans() }}</p> */}
    </>
  );
};