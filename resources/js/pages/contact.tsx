import { Link } from "@inertiajs/react";

type ContactProps = {
  email: string,
  sosmed: string
}

const Contact: React.FC<ContactProps> = ({ email, sosmed }) => {
  return (
    <>
      <div className="flex gap-2">
        <Link href={route("home")}>Pages</Link>
        <Link href={route("about")}>About</Link>
        <Link href={route("blog")}>Blog</Link>
        <Link href={route("contact")}>Contact</Link>
      </div>
      <h1>Email: { email }</h1>
      <p>Sosmed: { sosmed }</p>
    </>
  );
}

export default Contact