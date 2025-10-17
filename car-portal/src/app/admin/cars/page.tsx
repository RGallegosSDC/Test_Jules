import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteCar } from '@/app/actions/carActions';

export default async function ManageAllCarsPage() {
  const cars = await prisma.car.findMany({
    include: {
      // Include the client (dealership) name for each car
      client: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ver Todos los Autos</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca y Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente (Vendedor)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Publicación</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{car.make} {car.model}</div>
                   <div className="text-sm text-gray-500">{car.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{car.client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-green-600">${car.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(car.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/car/${car.id}`} target="_blank" className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Ver Anuncio
                  </Link>
                  <form action={deleteCar} className="inline-block">
                    <input type="hidden" name="carId" value={car.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {cars.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No hay autos listados en la plataforma.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}