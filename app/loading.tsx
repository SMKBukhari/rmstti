import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className='flex justify-center items-center w-full h-[100vh]' suppressHydrationWarning>
      <Loader2 size={64} className="animate-spin" />
    </div>
  );
}

export default Loading;
