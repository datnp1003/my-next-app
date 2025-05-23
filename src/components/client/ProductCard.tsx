import Image from 'next/image';

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
}

export default function ProductCard({ image, name, price }: ProductCardProps) {
  return (
    <div className="group relative">
      <div className="aspect-w-4 aspect-h-5 w-full overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
        </div>
        <p className="text-sm font-semibold text-rose-500">{price}</p>
      </div>
    </div>
  );
}