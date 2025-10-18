'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateTheme } from '@/app/actions/themeActions';
import type { ThemeSettings } from '@prisma/client';
import { useEffect, useState } from 'react';

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
      {pending ? 'Guardando...' : 'Guardar Cambios'}
    </button>
  );
}

export default function ThemeForm({ settings }: { settings: ThemeSettings }) {
  const [state, formAction] = useFormState(updateTheme, initialState);
  const [color, setColor] = useState(settings.primaryColor);

  useEffect(() => {
    // Si hay un error, no actualices el color local para no perder la entrada del usuario
    if (state.message.includes('éxito')) {
        // Opcional: mostrar un toast o un mensaje más persistente
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
          Color Primario del Tema
        </label>
        <div className="mt-1 flex items-center space-x-3">
          <input
            type="color"
            name="primaryColor-picker"
            id="primaryColor-picker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-12 h-12 rounded-md border-gray-300"
          />
          <input
            type="text"
            name="primaryColor"
            id="primaryColor"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="#3B82F6"
          />
        </div>
      </div>

      {state.message && (
        <p className={`text-sm ${state.message.includes('éxito') ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}