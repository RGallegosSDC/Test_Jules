'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

export async function createClient(prevState: { message: string, success: boolean }, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.SUPERADMIN) {
    return { message: 'No autorizado.', success: false };
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { message: 'Todos los campos son obligatorios.', success: false };
  }

  try {
    // Comprueba si el cliente o el correo electrónico del usuario ya existen
    const existingClient = await prisma.client.findUnique({ where: { name } });
    if (existingClient) {
      return { message: 'Ya existe un cliente con este nombre.', success: false };
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { message: 'Este correo electrónico ya está en uso.', success: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea el cliente y el usuario administrador en una transacción
    await prisma.$transaction(async (tx) => {
      const newClient = await tx.client.create({
        data: { name },
      });

      await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role: UserRole.CLIENT_ADMIN,
          clientId: newClient.id,
        },
      });
    });

  } catch (e) {
    console.error(e);
    return { message: 'Error al crear el cliente.', success: false };
  }

  revalidatePath('/admin/clients');
  return { message: `Cliente "${name}" y su administrador han sido creados con éxito.`, success: true };
}

export async function deleteClient(formData: FormData) {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== UserRole.SUPERADMIN) {
        throw new Error('No autorizado');
    }

    const clientId = formData.get('clientId') as string;
    if (!clientId) {
        throw new Error('ID del cliente no proporcionado');
    }

    // Usa una transacción para eliminar el cliente y todos sus datos asociados
    try {
        await prisma.$transaction(async (tx) => {
            // Primero, elimina los autos relacionados para evitar errores de clave foránea
            await tx.car.deleteMany({
                where: { clientId: clientId },
            });
            // Luego, elimina los usuarios relacionados
            await tx.user.deleteMany({
                where: { clientId: clientId },
            });
            // Finalmente, elimina el cliente
            await tx.client.delete({
                where: { id: clientId },
            });
        });
    } catch (e) {
        console.error(e);
        throw new Error('Error al eliminar el cliente y sus datos asociados.');
    }

    revalidatePath('/admin/clients');
}

export async function updateClient(prevState: { message: string }, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== UserRole.SUPERADMIN) {
    return { message: 'No autorizado.' };
  }

  const clientId = formData.get('clientId') as string;
  const userId = formData.get('userId') as string;
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!clientId || !userId || !name || !email) {
    return { message: 'Faltan datos requeridos.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Actualiza el nombre del cliente
      await tx.client.update({
        where: { id: clientId },
        data: { name },
      });

      // Prepara los datos del usuario
      const userData: { email: string; password?: string } = { email };
      if (password) {
        userData.password = await bcrypt.hash(password, 10);
      }

      // Actualiza los detalles del usuario
      await tx.user.update({
        where: { id: userId },
        data: userData,
      });
    });
  } catch (e) {
    console.error(e);
    return { message: 'Error al actualizar el cliente.' };
  }

  revalidatePath('/admin/clients');
  redirect('/admin/clients');
}