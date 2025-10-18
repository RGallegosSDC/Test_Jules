'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface FormState {
  message: string;
  success: boolean;
}

export async function createAlert(prevState: FormState, formData: FormData): Promise<FormState> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { message: 'Debes iniciar sesión para crear una alerta.', success: false };
  }

  const make = formData.get('make') as string || undefined;
  const model = formData.get('model') as string || undefined;
  const maxPriceStr = formData.get('maxPrice') as string;
  const minYearStr = formData.get('minYear') as string;

  const maxPrice = maxPriceStr ? parseInt(maxPriceStr, 10) : undefined;
  const minYear = minYearStr ? parseInt(minYearStr, 10) : undefined;

  if (!make && !model && !maxPrice && !minYear) {
    return { message: 'Debes especificar al menos un criterio para la alerta.', success: false };
  }

  try {
    await prisma.alert.create({
      data: {
        userId: session.user.id,
        make,
        model,
        maxPrice,
        minYear,
      },
    });
    revalidatePath('/dashboard/alerts');
    return { message: 'Alerta creada con éxito.', success: true };
  } catch (error) {
    console.error('Error al crear la alerta:', error);
    return { message: 'No se pudo crear la alerta.', success: false };
  }
}

export async function deleteAlert(formData: FormData) {
  const session = await getServerSession(authOptions);
  const alertId = formData.get('alertId') as string;

  if (!session?.user?.id || !alertId) {
    throw new Error('Operación no permitida.');
  }

  const alert = await prisma.alert.findUnique({
    where: { id: alertId },
  });

  // Asegurarse de que el usuario solo borre sus propias alertas
  if (alert?.userId !== session.user.id) {
    throw new Error('No tienes permiso para borrar esta alerta.');
  }

  await prisma.alert.delete({
    where: { id: alertId },
  });

  revalidatePath('/dashboard/alerts');
}