'use client';

import { useState } from 'react';
import ChatWindow from './ChatWindow';

// Icono de Chat
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

// Icono para Cerrar
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-primary hover:opacity-90 text-white rounded-full p-3 shadow-lg z-50 transition-transform transform hover:scale-110"
        aria-label="Abrir chat de ayuda"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-auto max-h-[70vh] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          <ChatWindow />
        </div>
      )}
    </>
  );
}