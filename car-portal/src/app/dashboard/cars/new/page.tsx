'use client';

import { useFormState } from 'react-dom';
import { createCar } from '@/app/actions/carActions'; // We will create this action next

const initialState = {
  message: '',
};

export default function NewCarPage() {
  const [state, formAction] = useFormState(createCar, initialState);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Añadir Nuevo Auto</h1>

      <form action={formAction} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">Marca</label>
            <input type="text" name="make" id="make" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
            <input type="text" name="model" id="model" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">Año</label>
            <input type="number" name="year" id="year" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio ($)</label>
            <input type="number" name="price" id="price" step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea name="description" id="description" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>

        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">URLs de Imágenes (separadas por comas)</label>
          <input type="text" name="images" id="images" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        {state.message && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        <div className="flex justify-end space-x-4">
           <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Guardar Auto
          </button>
           <a href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}