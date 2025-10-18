'use client';

import { useFormState } from 'react-dom';
import { updateClient } from '@/app/actions/clientActions'; // Esta acción se creará a continuación
import type { Client, User } from '@prisma/client';
import Link from 'next/link';

const initialState = {
  message: '',
};

interface EditClientFormProps {
  client: Client;
  user: User;
}

export default function EditClientForm({ client, user }: EditClientFormProps) {
  const [state, formAction] = useFormState(updateClient, initialState);

  return (
    <form action={formAction} className="bg-white p-8 rounded-lg shadow-md space-y-6">
      <input type="hidden" name="clientId" value={client.id} />
      <input type="hidden" name="userId" value={user.id} />

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre del Cliente (Concesionario)
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          defaultValue={client.name}
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
          defaultValue={user.email ?? ''}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Nueva Contraseña (opcional)
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Dejar en blanco para no cambiar"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex justify-end space-x-4">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Guardar Cambios
        </button>
        <Link href="/admin/clients" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </Link>
      </div>
    </form>
  );
}