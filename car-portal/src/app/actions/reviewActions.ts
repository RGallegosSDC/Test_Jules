'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@prisma/client';

interface FormState {
  message: string;
  success: boolean;
}

export async function submitReview(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getServerSession(authOptions);

  // 1. Autenticación: El usuario debe estar logueado.
  if (!session?.user?.id) {
    return { message: 'Debes iniciar sesión para dejar una opinión.', success: false };
  }

  const carId = formData.get('carId') as string;
  const ratingValue = formData.get('rating') as string;
  const commentText = formData.get('comment') as string;

  if (!carId || !ratingValue) {
    return { message: 'La valoración es obligatoria.', success: false };
  }

  const rating = parseInt(ratingValue, 10);

  try {
    // 2. Transacción para crear o actualizar la valoración y crear el comentario.
    await prisma.$transaction(async (tx) => {
      // Usamos `upsert` para la valoración. Si el usuario ya ha votado, actualiza su voto.
      // Si no, crea uno nuevo.
      await tx.rating.upsert({
        where: { carId_userId: { carId, userId: session.user.id } },
        update: { value: rating },
        create: {
          value: rating,
          carId: carId,
          userId: session.user.id,
        },
      });

      // Si hay un comentario, lo crea.
      if (commentText.trim()) {
        await tx.comment.create({
          data: {
            text: commentText,
            carId: carId,
            userId: session.user.id,
          },
        });
      }
    });

    // 3. Revalidar la página del auto para mostrar la nueva opinión.
    revalidatePath(`/car/${carId}`);
    return { message: '¡Gracias por tu opinión!', success: true };

  } catch (error) {
    console.error('Error al enviar la opinión:', error);
    return { message: 'No se pudo enviar tu opinión. Por favor, inténtalo de nuevo.', success: false };
  }
}