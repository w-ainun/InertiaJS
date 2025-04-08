// type StoreStatsProps = {
//   label: string;
//   value: string;
// };

const StoreStats = ({ ...props }) => {
  return (
    <section aria-label="store statistics" { ...props }>
      <div className="mt-10 flex h-32 justify-around rounded-2xl bg-[#51793E]">
        <div className="py-6 text-center font-bold text-white">
          <h1 className="text-5xl">789,900+</h1>
          <p>Orders Delivered</p>
        </div>

        <div className="h-full w-[1px] bg-white"></div>

        <div className="py-6 text-center font-bold text-white">
          <h1 className="text-5xl">17,457+</h1>
          <p>Food items</p>
        </div>
      </div>
    </section>
  );
};

export default StoreStats;