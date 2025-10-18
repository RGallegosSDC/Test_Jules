'use client';

import { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '@/app/actions/chatbotActions';

// Tipos para los mensajes del chat
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de ventas virtual. ¿Cómo puedo ayudarte a encontrar tu auto ideal hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Efecto para hacer scroll hacia abajo cuando llegan nuevos mensajes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Llama a la Server Action con el historial actualizado
      const response = await getChatbotResponse(newMessages);
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'assistant', content: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Encabezado */}
      <div className="bg-primary text-white p-4 rounded-t-lg flex items-center">
        <h2 className="text-lg font-semibold">Asistente de Ventas IA</h2>
      </div>

      {/* Cuerpo del Chat (Mensajes) */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-2xl">
                  Escribiendo...
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Pie de página (Input del usuario) */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregúntame sobre un auto..."
            className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-primary hover:opacity-90 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Enviar mensaje"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}