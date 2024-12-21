import Image from 'next/image'
import MarkdownPreview from '@uiw/react-markdown-preview';
import rehypeSanitize from "rehype-sanitize";

interface ProductPreviewProps {
  product: {
    name: string
    details: string
    images: File[]
    description: string
  }
}

export function ProductPreview({ product }: ProductPreviewProps) {

  const rehypePlugins = [rehypeSanitize];

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{product.name}</h2>
      {product.images.length > 0 && (
        <div className="mb-4">
          <Image
            src={URL.createObjectURL(product.images[0])}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}
      <p className="text-gray-600 mb-4">{product.details}</p>
      {/* <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: product.description }}
      /> */}
      <MarkdownPreview
        rehypePlugins={rehypePlugins}
        className="prose max-w-none"
        source={product.description}
        style={{ padding: 16 }}
      />
    </div>
  )
}

