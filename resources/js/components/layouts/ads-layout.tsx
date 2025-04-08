export default function AdsLayout({ ...props }) {
  return (
    <section aria-labelledby="ads-heading" { ...props } >
      <article role="presentation"
        className="relative bg-neutral-200 w-full h-[35rem] rounded-2xl"
      >
        <figure className="absolute w-[55%] bottom-3 -left-2 z-0">
          <img src="/img/people/2ppl-O.png" alt="Two people illustration variant" />
        </figure>
        <figure className="absolute w-[55%] bottom-0 left-2 z-0">
          <img src="/img/people/2ppl.png" alt="Two people illustration" />
        </figure>

        <section aria-label="ads-details" className="flex flex-col ml-[40%] mr-20 items-end">
          <div className="flex items-center pt-32 mb-4 pr-8">
            <img src="/svg/order.svg" alt="Order logo" />
            <h2 id="ads-heading" className="font-bold text-black text-6xl">ing is more</h2>
          </div>

          <div className="flex justify-end text-5xl rounded-full bg-black p-5 pb-6 pr-12 w-full">
            <p className="text-white">
              <span className="underline text-[#FC8A06]">Personalised</span> & Instant
            </p>
          </div>
          <p className="pr-20 py-4 text-[1.2rem]"> Download the Order.uk app for faster ordering</p>

          <figure className="pr-15">
            <img src="/img/googleApp.png" alt="Download on App Store and Google Play" />
          </figure>
        </section>
      </article>
    </section>
  );
};