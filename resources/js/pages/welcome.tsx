import { Link } from "@inertiajs/react";

export default function Welcome() {
  return (
    <>
      <div className="flex gap-2">
          <Link href={route("home")}>Pages</Link>
          <Link href={route("about")}>About</Link>
          <Link href={route("blog")}>Blog</Link>
          <Link href={route("contact")}>Contact</Link>
      </div>
      <h1>Biji Pler</h1>
    </>
  );
}