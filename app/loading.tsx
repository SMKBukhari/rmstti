import Loading from "@/components/global/Loading";

function LoadingMain() {
  return (
    <div
      className='flex justify-center items-center w-full h-[100vh]'
      suppressHydrationWarning
    >
      <Loading />
    </div>
  );
}

export default LoadingMain;
