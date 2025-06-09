import { router } from "@inertiajs/react";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  itemId: number;
  initialState?: boolean;
}

export default function FavoriteButton({ itemId, initialState = false }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialState);

  const toggleFavorite = () => {
    router.post(route('client.favorites.toggle'), {
      item_id: itemId
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setIsFavorited(!isFavorited);
        toast.success(isFavorited ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit');
      },
      onError: () => toast.error('Gagal mengubah status favorit')
    });
  };

  return (
    <button
      onClick={toggleFavorite}
      className="absolute top-2 right-2 p-2 bg-white/80 rounded-full 
                 hover:bg-white transition-colors duration-200 shadow-sm"
    >
      <Heart 
        className={`h-5 w-5 transition-colors duration-200 
                   ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
      />
    </button>
  );
}