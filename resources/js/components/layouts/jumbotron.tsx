import TrackingCard from "../templates/tracking-card";

export default function Jumbotron() {
  return (
    <section aria-label="jumbotron" className="bg-[#FBFBFB] border rounded-2xl relative h-[38rem] mt-3 mx-16 overflow-hidden">
      <img src="/img/klepon.png" alt="gambar klepon" className="absolute top-[60%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-10" />
      <div className="absolute bg-[#51793E] rounded-tl-[45%] w-[45%] h-full right-0 top-10"></div>

      <TrackingCard
        title="RB Store"
        time="now"
        messages={["order cepat dan mudah", "Pesanan langsung diproses"]}
        number={1}
        className="absolute right-30 top-30"
      />
      <TrackingCard
        title="RB Store"
        time="now"
        messages={["menerima banyak jenis pembayaran ✅", "nikmati kemudahan bertransaksi"]}
        number={2}
        className="absolute right-5 bottom-55"
      />
      <TrackingCard
        title="RB Store"
        time="now"
        messages={["jasa kirim tanpa bayar ongkir!", "pengiriman bebas menuju alamat anda"]}
        number={3}
        className="absolute right-20 bottom-10"
      />

      <div className="ml-10 mt-52">
        <p>Pesan aneka kue tradisional, kudapan siap saji dan penawaran spesial lainnya!</p>
        <h1 className="font-bold text-5xl">Cita Rasa Nusantara,</h1>
        <div className="font-bold text-5xl text-[#51793E]">
          <p>Tradisi dalam</p>
          <p>Genggaman</p>
        </div>
        <p className="mt-5">Temukan Kelezatan dalam menu kami</p>
        <form action="">
          <div className="relative h-10 w-96 mt-3">
            <input
              type="text"
              placeholder="e.g. klepon manis"
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