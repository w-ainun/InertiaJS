
interface Produk {
  nama: string;
  deskripsi: string;
  harga: string;
  gambar: string;
}

interface DataKategori {
  judul: string;
  keterangan: string;
  gambar: string;
  produk: Produk[];
}

export function getKategoriData(kategori: string): DataKategori {
  const data = {
    "Kue Basah": {
      judul: "Aneka Kue Basah",
     keterangan: "mulai 2.000 an aja",
      gambar: "/img/categories/kue-basah.png",
      produk: [
        {
          nama: "Dadar Gulung",
          deskripsi: "Kue tradisional berbentuk gulungan dadar berwarna hijau dengan isian kelapa manis.",
          harga: "Rp. 3.000/pcs",
          gambar: "/img/dadar-gulung.png",
        },
        {
          nama: "Kue Cucur",
          deskripsi: "Kue bundar kecoklatan dengan bagian tengah menonjol, tekstur lembut di dalam dan renyah di pinggir.",
          harga: "Rp. 2.000/pcs",
          gambar: "/img/cucur.png",
        },
        {
          nama: "Koci-koci",
          deskripsi: "Kue berbentuk segitiga berwarna hijau yang terbuat dari tepung ketan dengan isian manis, dibungkus daun pisang.",
          harga: "Rp. 2.000/pcs",
          gambar: "/img/koci-koci.png",
        },
        {
          nama: "Klepon",
          deskripsi: "Kue bulat kecil berwarna hijau yang terbuat dari tepung ketan berisi gula merah dan dibalut kelapa parut",
          harga: "Rp. 5.000/pcs",
          gambar: "/img/categories/kue-basah.png",
        },
        {
          nama: "Kue Lumpur",
          deskripsi: "Kue basah berwarna kuning keemasan dengan topping kismis atau buah di atasnya, bertekstur lembut dan creamy.",
          harga: "Rp. 2.500/pcs",
          gambar: "/img/kue-lumpur.png",
        },
        {
          nama: "Bikang Manis",
          deskripsi: "Kue tradisional dengan pola warna merah muda dan putih, bertekstur lembut dengan rasa manis.",
          harga: "Rp. 2.000/pcs",
          gambar: "/img/bikang-manis.png",
        },
        {
          nama: "Kue Putu",
          deskripsi: "Kue silinder berwarna hijau yang terbuat dari tepung beras dengan isian gula merah.",
          harga: "Rp. 2.000/pcs",
          gambar: "/img/kue-putu.png",
        },
        {
          nama: "Lemper Ayam",
          deskripsi: "Kue berbentuk silinder yang terbuat dari ketan berisi ayam yang dibungkus dengan daun pisang.",
          harga: "Rp. 3.000/pcs",
          gambar: "/img/lemper-ayam.png",
        },
        {
          nama: "Kue Nagasari",
          deskripsi: "Kue yang terbuat dari tepung beras dan santan dengan isian pisang, dibungkus daun pisang.",
          harga: "Rp. 2.500/pcs",
          gambar: "/img/kue-nagasari.png",
        },
        {
          nama: "Kue Lapis",
          deskripsi: "Kue berlapis-lapis dengan warna hijau dan putih, bertekstur kenyal dan lembut.",
          harga: "Rp. 2.000/pcs",
          gambar: "/img/kue-lapis.png",
        },
      ],
    },
    "Kue Kering": {
      judul: "Aneka Kue Kering",
     keterangan: "Beli banyak makin hemat!",
      gambar: "/img/categories/kue-kering.png",
      produk: [
        {
          nama: "Semprong renyah",
          deskripsi: "Makanan ringan berbentuk silinder/gulungan tipis dan renyah dengan warna kecoklatan.",
          harga: "Rp. 50.000/pcs",
          gambar: "/img/semprong-renyah.png",
        },
        {
          nama: "Pastel kering",
          deskripsi: "Camilan kering berbentuk setengah lingkaran dengan isian, tekstur renyah berwarna keemasan",
          harga: "Rp. 50.000/pcs",
          gambar: "/img/pastel-kering.png",
        },
        {
          nama: "Seroja/Kembang Goyang",
          deskripsi: "Camilan tradisional berbentuk bunga dengan tekstur renyah dan berwarna keemasan",
          harga: "Rp. 50.000/pcs",
          gambar: "/img/seroja.png",
        },
        {
          nama: "Telur Gabus",
          deskripsi: " Camilan berbentuk lonjong kecil menyerupai telur ikan gabus, tekstur renyah dan gurih",
          harga: "Rp. 50.000/pcs",
          gambar: "/img/telur-gabus.png",
        },
        {
          nama: "Onde-onde Ketawa",
          deskripsi: "Camilan bulat dengan retakan khas di bagian luarnya yang menyerupai senyuman/tawa.",
          harga: "Rp. 50.000/pcs",
          gambar: "/img/onde-onde-ketawa.png",
        },
        {
          nama: "Kuping Gajah",
          deskripsi: "Camilan renyah berbentuk menyerupai daun atau telinga gajah dengan warna kehitaman.",
          harga: "Rp. 50.000/pcs",
          gambar: "/img/kuping-gajah.png",
        },
        {
          nama: "Kacang Sembunyi",
          deskripsi: "Camilan berupa kacang yang dibalut tepung dan digoreng hingga berwarna oranye keemasan",
          harga: "Rp. 45.000/pcs",
          gambar: "/img/kacang-sembunyi.png",
        },
        {
          nama: "Keripik Tempe",
          deskripsi: "Irisan tipis tempe yang digoreng hingga renyah dengan bumbu khas",
          harga: "Rp. 40.000/pcs",
          gambar: "/img/keripik-tempe.png",
        },
        {
          nama: "Kue Sus kering",
          deskripsi: "Kue sus versi kering berbentuk bulat berisi krim, berwarna keemasan.",
          harga: "Rp. 35.000/pcs",
          gambar: "/img/kue-sus-kering.png",
        },
        
    ],
    },
    "Kue Modern": {
      judul: "Aneka Kue Modern",
     keterangan: "mulai 2.000 an aja",
      gambar: "/img/categories/kue-modern.png",
      produk: [
        {
          nama: "Lapis legit",
          deskripsi: "Kue berlapis-lapis dengan warna keemasan, tekstur lembut dan aroma rempah.",
          harga: "Rp. 28.000/pcs",
          gambar: "/img/lapis-legit.png",
        },
        {
          nama: "Donat",
          deskripsi: "Kue bulat dengan lubang di tengah, berbagai topping warna-warni seperti gula dan coklat.",
          harga: "Rp. 3.500/pcs",
          gambar: "/img/donat.png",
        },
        {
          nama: "Cupcake",
          deskripsi: "Kue kecil berbentuk cup dengan krim berwarna-warni di atasnya.",
          harga: "Rp. 5.000/pcs",
          gambar: "/img/cupcake.png",
        },
        {
          nama: "Burnt Cheesecake",
          deskripsi: "Kue keju panggang dengan permukaan gosong khas, tekstur lembut dan creamy di dalamnya",
          harga: "Rp. 22.000/pcs",
          gambar: "/img/burnt-cheesecake.png",
        },
        {
          nama: "Brownies",
          deskripsi: "Kue coklat pekat padat dengan topping buah berry, tekstur moist dan lembut.",
          harga: "Rp. 25.000/pcs",
          gambar: "/img/brownies.png",
        },
        {
          nama: "Croissant",
          deskripsi: " Kue berlapis dengan bentuk bulan sabit, tekstur renyah dan berlapis-lapis dengan topping coklat",
          harga: "Rp. 15.000/pcs",
          gambar: "/img/croissant.png",
        },
        {
          nama: "Pancake",
          deskripsi: "Kue dadar tebal bertumpuk dengan sirup dan buah sebagai pelengkap.",
          harga: "Rp. 17.000/pcs",
          gambar: "/img/pancake.png",
        },
        {
          nama: "Bolu",
          deskripsi: "Kue kuning lembut berbentuk bundar dengan tekstur ringan dan berpori.",
          harga: "Rp. 7.000/pcs",
          gambar: "/img/bolu.png",
        },
        {
          nama: "Pie",
          deskripsi: "Kue dengan kulit renyah dan isian buah, bentuk bundar dengan pola anyaman di bagian atas.",
          harga: "Rp. 40.000/pcs",
          gambar: "/img/pie.png",
        },
        {
          nama: "Cinnamon Roll",
          deskripsi: "Kue gulung dengan aroma kayu manis dan topping berry di atasnya.",
          harga: "Rp. 18.000/pcs",
          gambar: "/img/cinnamon-roll.png",
        },
        {
          nama: "Waffle",
          deskripsi: "Kue berbentuk kotak-kotak dengan tekstur renyah di luar dan lembut di dalam.",
          harga: "Rp. 8.000/pcs",
          gambar: "/img/waffle.png",
        },
        {
          nama: "Tiramisu cake",
          deskripsi: "Kue berlapis dengan taburan coklat di atasnya, tekstur lembut dengan sentuhan kopi.",
          harga: "Rp. 20.000/pcs",
          gambar: "/img/tiramisu-cake.png",
        },
    ],
    },
    "Gorengan": {
      judul: "Aneka Gorengan",
     keterangan: "Aneka kue basah pilihan terbaik",
      gambar: "/img/categories/gorengan.png",
      produk: [
        {
          nama: "Pastel",
          deskripsi: "Makanan dengan kulit pastry renyah berisi sayuran dan daging, disajikan dengan cabai rawit merah",
          harga: "Rp. 5.000/pcs",
          gambar: "/img/pastel.png",
        },
        {
          nama: "Bakwan",
          deskripsi: "Gorengan berbentuk pipih dengan campuran sayuran dan tepung, berwarna keemasan dan renyah.",
          harga: "Rp. 1.500/pcs",
          gambar: "/img/bakwan.png",
        },
        {
          nama: "Tahu Isi",
          deskripsi: "Tahu yang digoreng dengan isian sayuran atau daging, tekstur renyah di luar dan lembut di dalam",
          harga: "Rp. 1.500/pcs",
          gambar: "/img/tahu-isi.png",
        },
        {
          nama: "Pisang Molen",
          deskripsi: "Pisang yang dibungkus dengan kulit pastry dan digoreng hingga keemasan",
          harga: "Rp. 2.000/pcs",
          gambar: "/img/pisang-molen.png",
        },
        {
          nama: "Cireng",
          deskripsi: "Makanan berbahan dasar tepung kanji yang digoreng, berbentuk bulat pipih dan disajikan dengan saus sambal",
          harga: "Rp. 1.000/pcs",
          gambar: "/img/cireng.png",
        },
        {
          nama: "Risoles",
          deskripsi: "Makanan dengan kulit crepe yang diisi ragout, dibalut tepung panir dan digoreng hingga kecoklatan",
          harga: "Rp. 5.500/pcs",
          gambar: "/img/risoles.png",
        },
        {
          nama: "Tempe Mendoan",
          deskripsi: "Tempe yang dipotong tipis dan digoreng dengan balutan tepung yang tidak terlalu kering, disajikan dengan cabai hijau",
          harga: "Rp. 2.500/pcs",
          gambar: "/img/tempe-mendoan.png",
        },
        {
          nama: "Bakwan Jagung",
          deskripsi: "Gorengan berbahan dasar jagung dan tepung, bertekstur renyah dengan rasa gurih manis.",
          harga: "Rp. 1.500/pcs",
          gambar: "/img/bakwan-jagung.png",
        },
        {
          nama: "Pisang goreng",
          deskripsi: "Pisang yang digoreng dengan balutan tepung hingga keemasan dan renyah.",
          harga: "Rp. 1.500/pcs",
          gambar: "/img/pisang-goreng.png",
        },
    ],
    },
    "Minuman": {
      judul: "Aneka Minuman",
     keterangan: "Aneka kue basah pilihan terbaik",
      gambar: "/img/categories/minuman.png",
      produk: [
        {
          nama: "Es Cendol",
          deskripsi: "Minuman dingin dengan potongan cendol hijau, santan, dan gula merah.",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/es-cendol.png",
        },
        {
          nama: "Es Oyen",
          deskripsi: "Minuman es dengan campuran berbagai buah potong warna-warni seperti nanas dan mangga, alpukat",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/es-oyen.png",
        },
        {
          nama: "Es Campur",
          deskripsi: "Minuman es dengan berbagai macam bahan seperti buah, jeli, dan cincau hitam dengan sirup",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/es-campur.png",
        },
        {
          nama: "Es Doger",
          deskripsi: "Minuman es dengan warna merah muda dan topping buah, mengandung santan dan es serut.",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/es-doger.png",
        },
        {
            nama: "Es Kuwut",
            deskripsi: "Minuman hijau segar dari parutan timun, sirup, dengan es batu dan potongan jeruk nipis,",
            harga: "Rp. 10.000/pcs",
            gambar: "/img/es-kuwut.png",
        },
        {
            nama: "Es Teler",
            deskripsi: "Minuman es dengan campuran alpukat, kelapa muda, dan buah-buahan lainnya dalam santan",
            harga: "Rp. 10.000/pcs",
            gambar: "/img/es-eler.png",
        },
        {
            nama: "Es Cincau",
            deskripsi: "Minuman es dengan potongan cincau hijau, daun pandan, santan, dan gula merah",
            harga: "Rp. 10.000/pcs",
            gambar: "/img/es-cincau.png",
        },
        {
          nama: "Es Lilin Kacang Hijau",
          deskripsi: "Camilan es beku berbentuk batang dalam plastik dengan isian kacang hijau",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/es-lilin-hacang-hijau.png",
        },
        {
          nama: "Es Kopyor",
          deskripsi: "Minuman es dengan kelapa muda (kopyor), sirup merah, dan daun mint sebagai garnish",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/es-kopyor.png",
        },

    ],
    },
    "Puding": {
      judul: "Aneka Puding",
     keterangan: "Aneka kue basah pilihan terbaik",
      gambar: "/img/categories/puding.png",
      produk: [
        {
          nama: "Puding Tape",
          deskripsi: "Puding berwarna hijau terbuat dari tape bertingkat dengan hiasan daun mint di atasnya",
          harga: "Rp. 5.000/pcs",
          gambar: "/img/puding-tape.png",
        },
        {
          nama: "Biji Salak",
          deskripsi: "Camilan manis berbentuk bulat kecil berwarna oranye kecoklatan, terbuat dari ubi yang disajikan dengan kuah manis",
          harga: "Rp. 7.500/pcs",
          gambar: "/img/biji-salak.png",
        },
        {
          nama: "Pisang Ijo",
          deskripsi: "Pisang yang dibungkus dengan adonan hijau, disajikan dengan saus merah dan es serut berwarna-warni",
          harga: "Rp. 10.000/pcs",
          gambar: "/img/pisang-ijo.png",
        },
        {
          nama: "Sagu Mutiara",
          deskripsi: "Makanan penutup berbahan dasar sagu mutiara berwarna merah muda",
          harga: "Rp. 3.500/pcs",
          gambar: "/img/sagu-mutiara.png",
        },
        {
          nama: "Wajik Ketan",
          deskripsi: "Kue tradisional berbentuk potongan persegi dari beras ketan yang dimasak dengan gula merah dan daun pandan, disajikan dengan daun pisang",
          harga: "Rp. 4.500/pcs",
          gambar: "/img/wajik-ketan.png",
        },
        {
          nama: "Puding Karamel",
          deskripsi: "Puding berwarna kecoklatan dengan lapisan karamel di atasnya dan hiasan daun mint, tekstur lembut dan berkilau.",
          harga: "Rp. 5.000/pcs",
          gambar: "/img/puding-karamel.png",
        },
    
    ],
    },
  };


  return (data as Record<string, DataKategori>)[kategori] ?? {
    judul: kategori,
    keterangan: "Kategori tidak ditemukan",
    gambar: "",
    produk: [],
  };
}
