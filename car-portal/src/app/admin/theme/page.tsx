import { prisma } from '@/lib/prisma';
import ThemeForm from '@/components/ThemeForm';

// Esta página obtiene la configuración actual del tema y la pasa al formulario.
export default async function ThemePage() {
  // Usamos upsert para crear la configuración inicial si no existe.
  const themeSettings = await prisma.themeSettings.upsert({
    where: { singleton: true },
    update: {},
    create: {
      primaryColor: '#3B82F6', // Un azul como valor inicial
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Personalización del Tema</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <ThemeForm settings={themeSettings} />
      </div>
    </div>
  );
}