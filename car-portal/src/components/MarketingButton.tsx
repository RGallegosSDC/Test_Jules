'use client';

import { generateMarketingPost } from '@/app/actions/carActions';
import { useState } from 'react';

export default function MarketingButton({ carId }: { carId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await generateMarketingPost(carId);
      if (result.error) {
        alert(`Error: ${result.error}`);
      } else {
        // Show the generated post in an alert for this proof of concept
        alert('--- Borrador de Publicación para Redes Sociales ---\n\n' + result.success);
      }
    } catch (e) {
      alert('Ocurrió un error al contactar con el servidor.');
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="text-sm bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700 disabled:bg-purple-300"
    >
      {isLoading ? 'Generando...' : 'Generar Post'}
    </button>
  );
}