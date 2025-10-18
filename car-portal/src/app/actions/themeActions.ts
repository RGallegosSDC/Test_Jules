'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@prisma/client';

export async function updateTheme(formData: FormData): Promise<{ message: string }> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.SUPERADMIN) {
    return { message: 'No autorizado.' };
  }

  const primaryColor = formData.get('primaryColor') as string;

  if (!primaryColor || !/^#[0-9A-F]{6}$/i.test(primaryColor)) {
    return { message: 'Por favor, introduce un color hexadecimal válido (ej: #FF0000).' };
  }

  try {
    await prisma.themeSettings.update({
      where: { singleton: true },
      data: { primaryColor },
    });

    // Revalidar todo el sitio para que el nuevo tema se aplique en todas partes.
    revalidatePath('/', 'layout');

    return { message: '¡Tema actualizado con éxito!' };
  } catch (error) {
    console.error('Error al actualizar el tema:', error);
    return { message: 'No se pudo actualizar el tema.' };
  }
}