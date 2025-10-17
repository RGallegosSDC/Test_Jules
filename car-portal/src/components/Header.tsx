'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isLoading = status === 'loading';

  // Do not render header for admin panel routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          CarPortal
        </Link>
        <div className="flex items-center space-x-4">
          {isLoading ? (
            <div className="text-gray-500">Cargando...</div>
          ) : session ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <span className="text-gray-700">Hola, {session.user?.name ?? session.user?.email}</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}