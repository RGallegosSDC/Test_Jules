'use client';

import { useFormState } from 'react-dom';
import { updateCar } from '@/app/actions/carActions';
import type { Car } from '@prisma/client';
import ImageUploader from './ImageUploader';

const initialState = {
  message: '',
};

// La prop 'car' contiene los datos iniciales para rellenar el formulario
export default function EditCarForm({ car }: { car: Car }) {
  const [state, formAction] = useFormState(updateCar, initialState);

  // Las imágenes se almacenan como una cadena JSON, así que las parseamos para el cargador
  const initialImages = JSON.parse(car.images || '[]');

  return (
    <form action={formAction} className="bg-white p-8 rounded-lg shadow-md space-y-6">
      {/* Input oculto para pasar el ID del auto a la acción del servidor */}
      <input type="hidden" name="carId" value={car.id} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">Marca</label>
          <input type="text" name="make" id="make" required defaultValue={car.make} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input type="text" name="model" id="model" required defaultValue={car.model} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Año</label>
          <input type="number" name="year" id="year" required defaultValue={car.year} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio ($)</label>
          <input type="number" name="price" id="price" step="0.01" required defaultValue={car.price} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" id="description" rows={4} required defaultValue={car.description} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>

      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Imágenes</label>
        <ImageUploader name="images" initialImages={initialImages} />
      </div>

      {state.message && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <div className="flex justify-end space-x-4">
         <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90">
          Guardar Cambios
        </button>
         <a href="/dashboard" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancelar
        </a>
      </div>
    </form>
  );
}