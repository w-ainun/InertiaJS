import TrackingCard from "../templates/tracking-card";

export default function Jumbotron() {
  return (
    <section aria-label="jumbotron" className="bg-[#FBFBFB] border rounded-2xl relative h-[38rem] mt-3 mx-16 overflow-hidden">
      <img src="/img/klepon.png" alt="gambar klepon" className="absolute top-[60%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-10" />
      <div className="absolute bg-[#51793E] rounded-tl-[45%] w-[45%] h-full right-0 top-10"></div>

      <TrackingCard
        title="RB Store"
        time="now"
        messages={["We've Reached your order!", "Awaiting Restaurant acceptance"]}
        number={1}
        className="absolute right-30 top-30"
      />
      <TrackingCard
        title="RB Store"
        time="now"
        messages={["Order Accepted! ✅", "Your order will be delivered shortly"]}
        number={2}
        className="absolute right-5 bottom-55"
      />
      <TrackingCard
        title="RB Store"
        time="now"
        messages={["Your rider nearby 🎉", "They're almost here - get ready!"]}
        number={3}
        className="absolute right-20 bottom-10"
      />

      <div className="ml-10 mt-52">
        <p>Order Traditional food, takeaway and groceries.</p>
        <h1 className="font-bold text-6xl">Feast Your Sense,</h1>
        <h1 className="font-bold text-6xl text-[#51793E]">Fast and Fresh</h1>
        <p className="mt-10">Enter a postcode to see what we deliver</p>
        <form action="">
          <div className="relative h-10 w-96 mt-3">
            <input
              type="text"
              placeholder="e.g. E4CR 3TE"
              className="border font-bold border-gray-500 px-4 py-2 w-full rounded-4xl h-full"
              maxLength={25}
            />
            <button type="button"
              className="absolute font-bold text-white py-2 px-10 rounded-4xl bg-[#51793E] right-0 h-full">
                Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};