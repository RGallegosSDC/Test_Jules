import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deleteCar } from '@/app/actions/carActions';
import MarketingButton from '@/components/MarketingButton';
import DashboardHeader from '@/components/DashboardHeader';

// This is a server component, so we can fetch data directly
export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.clientId) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.clientId },
    include: {
      cars: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!client) {
    return <div>Cliente no encontrado.</div>;
  }

  const cars = client.cars;
  const isSubscribed = client.subscriptionStatus === 'active';

  return (
    <div className="container mx-auto p-4">
      <DashboardHeader isSubscribed={isSubscribed} />

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca y Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Marketing IA</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{car.make} {car.model}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{car.year}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${car.price.toLocaleString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <MarketingButton carId={car.id} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/dashboard/cars/${car.id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Editar
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
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No tienes ningún auto listado. ¡Añade uno!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}