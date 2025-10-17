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
    // Check if client or user email already exists
    const existingClient = await prisma.client.findUnique({ where: { name } });
    if (existingClient) {
      return { message: 'Ya existe un cliente con este nombre.', success: false };
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { message: 'Este correo electrónico ya está en uso.', success: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the client and the admin user in a transaction
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

    // Use a transaction to delete the client and all associated data
    try {
        await prisma.$transaction(async (tx) => {
            // First, delete related cars to avoid foreign key constraint errors
            await tx.car.deleteMany({
                where: { clientId: clientId },
            });
            // Then, delete related users
            await tx.user.deleteMany({
                where: { clientId: clientId },
            });
            // Finally, delete the client
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