import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import EditCarForm from '@/components/EditCarForm'; // We will create this component next

// This server component fetches the car data and handles authorization
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

  // Authorization check: only the owner or a superadmin can edit
  // @ts-ignore
  const userIsOwner = car.clientId === session.user.clientId;
  // @ts-ignore
  const userIsSuperAdmin = session.user.role === UserRole.SUPERADMIN;

  if (!userIsOwner && !userIsSuperAdmin) {
    redirect('/dashboard'); // Or show an unauthorized page
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Editar Auto</h1>
      {/* The form itself will be a client component */}
      <EditCarForm car={car} />
    </div>
  );
}