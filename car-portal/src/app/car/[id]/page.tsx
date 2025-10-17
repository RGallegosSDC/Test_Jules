import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// This is the main component for the car detail page
export default async function CarDetailPage({ params }: { params: { id: string } }) {
  // Fetch the specific car from the database, including the AI-generated info
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: {
      carModelInfo: true, // Include the related AI content
    },
  });

  if (!car) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Auto no encontrado</h1>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Parse JSON strings into arrays
  const images = typeof car.images === 'string' ? JSON.parse(car.images) : [];
  const funFacts = car.carModelInfo && typeof car.carModelInfo.funFacts === 'string' ? JSON.parse(car.carModelInfo.funFacts) : [];
  const positiveComments = car.carModelInfo && typeof car.carModelInfo.positiveComments === 'string' ? JSON.parse(car.carModelInfo.positiveComments) : [];
  const statistics = car.carModelInfo && typeof car.carModelInfo.statistics === 'string' ? JSON.parse(car.carModelInfo.statistics) : [];


  return (
    <main className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Image Gallery */}
        <div className="p-4 bg-gray-200">
           <div className="w-full h-96 bg-gray-300 flex items-center justify-center">
             <span className="text-gray-500">Imagen Principal del Auto</span>
           </div>
        </div>

        <div className="p-6">
          {/* Main Info */}
          <h1 className="text-4xl font-extrabold mb-2">{car.make} {car.model}</h1>
          <p className="text-2xl font-semibold text-blue-600 mb-4">${car.price.toLocaleString()}</p>
          <p className="text-lg text-gray-700 mb-6">{car.description}</p>

          {/* AI-Generated Content Section */}
          {car.carModelInfo && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Lo que no sabías de tu próximo auto</h2>

              {/* Fun Facts */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-blue-700">Sabías que...</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {funFacts.map((fact: string, i: number) => <li key={i}>{fact}</li>)}
                </ul>
              </div>

              {/* Positive Comments */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-green-700">Nuestros expertos dicen...</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {positiveComments.map((comment: string, i: number) => <li key={i}>{comment}</li>)}
                </ul>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-purple-700">Estadísticas Clave</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {statistics.map((stat: string, i: number) => <li key={i}>{stat}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-100 border-t">
          <Link href="/" className="text-blue-500 hover:underline">
            &larr; Volver al listado de autos
          </Link>
        </div>
      </div>
    </main>
  );
}