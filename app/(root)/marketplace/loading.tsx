import Image from "next/image"
import loadingGif from "@/public/loadingGif.gif"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <Image 
        src={loadingGif} 
        alt="Loading..." 
        width={250} // Adjust width as needed
        height={250} // Adjust height as needed
      />
    </div>
  );
}
