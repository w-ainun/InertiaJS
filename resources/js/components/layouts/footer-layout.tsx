import React from "react";
import TextLink from "../elements/text-link";
import FigureCap from "../fragments/figcap";
import SocialIcons from "../fragments/sosmed";

type FooterColumnProps = {
  title: string;
  links: { label: string; href: string }[];
};

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <nav aria-label={ title } className="flex flex-col gap-4">
    <h2 className="font-bold text-lg">{ title }</h2>
    {links.map((link, index) => (
      <TextLink key={ index } href={ link.href } className="text-sm">
        { link.label }
      </TextLink>
    ))}
  </nav>
);

export default function FooterLayout({ ...props }) {
  return (
    <footer { ...props }>
      <main className="grid grid-cols-[2fr_2fr_1fr_1fr] py-20 px-20 pb-10 gap-10 bg-[#D9D9D9]">

        <section className="flex flex-col max-w-sm">
          {/* <FigureCap src="/svg/order-2.svg" alt="Order logo" />
          <FigureCap src="/img/googleApp.png" alt="Download on app stores" /> */}
          <FigureCap src="/RB-Store.png" alt="RB Store" />
          <p className="mt-2">Company # 490039-445, Registered with House of companies.</p>
        </section>

        <section aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="font-bold text-lg">
            Get Exclusive Deals in your Inbox
          </h2>
          <form className="mt-3">
            <div className="relative h-10 w-full">
              <input
                type="email"
                placeholder="youremail@gmail.com"
                className="border font-bold border-gray-500 px-4 py-2 w-full rounded-4xl h-full"
                maxLength={25}
              />
              <button
                type="submit"
                className="absolute font-bold text-white py-2 px-10 rounded-4xl bg-[#51793E] right-0 h-full"
              >
                Subscribe
              </button>
            </div>
          </form>
          <p className="mt-4 ml-2 text-sm">
            We won’t spam. Read our <a href="#" className="underline">email policy</a>.
          </p>

          <SocialIcons
            className="mt-4 ml-1"
            icons={[
              { src: "/svg/icons/Facebook.svg", alt: "Facebook", href: "https://web.facebook.com/profile.php?id=100074005363545&locale=id_ID" },
              { src: "/svg/icons/Instagram.svg", alt: "Instagram", href: "https://www.instagram.com/rhindottire/" },
              { src: "/svg/icons/TikTok.svg", alt: "TikTok", href: "https://www.tiktok.com/@rhindottire" },
              { src: "/svg/icons/Snapchat.svg", alt: "Snapchat", href: "https://github.com/rhindottire" },
            ]}
          />
        </section>

        <FooterColumn
          title="Legal Pages"
          links={[
            { label: "Terms and conditions", href: "#" },
            { label: "Privacy", href: "#" },
            { label: "Cookies", href: "#" },
            { label: "Modern Slavery Statement", href: "#" },
          ]}
        />

        <FooterColumn
          title="Important Links"
          links={[
            { label: "Get help", href: "#" },
            { label: "Add your restaurant", href: "#" },
            { label: "Sign up to deliver", href: "#" },
            { label: "Create a business account", href: "#" },
          ]}
        />
      </main>

      <aside className="flex flex-wrap justify-between w-full px-20 py-5 gap-4 bg-black text-white">
        <p>Order.uk © 2024, All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Pricing</a>
          <a href="#">Do not sell or share my personal information</a>
        </nav>
      </aside>
    </footer>
  );
};