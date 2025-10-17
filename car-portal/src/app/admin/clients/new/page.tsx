'use client';

import { useFormState } from 'react-dom';
import { createClient } from '@/app/actions/clientActions'; // This action will be created next
import Link from 'next/link';

const initialState = {
  message: '',
  success: false,
};

export default function NewClientPage() {
  const [state, formAction] = useFormState(createClient, initialState);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Añadir Nuevo Cliente</h1>

      {state.success ? (
        <div className="p-4 text-sm text-green-700 bg-green-100 rounded-lg">
          <p>{state.message}</p>
          <Link href="/admin/clients" className="font-bold hover:underline mt-2 inline-block">
            Volver al listado de clientes
          </Link>
        </div>
      ) : (
        <form action={formAction} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre del Cliente (Concesionario)
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email del Administrador del Cliente
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña Temporal
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {state.message && !state.success && (
            <p className="text-sm text-red-600">{state.message}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Crear Cliente
            </button>
            <Link href="/admin/clients" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancelar
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}