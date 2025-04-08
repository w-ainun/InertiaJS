import { Link } from '@inertiajs/react';

const AboutLayout = ({ ...props }) => {
  return (
    <section aria-label="about us" { ...props }>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Know more about us!</h1>
        <div className="flex items-center gap-2">
          <Link href="#" className="rounded-full border border-green-700 p-4 font-bold">
            Frequent Questions
          </Link>
          <Link href="#" className="p-4">
            Who are we?
          </Link>
          <Link href="#" className="p-4">
            Help & Support
          </Link>
        </div>
      </div>
      <div className="mt-10 flex rounded-2xl bg-white p-1">
        <div className="flex flex-col items-center px-4 py-6 font-bold">
          <Link href="#" className="rounded-full bg-[#51793E] px-10 py-4 text-center">
            How Does Order.UK work?
          </Link>
          <Link href="#" className="px-10 py-4 text-center">
            What payment methods are accepted?
          </Link>
          <Link href="#" className="px-10 py-4 text-center">
            Can I track my order in real-time?
          </Link>
          <Link href="#" className="px-10 py-4 text-center">
            Are there any special discounts or promotion available?
          </Link>
          <Link href="#" className="px-10 py-4 text-center">
            Is Order.UK available in my area?
          </Link>
        </div>
        <div className="mt-10 flex flex-col">
          <div className="mr-4 flex gap-3">
            <div className="card flex flex-col items-center rounded-2xl bg-neutral-200 p-10">
              <h1 className="font-bold">Place an Order!</h1>
              <img src="/svg/about/place-order.svg" alt="" />
              <p>Place order through our website or mobile app</p>
            </div>
            <div className="card flex flex-col items-center rounded-2xl bg-neutral-200 p-10">
              <h1 className="font-bold">Place an Order!</h1>
              <img src="/svg/about/track-order.svg" alt="" />
              <p>Place order through our website or mobile app</p>
            </div>
            <div className="card flex flex-col items-center rounded-2xl bg-neutral-200 p-10">
              <h1 className="font-bold">Place an Order!</h1>
              <img src="/svg/about/get-order.svg" alt="" />
              <p>Place order through our website or mobile app</p>
            </div>
          </div>
            <p className="mt-10 px-10 text-center">
              Order.UK simplifies the food ordering process. Browse through our diverse menu, select your favorite dishes, and proceed to
              checkout. Your delicious meal will be on its way to your doorstep in no time!
            </p>
        </div>
      </div>
    </section>
  );
};

export default AboutLayout;
