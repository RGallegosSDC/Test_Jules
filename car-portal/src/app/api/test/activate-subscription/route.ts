import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// This is a test-only API route to allow Playwright to trigger
// the subscription activation without directly calling a server action.
export async function POST(request: NextRequest) {
  // This is a test-only route, so we are lax with security.
  // In a real app, this would be heavily protected or non-existent.
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.clientId) {
      throw new Error('Client not found for activation.');
    }

    await prisma.client.update({
      where: { id: session.user.clientId },
      data: { subscriptionStatus: 'active' },
    });

    revalidatePath('/dashboard');

    return NextResponse.json({ success: true, message: 'Subscription activated for testing.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}