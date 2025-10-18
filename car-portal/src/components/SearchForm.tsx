'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent } from 'react';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());

    const fields = ['query', 'minPrice', 'maxPrice', 'minYear', 'maxYear'];
    fields.forEach(field => {
        const value = formData.get(field) as string;
        if (value) {
            params.set(field, value);
        } else {
            params.delete(field);
        }
    });

    router.push(`/?${params.toString()}`);
  };

  const handleClear = () => {
    router.push('/');
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="query" className="block text-sm font-medium text-gray-700">
            Marca o Modelo
          </label>
          <input
            type="text"
            name="query"
            id="query"
            defaultValue={searchParams.get('query') || ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ej: Toyota Camry"
          />
        </div>
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
            Precio Mín.
          </label>
          <input
            type="number"
            name="minPrice"
            id="minPrice"
            defaultValue={searchParams.get('minPrice') || ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 5000"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
            Precio Máx.
          </label>
          <input
            type="number"
            name="maxPrice"
            id="maxPrice"
            defaultValue={searchParams.get('maxPrice') || ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="e.g. 20000"
          />
        </div>
        <div>
          <label htmlFor="minYear" className="block text-sm font-medium text-gray-700">
            Año Mín.
          </label>
          <input
            type="number"
            name="minYear"
            id="minYear"
            defaultValue={searchParams.get('minYear') || ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="1990"
          />
        </div>
        <div>
          <label htmlFor="maxYear" className="block text-sm font-medium text-gray-700">
            Año Máx.
          </label>
          <input
            type="number"
            name="maxYear"
            id="maxYear"
            defaultValue={searchParams.get('maxYear') || ''}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="2024"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button
            type="button"
            onClick={handleClear}
            className="w-full sm:w-auto justify-center py-2 px-8 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Limpiar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto justify-center py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}