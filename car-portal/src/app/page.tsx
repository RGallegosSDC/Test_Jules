import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// This component will display a single car card
function CarCard({ car }: { car: any }) {
  return (
    <Link href={`/car/${car.id}`} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
        {/* We will use a placeholder image for now */}
        <span className="text-gray-500">Imagen no disponible</span>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{car.make} {car.model}</h3>
        <p className="text-lg font-semibold text-blue-600">${car.price.toLocaleString()}</p>
        <p className="text-sm text-gray-600">{car.year}</p>
      </div>
    </Link>
  );
}

// The main page component that fetches and displays all cars
export default async function HomePage() {
  // Fetch all cars from the database
  const cars = await prisma.car.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Portal de Autos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </main>
  );
}