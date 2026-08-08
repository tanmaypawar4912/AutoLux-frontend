const LoadingScreen = () => {
  return (
    <div className="
      fixed
      inset-0
      z-[9999]
      flex
      items-center
      justify-center
      bg-[#111111]
    ">

      <div className="text-center">

        <div className="
          text-4xl
          font-black
          text-white
        ">
          Auto<span className="text-[#ff4054]">Lux</span>
        </div>


        <div className="
          mx-auto
          mt-6
          h-1
          w-32
          overflow-hidden
          rounded-full
          bg-white/10
        ">

          <div className="
            h-full
            w-1/2
            animate-[loading_1.2s_ease-in-out_infinite]
            rounded-full
            bg-[#ff4054]
          " />

        </div>


        <p className="
          mt-4
          text-xs
          uppercase
          tracking-[0.3em]
          text-gray-500
        ">
          Premium Automotive
        </p>

      </div>

    </div>
  );
};

export default LoadingScreen;