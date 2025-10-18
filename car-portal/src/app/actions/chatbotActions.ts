'use server';

import { prisma } from '@/lib/prisma';
import { generateText } from '@/lib/ai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function getChatbotResponse(history: Message[]): Promise<string> {
  // 1. Obtener todos los autos de la base de datos para dar contexto a la IA.
  const cars = await prisma.car.findMany({
    select: {
      make: true,
      model: true,
      year: true,
      price: true,
      description: true,
    },
  });

  // Formatear la lista de autos como una cadena de texto simple.
  const carList = cars.map(car =>
    `- ${car.make} ${car.model} ${car.year} por $${car.price.toLocaleString()}. Descripción: ${car.description}`
  ).join('\n');

  // 2. Construir el prompt para la IA.
  const prompt = `
    Eres un asistente de ventas de autos amigable y experto para un portal web llamado "CarPortal".
    Tu ÚNICO conocimiento se basa en la siguiente lista de autos disponibles. No inventes autos ni información que no esté en esta lista.
    Si te preguntan algo que no tiene que ver con autos, amablemente di que solo puedes ayudar con la compra de vehículos.

    Aquí está el inventario actual:
    ${carList}

    A continuación se muestra el historial de la conversación con un cliente. Responde a la última pregunta del cliente de manera útil y concisa, basándote en el inventario proporcionado.

    Historial de la conversación:
    ${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

    Tu respuesta:
  `;

  // 3. Llamar a la IA para obtener la respuesta.
  try {
    const response = await generateText(prompt);
    return response;
  } catch (error) {
    console.error('Error al obtener la respuesta del chatbot:', error);
    return 'Lo siento, estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde.';
  }
}