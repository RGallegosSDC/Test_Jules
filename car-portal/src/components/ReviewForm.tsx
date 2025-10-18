'use client';

import { useFormState } from 'react-dom';
import { submitReview } from '@/app/actions/reviewActions';
import { useState, useEffect } from 'react';

const initialState = {
  message: '',
  success: false,
};

// Componente para las estrellas interactivas del formulario
const StarInput = ({ rating, setRating }: { rating: number; setRating: (r: number) => void }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label key={ratingValue} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => setRating(ratingValue)}
              className="hidden"
            />
            <span className={`text-3xl ${ratingValue <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          </label>
        );
      })}
    </div>
  );
};

export default function ReviewForm({ carId }: { carId: string }) {
  const [state, formAction] = useFormState(submitReview, initialState);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Limpiar el formulario si la opinión se envió con éxito
    if (state.success) {
      setRating(0);
      setComment('');
    }
  }, [state]);

  return (
    <form action={formAction} className="bg-white p-6 border rounded-lg space-y-4">
      <input type="hidden" name="carId" value={carId} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tu valoración*</label>
        <StarInput rating={rating} setRating={setRating} />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Tu comentario (opcional)</label>
        <textarea
          name="comment"
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Comparte tu experiencia con este auto..."
        ></textarea>
      </div>

      {state.message && (
        <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90 disabled:opacity-50"
          disabled={rating === 0}
        >
          Enviar Opinión
        </button>
      </div>
    </form>
  );
}