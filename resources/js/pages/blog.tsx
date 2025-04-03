import { Link } from "@inertiajs/react";

export default function Blog() {
  return (
    <>
    <div className="flex gap-2">
      <Link href={route("home")}>Pages</Link>
      <Link href={route("about")}>About</Link>
      <Link href={route("blog")}>Blog</Link>
      <Link href={route("contact")}>Contact</Link>
    </div>
      <div id="artikkel">
        <div id="1" className="">
          <h1>Artikel 1</h1>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis animi quibusdam tempora corporis sint deserunt esse officia, harum, necessitatibus, quod aspernatur nisi atque eligendi veritatis. Repellat reiciendis deleniti numquam quos est quisquam rem aliquam nostrum beatae, veritatis laudantium voluptas amet sequi, harum tenetur labore molestiae qui nisi quae. Iure vitae corrupti reprehenderit ipsum deleniti, porro eaque facilis excepturi minus reiciendis rerum aut culpa? Inventore, modi amet? Similique repellendus iste sapiente quaerat praesentium, blanditiis, deleniti pariatur accusantium odit, quidem in voluptatibus quisquam. At totam laudantium eum consectetur officiis blanditiis sapiente eaque in? Ratione totam asperiores minima cumque voluptatem explicabo officiis alias.</p>
        </div>
        <div id="2" className="">
          <h1>Artikel 2</h1>
          <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel, fuga atque quisquam adipisci quae est blanditiis ex quidem voluptatem assumenda odit accusantium nostrum labore eaque error obcaecati sapiente architecto quaerat, pariatur ullam cum deserunt dolorum nihil? Labore, quam nesciunt! Esse dolorem dolores molestiae quaerat omnis distinctio modi pariatur libero ad.</p>
        </div>
      </div>
    </>
  );
}