import { Link } from "@inertiajs/react";
import FavoriteButton from "./favorite-button";

interface Item {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_favorite?: boolean;
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover rounded-t-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/img/placeholder.png';
          }}
        />
        <FavoriteButton itemId={item.id} initialState={item.is_favorite} />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        <div className="flex items-center justify-between">
         
          <Link
            href={route('client.items.show', item.id)}
            className="px-4 py-2 bg-[#51793E] text-white rounded-full text-sm 
                     hover:bg-[#3f5e30] transition-colors duration-300"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}