import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Protect the entire admin area
  if (session?.user?.role !== UserRole.SUPERADMIN) {
    // Redirect to home page or a 'not authorized' page if not a superadmin
    redirect('/');
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4 h-screen">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link href="/admin" className="block p-2 rounded hover:bg-gray-700">
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/clients" className="block p-2 rounded hover:bg-gray-700">
                Gestionar Clientes
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/admin/cars" className="block p-2 rounded hover:bg-gray-700">
                Ver Todos los Autos
              </Link>
            </li>
             <li className="mb-2 mt-6">
              <Link href="/" className="block p-2 rounded hover:bg-gray-700">
                &larr; Volver al Portal
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}