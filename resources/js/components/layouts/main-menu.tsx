interface Produk {
  name: string;
  description: string;
  price: number;
  image_url: string;
}

interface MainProps {
  kategori: string;
  produk: Produk[];
}

export default function Main({ kategori, produk }: MainProps) {
  return (
    <div id="items" className="mx-16">
      <h1 className="font-bold text-5xl mt-10">Menu - menu</h1>
      <div className="flex flex-wrap gap-3 mt-5">
        {produk.map((item, index) => (
          <div key={index} aria-label="card menu" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl shadow-md bg-white w-[28rem]">
            <div className="max-w-sm">
              <h1 className="text-lg font-semibold text-gray-800">{item.name}</h1>
              <p className="text-gray-600 mt-1">{item.description}</p>
              <span className="text-green-700 font-medium mt-2 block">{item.price}</span>
            </div>
            <div
              className="relative w-64 h-40 bg-cover bg-center rounded-lg shadow-lg"
              style={{ backgroundImage: `url('${item.image_url}')` }}
            >
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
