import Image from "next/image"
import loadingGif from "@/public/loadingGif.gif"

export default function AdminLoading() {
  return (
    <Image src={loadingGif} alt="logo" />
  )
}
