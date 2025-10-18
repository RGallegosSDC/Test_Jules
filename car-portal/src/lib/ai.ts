import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const MODEL_NAME = 'gemini-1.0-pro';
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn(
    'GOOGLE_API_KEY is not set. AI features will be disabled. Please get an API key from Google AI Studio.'
  );
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.8,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

/**
 * Genera contenido impulsado por IA para un modelo de auto específico.
 * @param make La marca del auto (por ejemplo, "Toyota").
 * @param model El modelo del auto (por ejemplo, "Camry").
 * @returns Un objeto que contiene datos curiosos, comentarios positivos y estadísticas generados por IA.
 */
export async function generateCarModelInfo(make: string, carModel: string) {
  if (!API_KEY) {
    // Devuelve datos de prueba si la clave de API no está configurada, para que la aplicación no se bloquee.
    return {
      funFacts: ['Las funciones de IA están deshabilitadas. Por favor, configure GOOGLE_API_KEY.'],
      positiveComments: ['High reliability.'],
      statistics: ['Good fuel economy.'],
    };
  }

  const prompt = `
    Eres un experto en automóviles apasionado y carismático. Tu objetivo es generar contenido emocionante y positivo para un portal de venta de autos.

    Para el modelo de auto "${make} ${carModel}", por favor genera la siguiente información en formato JSON. Responde únicamente con el objeto JSON y nada más.

    El formato JSON debe ser el siguiente:
    {
      "funFacts": ["dato curioso 1", "dato curioso 2"],
      "positiveComments": ["comentario positivo 1 sobre su rendimiento o diseño", "comentario positivo 2 sobre su fiabilidad o tecnología"],
      "statistics": ["estadística clave 1, como 'Hasta 39 MPG en carretera'", "estadística clave 2, como 'Calificación de seguridad de 5 estrellas'"]
    }

    Asegúrate de que los datos sean interesantes, precisos y presentados de una manera que atraiga a los compradores potenciales. No incluyas nada más que el objeto JSON en tu respuesta.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });

    const responseText = result.response.text();
    // Limpia la respuesta para asegurar que sea una cadena JSON válida
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedResponse = JSON.parse(jsonString);

    return {
      funFacts: parsedResponse.funFacts || [],
      positiveComments: parsedResponse.positiveComments || [],
      statistics: parsedResponse.statistics || [],
    };

  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    // Devuelve un objeto de respaldo en caso de un error de la API
    return {
      funFacts: ['No se pudo generar información de IA en este momento.'],
      positiveComments: [],
      statistics: [],
    };
  }
}

/**
 * Genera contenido de texto basado en un prompt dado.
 * @param prompt La instrucción para la IA.
 * @returns El texto generado como una cadena.
 */
export async function generateText(prompt: string): Promise<string> {
  if (!API_KEY) {
    return 'Las funciones de IA están deshabilitadas. Por favor, configure GOOGLE_API_KEY.';
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings,
    });
    return result.response.text();
  } catch (error) {
    console.error('Error calling Google Gemini API for text generation:', error);
    return 'No se pudo generar el contenido en este momento.';
  }
}