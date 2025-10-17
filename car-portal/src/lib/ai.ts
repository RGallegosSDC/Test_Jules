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
 * Generates AI-powered content for a specific car model.
 * @param make The make of the car (e.g., "Toyota").
 * @param model The model of the car (e.g., "Camry").
 * @returns An object containing AI-generated fun facts, positive comments, and statistics.
 */
export async function generateCarModelInfo(make: string, carModel: string) {
  if (!API_KEY) {
    // Return dummy data if the API key is not set, so the app doesn't crash.
    return {
      funFacts: ['AI features are disabled. Please set GOOGLE_API_KEY.'],
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
    // Clean the response to ensure it's a valid JSON string
    const jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedResponse = JSON.parse(jsonString);

    return {
      funFacts: parsedResponse.funFacts || [],
      positiveComments: parsedResponse.positiveComments || [],
      statistics: parsedResponse.statistics || [],
    };

  } catch (error) {
    console.error('Error calling Google Gemini API:', error);
    // Return a fallback object in case of an API error
    return {
      funFacts: ['No se pudo generar información de IA en este momento.'],
      positiveComments: [],
      statistics: [],
    };
  }
}

/**
 * Generates text content based on a given prompt.
 * @param prompt The instruction for the AI.
 * @returns The generated text as a string.
 */
export async function generateText(prompt: string): Promise<string> {
  if (!API_KEY) {
    return 'AI features are disabled. Please set GOOGLE_API_KEY.';
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