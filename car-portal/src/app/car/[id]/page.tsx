import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import type { Metadata, ResolvingMetadata } from 'next';
import FunFactCard from '@/components/ai/FunFactCard';
import ExpertReview from '@/components/ai/ExpertReview';
import StatsHighlight from '@/components/ai/StatsHighlight';

type Props = {
  params: { id: string };
};

// Esta función genera metadatos dinámicos para la página
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // busca datos
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    select: { make: true, model: true, year: true, seoTitle: true, seoDescription: true },
  });

  if (!car) {
    return {
      title: 'Auto no encontrado',
      description: 'El auto que buscas no está disponible.',
    };
  }

  const defaultTitle = `${car.make} ${car.model} ${car.year} en Venta`;
  const defaultDescription = `Mira este increíble ${car.make} ${car.model} del año ${car.year}. ¡Disponible ahora en nuestro portal!`;

  return {
    title: car.seoTitle || defaultTitle,
    description: car.seoDescription || defaultDescription,
  };
}


// Este es el componente principal de la página de detalle del auto
export default async function CarDetailPage({ params }: Props) {
  // Busca el auto específico en la base de datos, incluyendo la información generada por IA
  const car = await prisma.car.findUnique({
    where: { id: params.id },
    include: {
      carModelInfo: true, // Incluye el contenido de IA relacionado
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

  // Parsea las cadenas JSON a arreglos
  const images = typeof car.images === 'string' ? JSON.parse(car.images) : [];
  const funFacts = car.carModelInfo && typeof car.carModelInfo.funFacts === 'string' ? JSON.parse(car.carModelInfo.funFacts) : [];
  const positiveComments = car.carModelInfo && typeof car.carModelInfo.positiveComments === 'string' ? JSON.parse(car.carModelInfo.positiveComments) : [];
  const statistics = car.carModelInfo && typeof car.carModelInfo.statistics === 'string' ? JSON.parse(car.carModelInfo.statistics) : [];


  return (
    <main className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Galería de Imágenes */}
        <div className="p-4">
          <div className="w-full h-96 bg-gray-200 flex items-center justify-center mb-4 rounded-lg">
            {images.length > 0 ? (
              <img src={images[0]} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-500">Imagen no disponible</span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {images.slice(1).map((img: string, i: number) => (
              <div key={i} className="h-24 bg-gray-200 flex items-center justify-center rounded-lg">
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Información Principal */}
          <h1 className="text-4xl font-extrabold mb-2">{car.make} {car.model}</h1>
          <p className="text-2xl font-semibold text-blue-600 mb-4">${car.price.toLocaleString()}</p>
          <p className="text-lg text-gray-700 mb-6">{car.description}</p>

          {/* Sección de Contenido Generado por IA */}
          {car.carModelInfo && (
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Análisis por IA de nuestro portal</h2>
              <div className="space-y-8">
                <FunFactCard facts={funFacts} />
                <ExpertReview comments={positiveComments} />
                <StatsHighlight stats={statistics} />
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