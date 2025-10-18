import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import EditCarForm from '@/components/EditCarForm'; // Crearemos este componente a continuación

// Este componente de servidor busca los datos del auto y maneja la autorización
export default async function EditCarPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const car = await prisma.car.findUnique({
    where: { id: params.id },
  });

  if (!car) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold">Auto no encontrado.</h1>
      </div>
    );
  }

  // Comprobación de autorización: solo el propietario o un superadministrador pueden editar
  const userIsOwner = car.clientId === session.user.clientId;
  const userIsSuperAdmin = session.user.role === UserRole.SUPERADMIN;

  if (!userIsOwner && !userIsSuperAdmin) {
    redirect('/dashboard'); // O mostrar una página de no autorizado
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Auto</h1>
      {/* El formulario en sí será un componente de cliente */}
      <EditCarForm car={car} />
    </div>
  );
}