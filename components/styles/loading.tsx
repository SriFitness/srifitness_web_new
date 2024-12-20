import Image from 'next/image'

interface LoadingProps {
  size?: number
}

export function Loading({ size = 50 }: LoadingProps) {
  return (
    <div className="flex justify-center items-center">
      <Image
        src="/loading.gif"
        alt="Loading..."
        width={size}
        height={size}
        className="object-contain"
      />
    </div>
  )
}

