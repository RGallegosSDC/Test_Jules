'use client';

import Link from 'next/link';
import { createCheckoutSession, createCustomerPortalSession } from '@/app/actions/stripeActions';

interface DashboardHeaderProps {
  isSubscribed: boolean;
}

export default function DashboardHeader({ isSubscribed }: DashboardHeaderProps) {
  return (
    <div>
      {!isSubscribed ? (
        <div className="p-4 mb-6 text-yellow-800 bg-yellow-100 border-l-4 border-yellow-500 rounded-r-lg">
          <h2 className="font-bold">Cuenta Inactiva</h2>
          <p className="mb-2">Tu cuenta no tiene una suscripción activa. Por favor, activa tu cuenta para poder añadir nuevos autos y acceder a todas las funcionalidades.</p>
          <form action={createCheckoutSession}>
            <button type="submit" className="px-4 py-2 font-semibold bg-green-500 text-white rounded-md hover:bg-green-600">
              Activar Cuenta Ahora
            </button>
          </form>
        </div>
      ) : (
        <div className="p-4 mb-6 text-blue-800 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg">
           <h2 className="font-bold">Suscripción Activa</h2>
           <p className="mb-2">Gracias por ser un miembro activo. Puedes gestionar tu suscripción y facturación en cualquier momento.</p>
           <form action={createCustomerPortalSession}>
            <button type="submit" className="px-4 py-2 font-semibold bg-primary text-white rounded-md hover:opacity-90">
              Gestionar Suscripción y Facturación
            </button>
          </form>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mis Autos</h1>
        {isSubscribed ? (
          <Link
            href="/dashboard/cars/new"
            className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          >
            + Añadir Auto Nuevo
          </Link>
        ) : (
           <button
            disabled
            className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
          >
            + Añadir Auto Nuevo
          </button>
        )}
      </div>
    </div>
  );
}