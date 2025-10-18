'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateCarModelInfo, generateText } from '@/lib/ai';

export async function createCar(prevState: { message: string }, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clientId) {
    return { message: 'No autorizado. Por favor, inicie sesión.' };
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.clientId },
  });

  if (client?.subscriptionStatus !== 'active') {
    return { message: 'Necesitas una suscripción activa para crear un auto.' };
  }

  const make = formData.get('make') as string;
  const model = formData.get('model') as string;
  const year = Number(formData.get('year'));
  const price = Number(formData.get('price'));
  const description = formData.get('description') as string;
  const images = formData.get('images') as string; // Esto es ahora una cadena JSON de URLs

  if (!make || !model || !year || !price || !description) {
    return { message: 'Todos los campos marcados con * son obligatorios.' };
  }

  try {
    const clientId = session.user.clientId;

    const newCar = await prisma.car.create({
      data: {
        make,
        model,
        year,
        price,
        description,
        images: JSON.stringify(images),
        clientId,
      },
    });

    // --- AI Content Generation Step ---
    const modelKey = `${make.toUpperCase()}_${model.toUpperCase()}_${year}`;
    let carModelInfo = await prisma.carModelInfo.findUnique({
      where: { modelKey },
    });

    if (!carModelInfo) {
      console.log(`Generating new AI content for ${modelKey}...`);
      const aiContent = await generateCarModelInfo(make, model);

      carModelInfo = await prisma.carModelInfo.create({
        data: {
          modelKey,
          funFacts: JSON.stringify(aiContent.funFacts),
          positiveComments: JSON.stringify(aiContent.positiveComments),
          statistics: JSON.stringify(aiContent.statistics),
        },
      });
    }

    // Vincula el contenido de IA al nuevo auto
    await prisma.car.update({
      where: { id: newCar.id },
      data: { carModelInfoId: carModelInfo.id },
    });

    // --- SEO Content Generation Step ---
    console.log(`Generating SEO content for ${newCar.make} ${newCar.model}...`);
    const seoPrompt = `
      Eres un especialista en SEO para un portal de venta de autos.
      Para el siguiente vehículo, genera un 'title' (máximo 60 caracteres) y una 'description' (máximo 160 caracteres) optimizados para motores de búsqueda.

      Vehículo: ${newCar.make} ${newCar.model} ${newCar.year}
      Descripción: ${newCar.description}

      Responde únicamente con un objeto JSON con las claves "seoTitle" y "seoDescription".
    `;
    const seoContentRaw = await generateText(seoPrompt);
    try {
      const seoContent = JSON.parse(seoContentRaw.replace(/```json/g, '').replace(/```/g, '').trim());
      await prisma.car.update({
        where: { id: newCar.id },
        data: {
          seoTitle: seoContent.seoTitle,
          seoDescription: seoContent.seoDescription,
        },
      });
    } catch (seoError) {
      console.error("No se pudo analizar el contenido SEO de la IA:", seoError);
      // Error no crítico, así que no bloqueamos la creación del auto
    }

    // --- Alert Notification Step ---
    // Find alerts that match the newly created car
    const matchingAlerts = await prisma.alert.findMany({
        where: {
            AND: [
                { OR: [{ make: { equals: newCar.make, mode: 'insensitive' } }, { make: null }] },
                { OR: [{ model: { equals: newCar.model, mode: 'insensitive' } }, { model: null }] },
                { OR: [{ maxPrice: { gte: newCar.price } }, { maxPrice: null }] },
                { OR: [{ minYear: { lte: newCar.year } }, { minYear: null }] },
            ]
        },
        include: { user: { select: { email: true } } }
    });

    if (matchingAlerts.length > 0) {
        console.log(`[+] Alerta de Auto Nuevo: ${matchingAlerts.length} usuarios notificados para el ${newCar.make} ${newCar.model}.`);
        for (const alert of matchingAlerts) {
            // In a real application, you would send an email here.
            console.log(`  -> Simulando envío de email a: ${alert.user.email}`);
        }
    }


  } catch (e) {
    console.error(e);
    return { message: 'Error al crear el auto en la base de datos.' };
  }

  // Revalida la ruta del dashboard para mostrar el nuevo auto
  revalidatePath('/dashboard');
  // Redirige de vuelta al dashboard
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

  // Comprobar permisos: SUPERADMIN puede eliminar cualquier auto,
  // CLIENT_ADMIN solo puede eliminar sus propios autos.
  const userIsSuperAdmin = session.user.role === 'SUPERADMIN';
  const userIsOwner = car.clientId === session.user.clientId;

  if (!userIsSuperAdmin && !userIsOwner) {
    throw new Error('Permiso denegado para eliminar este auto');
  }

  await prisma.car.delete({
    where: { id: carId },
  });

  // Revalida tanto el dashboard del cliente como el del administrador
  revalidatePath('/dashboard');
  revalidatePath('/admin/cars');
}

