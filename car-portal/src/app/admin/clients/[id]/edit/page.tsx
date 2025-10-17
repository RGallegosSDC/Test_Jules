import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import EditClientForm from '@/components/EditClientForm'; // This component will be created next

// This server component fetches client data and checks permissions
export default async function EditClientPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // This page is for superadmins only
  if (session?.user?.role !== UserRole.SUPERADMIN) {
    redirect('/');
  }

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      users: {
        where: { role: UserRole.CLIENT_ADMIN },
        take: 1, // A client should only have one admin for now
      },
    },
  });

  if (!client) {
    return <div className="container mx-auto p-4">Cliente no encontrado.</div>;
  }

  const clientAdmin = client.users[0];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Cliente</h1>
      <EditClientForm client={client} user={clientAdmin} />
    </div>
  );
}