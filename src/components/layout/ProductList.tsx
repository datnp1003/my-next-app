import Image from 'next/image';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
}

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <>
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-medium mb-1">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.price.toLocaleString()}đ</p>
            {product.stock !== undefined && (
              <p className="text-sm text-gray-500 mb-2">
                Còn lại: {product.stock}
              </p>
            )}
            <button
              onClick={() => onAddToCart(product)}
              className="w-full bg-white text-sky-900 py-2 border border-sky-900 rounded hover:bg-sky-900 hover:text-white"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