export async function updateCar(prevState: { message: string }, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { message: 'No autorizado. Por favor, inicie sesión.' };
  }

  const carId = formData.get('carId') as string;
  if (!carId) {
    return { message: 'ID del auto no encontrado.' };
  }

  // Comprobación de autorización
  const car = await prisma.car.findUnique({
    where: { id: carId },
    select: { clientId: true },
  });

  if (!car) {
    return { message: 'Auto no encontrado.' };
  }

  const userIsOwner = car.clientId === session.user.clientId;
  const userIsSuperAdmin = session.user.role === 'SUPERADMIN';

  if (!userIsOwner && !userIsSuperAdmin) {
    return { message: 'Permiso denegado para editar este auto.' };
  }

  // Validación y procesamiento de datos
  const make = formData.get('make') as string;
  const model = formData.get('model') as string;
  const year = Number(formData.get('year'));
  const price = Number(formData.get('price'));
  const description = formData.get('description') as string;
  const images = formData.get('images') as string; // Esto es ahora una cadena JSON de URLs

  if (!make || !model || !year || !price || !description) {
    return { message: 'Todos los campos marcados con * son obligatorios.' };
  }

  try {
    await prisma.car.update({
      where: { id: carId },
      data: {
        make,
        model,
        year,
        price,
        description,
        images: JSON.stringify(images),
      },
    });
  } catch (e) {
    console.error(e);
    return { message: 'Error al actualizar el auto en la base de datos.' };
  }

  revalidatePath('/dashboard');
  revalidatePath(`/dashboard/cars/${carId}/edit`);
  redirect('/dashboard');
}

export async function generateMarketingPost(carId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: 'No autorizado' };
  }

  const car = await prisma.car.findUnique({
    where: { id: carId },
  });

  if (!car) {
    return { error: 'Auto no encontrado' };
  }

  // Comprobación de autorización
  const userIsOwner = car.clientId === session.user.clientId;
  const userIsSuperAdmin = session.user.role === 'SUPERADMIN';

  if (!userIsOwner && !userIsSuperAdmin) {
    return { error: 'Permiso denegado' };
  }

  const prompt = `
    Eres un experto en marketing de redes sociales para concesionarios de autos.
    Tu tarea es crear una publicación corta, emocionante y atractiva para Instagram sobre el siguiente vehículo.

    Vehículo:
    - Marca: ${car.make}
    - Modelo: ${car.model}
    - Año: ${car.year}
    - Precio: $${car.price.toLocaleString()}
    - Descripción: ${car.description}

    La publicación debe ser en español, usar un tono entusiasta, incluir emojis relevantes y terminar con un llamado a la acción claro para que los interesados envíen un mensaje directo o visiten el concesionario. Incluye hashtags populares y relevantes.
  `;

  const postText = await generateText(prompt);

  return { success: postText };
}