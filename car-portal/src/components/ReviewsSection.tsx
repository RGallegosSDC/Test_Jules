import type { Comment, Rating, User } from '@prisma/client';

interface CommentWithUser extends Comment {
  user: { name: string | null; email: string };
}

interface ReviewsSectionProps {
  comments: CommentWithUser[];
  ratings: Rating[];
  carId: string;
}

// Componente para mostrar estrellas de valoración
const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="text-yellow-400 text-2xl">★</span>)}
      {halfStar && <span className="text-yellow-400 text-2xl">☆</span>}
      {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="text-gray-300 text-2xl">☆</span>)}
    </div>
  );
};


import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ReviewForm from './ReviewForm';
import Link from 'next/link';

export default async function ReviewsSection({ comments, ratings, carId }: ReviewsSectionProps) {
  const session = await getServerSession(authOptions);

  const totalRatings = ratings.length;
  const averageRating = totalRatings > 0
    ? ratings.reduce((sum, r) => sum + r.value, 0) / totalRatings
    : 0;

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Opiniones de la Comunidad</h2>

      {/* Resumen de Valoraciones */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 flex flex-col md:flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Valoración General</h3>
          <p className="text-gray-600">{totalRatings} {totalRatings === 1 ? 'opinión' : 'opiniones'}</p>
        </div>
        <div className="flex items-center mt-4 md:mt-0">
          <span className="text-4xl font-bold mr-4">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} />
        </div>
      </div>

      {/* Formulario para nuevos comentarios */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Deja tu opinión</h3>
        {session?.user ? (
          <ReviewForm carId={carId} />
        ) : (
          <div className="p-4 border rounded-lg bg-gray-50 text-center">
            <p><Link href="/auth/signin" className="font-bold text-primary hover:underline">Inicia sesión</Link> para dejar tu opinión.</p>
          </div>
        )}
      </div>


      {/* Lista de Comentarios */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b pb-6">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="font-bold text-gray-600">{comment.user.name?.charAt(0) || comment.user.email.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold">{comment.user.name || 'Usuario Anónimo'}</p>
                  <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700">{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Todavía no hay comentarios para este auto. ¡Sé el primero!</p>
        )}
      </div>
    </div>
  );
}