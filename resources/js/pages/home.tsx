import { Link } from "@inertiajs/react";
import { MapPin } from "lucide-react";

const Home = () => {
  return (
      <>
        <header className="flex justify-between items-center h-14 bg-neutral-200 mx-16 rounded-b-2xl">
          <p className="pl-4">🌟 Get 5% Off your first order,
            <Link href="#" className="text-[#51793E] font-bold underline"> Promo: ORDER5</Link>
          </p>
          <div className="flex gap-3">
            <MapPin />
            <p>Jl. Telang Indah Barat, Bangkalan</p>
            <Link href="#" className="text-[#51793E] font-bold underline">
              Change Location
            </Link>
          </div>
          <div className="flex items-center gap-1 h-full text-white bg-[#028643] rounded-b-2xl">
            <img src="/svg/cart.svg" alt="cart" className="h-14 w-20 p-2" />
            <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
            <div className="p-4">23 Items</div>
            <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
            <div className="p-4">GBP 79.89</div>
            <div className="h-full w-[1px] bg-[#F0F0FF]"></div>
            <img src="/svg/download.svg" alt="download" className="h-14 w-20 p-2" />
          </div>
        </header>

        <div id="navbar" className="flex justify-between items-center mx-16 mt-4 font-bold">
          <h1 className="text-[#51793E] font-bold text-5xl">RB Store</h1>
          <nav className="flex items-center gap-10">
            <Link href="/" className="bg-[#51793E] text-white rounded-3xl px-8 py-2">Home</Link>
            <Link href="/menu">Browser Menu</Link>
            <Link href="/offer">Special Offers</Link>
            <Link href="/order">Track Order</Link>
          </nav>
          <div className="flex bg-black text-white rounded-4xl px-6 py-3">
            <img src="/svg/male.svg" alt="user" className="pr-2" />
            <Link href="/login">Login</Link>/
            <Link href="/register">Register</Link>
          </div>
        </div>

        <div id="jumbotron" className="bg-[#FBFBFB] border rounded-2xl relative h-[38rem] mt-3 mx-16 overflow-hidden">
          <img src="/img/klepon.png" alt="" className="absolute top-[60%] left-[50%] translate-y-[-50%] translate-x-[-50%] z-10" />
          <div className="absolute bg-[#51793E] rounded-tl-[45%] w-[45%] h-full right-0 top-10"></div>
          <div className="absolute right-30 top-30 bg-white rounded-2xl p-4 w-96">
            <div className="relative">
              <div className="flex justify-between">
                <h1 className="text-[#51793E] font-bold text-xl">RB Store</h1>
                <p>now</p>
              </div>
                <p>We've Reached your order!</p>
              <div className="flex">
                <p>Awaiting Restaurant acceptance</p>
                <img src="/svg/tracking.svg" alt="" />
              </div>
              <div className="absolute right-1 -top-20 outline-text text-7xl font-bold">1</div>
            </div>
          </div>
          <div className="absolute right-5 bottom-55 bg-white rounded-2xl p-4 w-96">
            <div className="relative">
              <div className="flex justify-between">
                <h1 className="text-[#51793E] font-bold text-xl">RB Store</h1>
                <p>now</p>
              </div>
              <p>Order Accepted! ✅</p>
              <p>Your order will be delivered shortly</p>
              <div className="absolute right-1 -top-20 outline-text text-7xl font-bold">2</div>
            </div>
          </div>
          <div className="absolute right-20 bottom-10 bg-white rounded-2xl p-4 w-96">
            <div className="relative">
              <div className="flex justify-between">
                <h1 className="text-[#51793E] font-bold text-xl">RB Store</h1>
                <p>now</p>
              </div>
              <p>Your rider nearby 🎉</p>
              <p>They're almost here - get ready!</p>
              <div className="absolute right-1 -top-20 outline-text text-7xl font-bold">3</div>
            </div>
          </div>

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
        </div>

        <div id="slide-show" className="mx-16">
          <div id="hero-section">
            <div id="nav" className="flex justify-between items-center mt-10">
              <h1 className="font-bold text-3xl">Up to -40%🎊RB Store exclusive deals</h1>
              <div className="flex items-center">
                <Link href="#" className="px-13">Gorengan</Link>
                <Link href="#" className="px-13">Kue Kering</Link>
                <Link href="#" className="border border-green-300 px-13 py-2 rounded-4xl">Kue Basah</Link>
                <Link href="#" className="px-13">others</Link>
              </div>
            </div>
            <div className="flex overflow-auto gap-2.5 mt-6">
              <div className="relative h-60 rounded-2xl w-full bg-[url('/img/dadar-gulung.png')] bg-cover bg-center">
                <h1 className="text-[#51793E] pl-10 pt-44">Kue Basah</h1>
                <p className="font-bold pl-10 text-2xl text-white">Dadar Gulung</p>
                <div className="absolute bg-black w-20 h-14 right-4 top-0 text-white font-bold rounded-b-2xl flex justify-center items-center">-40%</div>
              </div>
              <div className="relative h-60 rounded-2xl w-full bg-[url('/img/cucur.png')] bg-cover bg-center">
                <h1 className="text-[#51793E] pl-10 pt-44">Kue Basah</h1>
                <p className="font-bold pl-10 text-2xl text-white">Kue Cucur</p>
                <div className="absolute bg-black w-20 h-14 right-4 top-0 text-white font-bold rounded-b-2xl flex justify-center items-center">-40%</div>
              </div>
              <div className="relative h-60 rounded-2xl w-full bg-[url('/img/koci-koci.png')] bg-cover bg-center">
                <h1 className="text-[#51793E] pl-10 pt-44">Kue Basah</h1>
                <p className="font-bold pl-10 text-2xl text-white">Koci-koci</p>
                <div className="absolute bg-black w-20 h-14 right-4 top-0 text-white font-bold rounded-b-2xl flex justify-center items-center">-40%</div>
              </div>
            </div>
          </div>

          <div id="categories" className="mt-10">
            <h1 className="font-bold text-3xl">RB Store Popular Categories 🤩</h1>
            <div className="flex gap-3 mt-6">
              <div className="card">
                <img src="/img/categories/kue-basah.png" alt="kue" />
                <div className="p-4 bg-[#F5F5F5]">
                  <h1 className="font-bold">Kue Basah</h1>
                  <span className="text-[#FC8A06]">21 Restaurant</span>
                </div>
              </div>
              <div className="card">
                <img src="/img/categories/kue-kering.png" alt="kue" />
                <div className="p-4 bg-[#F5F5F5]">
                  <h1 className="font-bold">Kue Kering</h1>
                  <span className="text-[#FC8A06]">32 Restaurant</span>
                </div>
              </div>
              <div className="card">
                <img src="/img/categories/kue-modern.png" alt="kue" />
                <div className="p-4 bg-[#F5F5F5]">
                  <h1 className="font-bold">Kue Modern</h1>
                  <span className="text-[#FC8A06]">4 Restaurant</span>
                </div>
              </div>
              <div className="card">
                <img src="/img/categories/gorengan.png" alt="kue" />
                <div className="p-4 bg-[#F5F5F5]">
                  <h1 className="font-bold">Gorengan</h1>
                  <span className="text-[#FC8A06]">32 Restaurant</span>
                </div>
              </div>
              <div className="card">
                <img src="/img/categories/minuman.png" alt="kue" />
                <div className="p-4 bg-[#F5F5F5]">
                  <h1 className="font-bold">Minuman</h1>
                  <span className="text-[#FC8A06]">4 Restaurant</span>
                </div>
              </div>
              <div className="card">
                <img src="/img/categories/puding.png" alt="kue" />
                <div className="p-4 bg-[#F5F5F5]">
                  <h1 className="font-bold">Puding</h1>
                  <span className="text-[#FC8A06]">32 Restaurant</span>
                </div>
              </div>
            </div>
          </div>
          <div id="us" className="mt-10">
            <h1 className="font-bold text-3xl">Why Choose Us?</h1>
            <div className="flex gap-3 mt-6">
              <div className="card bg-[#51793E] rounded-2xl">
                <img src="/us.png" alt="kue" className="rounded-2xl" />
                <div className="flex justify-center items-center text-white font-bold rounded-b-2xl p-4">
                  <h1>Warisan Nusantara</h1>
                </div>
              </div>
              <div className="card bg-[#51793E] rounded-2xl">
                <img src="/us.png" alt="kue" className="rounded-2xl" />
                <div className="flex justify-center items-center text-white font-bold rounded-b-2xl p-4">
                  <h1>Warisan Nusantara</h1>
                </div>
              </div>
              <div className="card bg-[#51793E] rounded-2xl">
                <img src="/us.png" alt="kue" className="rounded-2xl" />
                <div className="flex justify-center items-center text-white font-bold rounded-b-2xl p-4">
                  <h1>Warisan Nusantara</h1>
                </div>
              </div>
              <div className="card bg-[#51793E] rounded-2xl">
                <img src="/us.png" alt="kue" className="rounded-2xl" />
                <div className="flex justify-center items-center text-white font-bold rounded-b-2xl p-4">
                  <h1>Warisan Nusantara</h1>
                </div>
              </div>
              <div className="card bg-[#51793E] rounded-2xl">
                <img src="/us.png" alt="kue" className="rounded-2xl" />
                <div className="flex justify-center items-center text-white font-bold rounded-b-2xl p-4">
                  <h1>Warisan Nusantara</h1>
                </div>
              </div>
              <div className="card bg-[#51793E] rounded-2xl">
                <img src="/us.png" alt="kue" className="rounded-2xl" />
                <div className="flex justify-center items-center text-white font-bold rounded-b-2xl p-4">
                  <h1>Warisan Nusantara</h1>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div id="personalized" className="mx-16">
          <div className="relative bg-neutral-200 mt-20 w-full h-[35rem] rounded-2xl">
            <img
              src="/img/people/2ppl-O.png"
              alt="people"
              className="absolute h-[105%] bottom-3 -left-2 z-0"
            />
            <img
              src="/img/people/2ppl.png"
              alt="people"
              className="absolute h-[105%] bottom-0 left-2 z-0"
            />
          <div className="flex flex-col ml-[40%] mr-20 items-end">
            <div className="flex items-center pt-40 mb-4 pr-8">
              <img src="/svg/order.svg" alt="order" />
              <h1 className="font-bold text-black text-6xl">ing is more</h1>
            </div>
            <div className="flex justify-end text-5xl rounded-full bg-black p-5 pb-6 pr-12 w-full">
              <h1 className="text-white">
                <span className="underline text-[#FC8A06]">Personalised</span> & Instant
              </h1>
            </div>
            <h1 className="pr-20 py-4 text-[1.2rem]">Download the Order.uk app for faster ordering</h1>
            <img src="/img/googleApp.png" alt="" className="pr-15"/>
          </div>
          </div>
        </div>

        <div id="about" className="h-screen bg-neutral-200 mx-16 mt-20 p-24 rounded-2xl">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Know more about us!</h1>
            <div className="flex items-center gap-2">
              <Link href="#" className="font-bold rounded-full border border-green-700 p-4">Frequent Questions</Link>
              <Link href="#" className="p-4">Who are we?</Link>
              <Link href="#" className="p-4">Help & Support</Link>
            </div>
          </div>
          <div className="flex bg-white rounded-2xl p-1 mt-10">
            <div className="flex flex-col px-4 py-6 items-center font-bold">
                <Link href="#" className="px-10 py-4 text-center bg-[#51793E] rounded-full">How Does Order.UK work?</Link>
                <Link href="#" className="px-10 py-4 text-center">What payment methods are accepted?</Link>
                <Link href="#" className="px-10 py-4 text-center">Can I track my order in real-time?</Link>
                <Link href="#" className="px-10 py-4 text-center">Are there any special discounts or promotion available?</Link>
                <Link href="#" className="px-10 py-4 text-center">Is Order.UK available in my area?</Link>
            </div>
            <div className="flex flex-col mt-10">
              <div className="flex gap-3 mr-4">
                <div className="card flex flex-col items-center p-10 bg-neutral-200 rounded-2xl">
                  <h1 className="font-bold">Place an Order!</h1>
                  <img src="/svg/about/place-order.svg" alt="" />
                  <p>Place order through our website or mobile app</p>
                </div>
                <div className="card flex flex-col items-center p-10 bg-neutral-200 rounded-2xl">
                  <h1 className="font-bold">Place an Order!</h1>
                  <img src="/svg/about/track-order.svg" alt="" />
                  <p>Place order through our website or mobile app</p>
                </div>
                <div className="card flex flex-col items-center p-10 bg-neutral-200 rounded-2xl">
                  <h1 className="font-bold">Place an Order!</h1>
                  <img src="/svg/about/get-order.svg" alt="" />
                  <p>Place order through our website or mobile app</p>
                </div>
              </div>
              <p className="mt-10 px-10 text-center">Order.UK simplifies the food ordering process. Browse through our diverse menu, select your favorite dishes, and proceed to checkout. Your delicious meal will be on its way to your doorstep in no time!</p>
            </div>
          </div>
        </div>

        <div id="details" className="mx-16">
          <div className="flex h-32 justify-around bg-[#51793E] mt-10 rounded-2xl">
            <div className="text-center text-white font-bold py-6">
              <h1 className="text-5xl">789,900+</h1>
              <p>Orders Delivered</p>
            </div>

            <div className="h-full w-[1px] bg-white"></div>

            <div className="text-center text-white font-bold py-6">
              <h1 className="text-5xl">17,457+</h1>
              <p>Food items</p>
            </div>
          </div>
        </div>

        <footer className="flex flex-col mt-10">
          <div className="flex justify-between px-20 pt-20 pb-10 bg-[#D9D9D9] w-full">
            <div className="flex flex-col">
              <img src="/svg/order-2.svg" alt="order" />
              <img src="/img/googleApp.png" alt="google play and app store" />
              <p>Company # 490039-445, Registered with House of companies.</p>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold">Get Exclusive Deals in your Inbox</h1>
              <form action="">
                <div className="relative h-10 w-96 mt-3">
                  <input
                    type="text"
                    placeholder="youremail@gmail.com"
                    className="border font-bold border-gray-500 px-4 py-2 w-full rounded-4xl h-full"
                    maxLength={25}
                  />
                  <button type="button"
                    className="absolute font-bold text-white py-2 px-10 rounded-4xl bg-[#51793E] right-0 h-full">
                      Search
                  </button>
                </div>
              </form>
              <p className="ml-4">we wont spam, read our email policy</p>
              <div className="flex ml-4 mt-4 gap-4">
                <img src="/svg/icons/Facebook.svg" alt="Facebook" />
                <img src="/svg/icons/Instagram.svg" alt="Instagram" />
                <img src="/svg/icons/TikTok.svg" alt="TikTok" />
                <img src="/svg/icons/Snapchat.svg" alt="Snapchat" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="font-bold">Legal Pages</h1>
              <Link href="#" className="underline">Terms and conditions</Link>
              <Link href="#" className="underline">Privacy</Link>
              <Link href="#" className="underline">Cookies</Link>
              <Link href="#" className="underline">Modern Slavery Statement</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h1 className="font-bold">Important Links</h1>
              <Link href="#" className="underline">Get help</Link>
              <Link href="#" className="underline">Add your restaurant</Link>
              <Link href="#" className="underline">Sign up to deliver</Link>
              <Link href="#" className="underline">Create a business account</Link>
            </div>
          </div>
          <div className="flex justify-between bg-black w-full px-20 py-5">
            <h1 className="text-white">Order.uk Copyright 2024, All Rights Reserved.</h1>
            <div className="flex gap-4 text-white">
              <p>Privacy Policy</p>
              <p>Terms</p>
              <p>Pricing</p>
              <p>Do not sell or share my personal infromation</p>
            </div>
          </div>
        </footer>
    </>
  );
}

export default Home;