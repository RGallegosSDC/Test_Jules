import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  // Fetch aggregate data for the dashboard
  const totalClients = await prisma.client.count();
  const totalCars = await prisma.car.count();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard del Administrador</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stat Card: Total Clients */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total de Clientes</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{totalClients}</p>
        </div>

        {/* Stat Card: Total Cars */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Total de Autos Listados</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalCars}</p>
        </div>

        {/* Placeholder for future stats */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Ingresos (Próximamente)</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">$0</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Bienvenido, Super Administrador</h2>
        <p className="text-gray-600">
          Desde este panel puedes gestionar todos los aspectos del portal. Usa la barra de navegación de la izquierda para ver todos los clientes, supervisar los listados de autos y, en el futuro, acceder a herramientas de marketing y configuración.
        </p>
      </div>
    </div>
  );
}