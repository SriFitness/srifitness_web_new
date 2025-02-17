import Image from "next/image"
import loadingGif from "@/public/loadingGif.gif"

export default function AdminLoading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Image src={loadingGif} alt="logo" />
    </div>
  )
}