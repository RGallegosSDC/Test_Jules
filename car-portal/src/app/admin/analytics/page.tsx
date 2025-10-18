import { prisma } from '@/lib/prisma';
import CarsByMakeChart from '@/components/analytics/CarsByMakeChart';
import AveragePriceByYearChart from '@/components/analytics/AveragePriceByYearChart';

export default async function AnalyticsPage() {
  // 1. Consulta para distribución de autos por marca
  const carsByMake = await prisma.car.groupBy({
    by: ['make'],
    _count: {
      make: true,
    },
    orderBy: {
      _count: {
        make: 'desc',
      },
    },
  });
  const carsByMakeData = carsByMake.map(item => ({
    name: item.make,
    value: item._count.make,
  }));

  // 2. Consulta para precio promedio por año
  const averagePriceByYear = await prisma.car.groupBy({
    by: ['year'],
    _avg: {
      price: true,
    },
    orderBy: {
      year: 'asc',
    },
  });
  const averagePriceByYearData = averagePriceByYear.map(item => ({
    year: item.year.toString(),
    "Precio Promedio": item._avg.price,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold">Análisis del Portal</h1>
      <p className="text-gray-600 mt-2">Una vista detallada del inventario y las tendencias.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
           <h2 className="text-xl font-semibold mb-4">Distribución de Autos por Marca</h2>
           <CarsByMakeChart data={carsByMakeData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Precio Promedio por Año</h2>
            <AveragePriceByYearChart data={averagePriceByYearData} />
        </div>
      </div>
    </div>
  );
}