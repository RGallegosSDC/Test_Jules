import { prisma } from '@/lib/prisma';
import { deleteClient } from '@/app/actions/clientActions';
import Link from 'next/link';

export default async function ManageClientsPage() {
  const clients = await prisma.client.findMany({
    include: {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Clientes</h1>
        <Link href="/admin/clients/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          + Añadir Cliente
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email del Admin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autos Listados</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={deleteClient} className="inline-block">
                    <input type="hidden" name="clientId" value={client.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">
                      Eliminar
                    </button>
                  </form>
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