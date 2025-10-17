'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCar(prevState: { message: string }, formData: FormData) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || !session.user?.clientId) {
    return { message: 'No autorizado. Por favor, inicie sesión.' };
  }

  const make = formData.get('make') as string;
  const model = formData.get('model') as string;
  const year = Number(formData.get('year'));
  const price = Number(formData.get('price'));
  const description = formData.get('description') as string;
  const images = (formData.get('images') as string).split(',').map(url => url.trim()).filter(url => url);

  if (!make || !model || !year || !price || !description) {
    return { message: 'Todos los campos marcados con * son obligatorios.' };
  }

  try {
    // @ts-ignore
    const clientId = session.user.clientId;

    await prisma.car.create({
      data: {
        make,
        model,
        year,
        price,
        description,
        images: JSON.stringify(images), // Store images as a JSON string
        clientId,
      },
    });
  } catch (e) {
    console.error(e);
    return { message: 'Error al crear el auto en la base de datos.' };
  }

  // Revalidate the dashboard path to show the new car
  revalidatePath('/dashboard');
  // Redirect back to the dashboard
  redirect('/dashboard');
}

export async function deleteCar(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error('No autorizado');
  }

  const carId = formData.get('carId') as string;
  if (!carId) {
    throw new Error('ID del auto no proporcionado');
  }

  const car = await prisma.car.findUnique({
    where: { id: carId },
    select: { clientId: true },
  });

  if (!car) {
    throw new Error('Auto no encontrado');
  }

  // Check permissions: SUPERADMIN can delete any car,
  // CLIENT_ADMIN can only delete their own cars.
  // @ts-ignore
  const userIsSuperAdmin = session.user.role === 'SUPERADMIN';
  // @ts-ignore
  const userIsOwner = car.clientId === session.user.clientId;

  if (!userIsSuperAdmin && !userIsOwner) {
    throw new Error('Permiso denegado para eliminar este auto');
  }

  await prisma.car.delete({
    where: { id: carId },
  });

  // Revalidate both client and admin dashboards
  revalidatePath('/dashboard');
  revalidatePath('/admin/cars');
}