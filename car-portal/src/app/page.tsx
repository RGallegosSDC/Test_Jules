import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';
import { Suspense } from 'react';

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

import { Prisma } from '@prisma/client';

interface HomePageProps {
  searchParams: {
    query?: string;
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
  };
}

// The main page component that fetches and displays all cars
export default async function HomePage({ searchParams }: HomePageProps) {
  const { query, minPrice, maxPrice, minYear, maxYear } = searchParams;

  const where: Prisma.CarWhereInput = {};

  if (query) {
    where.OR = [
      { make: { contains: query, mode: 'insensitive' } },
      { model: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (minPrice) {
    where.price = { ...where.price, gte: parseInt(minPrice, 10) };
  }
  if (maxPrice) {
    where.price = { ...where.price, lte: parseInt(maxPrice, 10) };
  }

  if (minYear) {
    where.year = { ...where.year, gte: parseInt(minYear, 10) };
  }
  if (maxYear) {
    where.year = { ...where.year, lte: parseInt(maxYear, 10) };
  }

  // Fetch cars from the database based on filters
  const cars = await prisma.car.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Portal de Autos</h1>

      <Suspense fallback={<div>Cargando filtros...</div>}>
        <SearchForm />
      </Suspense>

      {cars.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">No se encontraron autos con esos criterios.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </main>
  );
}