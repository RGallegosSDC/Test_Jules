'use client';

import { useFormState } from 'react-dom';
import { createAlert } from '@/app/actions/alertActions';
import { useEffect, useRef } from 'react';

const initialState = {
  message: '',
  success: false,
};

export default function AlertForm() {
  const [state, formAction] = useFormState(createAlert, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">Marca</label>
          <input type="text" name="make" id="make" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
          <input type="text" name="model" id="model" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">Precio Máximo ($)</label>
          <input type="number" name="maxPrice" id="maxPrice" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
        <div>
          <label htmlFor="minYear" className="block text-sm font-medium text-gray-700">Año Mínimo</label>
          <input type="number" name="minYear" id="minYear" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
        </div>
      </div>

      {state.message && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
      )}

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Crear Alerta
        </button>
      </div>
    </form>
  );
}