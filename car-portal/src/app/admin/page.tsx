import { prisma } from '@/lib/prisma';
import ClientCarChart from '@/components/ClientCarChart';

export default async function AdminDashboardPage() {
  // Fetch data for the chart
  const clientsWithCarCount = await prisma.client.findMany({
    include: {
      _count: {
        select: { cars: true },
      },
    },
  });

  const chartData = clientsWithCarCount.map(client => ({
    name: client.name,
    autos: client._count.cars,
  }));

  const totalCars = chartData.reduce((sum, client) => sum + client.autos, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard del Administrador</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stat Card: Total Clients */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total de Clientes</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">{chartData.length}</p>
        </div>

        {/* Stat Card: Total Cars */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Total de Autos Listados</h2>
          <p className="text-4xl font-bold text-green-600 mt-2">{totalCars}</p>
        </div>

        {/* Placeholder for future stats */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">Ingresos (Próximamente)</h2>
          <p className="text-4xl font-bold text-purple-600 mt-2">$0</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Distribución de Autos por Cliente</h2>
        <ClientCarChart data={chartData} />
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