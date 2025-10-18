import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import AlertForm from '@/components/AlertForm';
import { deleteAlert } from '@/app/actions/alertActions';

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/dashboard/alerts');
  }

  const alerts = await prisma.alert.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mis Alertas de Búsqueda</h1>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Alerta</h2>
        <AlertForm />

        <hr className="my-8" />

        <h2 className="text-xl font-semibold mb-4">Alertas Activas</h2>
        {alerts.length > 0 ? (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li key={alert.id} className="p-4 border rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    Alerta para: {alert.make || 'Cualquier marca'} {alert.model || ''}
                  </p>
                  <p className="text-sm text-gray-500">
                    Precio Máx: ${alert.maxPrice?.toLocaleString() || 'N/A'}, Año Mín: {alert.minYear || 'N/A'}
                  </p>
                </div>
                <form action={deleteAlert}>
                  <input type="hidden" name="alertId" value={alert.id} />
                  <button type="submit" className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                    Eliminar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes ninguna alerta activa.</p>
        )}
      </div>
    </div>
  );
}