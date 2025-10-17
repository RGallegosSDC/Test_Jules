import { prisma } from '@/lib/prisma';

export default async function ManageClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
      // Include a count of cars for each client
      _count: {
        select: { cars: true },
      },
      users: {
        where: { role: 'CLIENT_ADMIN' },
        select: { email: true }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionar Clientes</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email del Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autos Listados</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{client.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{client.users[0]?.email ?? 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{client._count.cars}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{new Date(client.createdAt).toLocaleDateString()}</div>
                </td>
              </tr>
            ))}
             {clients.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                  No hay clientes registrados en la plataforma.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}