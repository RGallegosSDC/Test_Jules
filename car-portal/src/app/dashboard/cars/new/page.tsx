import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import NewCarForm from '@/components/NewCarForm';

// Este componente de servidor comprueba si hay una suscripción activa antes de renderizar el formulario.
export default async function NewCarPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.clientId) {
    redirect('/auth/signin');
  }

  const client = await prisma.client.findUnique({
    where: { id: session.user.clientId },
    select: { subscriptionStatus: true },
  });

  if (client?.subscriptionStatus !== 'active') {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="p-4 text-center text-red-800 bg-red-100 border border-red-400 rounded-lg">
          <h1 className="text-2xl font-bold">Acceso Denegado</h1>
          <p>Necesitas una suscripción activa para añadir un nuevo auto.</p>
        </div>
      </div>
    );
  }

  return <NewCarForm />;
}