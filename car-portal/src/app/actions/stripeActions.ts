'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.clientId) {
    throw new Error('Client not found.');
  }

  const clientId = session.user.clientId;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) {
    throw new Error('Client not found in database.');
  }

  let stripeCustomerId = client.stripeCustomerId;

  // If the client doesn't have a Stripe Customer ID, create one
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      name: client.name,
    });
    stripeCustomerId = customer.id;

    await prisma.client.update({
      where: { id: clientId },
      data: { stripeCustomerId },
    });
  }

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error('STRIPE_PRICE_ID is not set in your .env file.');
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
      // We pass our internal client ID in the metadata to identify the user
      // when we receive the webhook event from Stripe.
      metadata: {
        clientId: clientId,
      },
    });

    if (!checkoutSession.url) {
      throw new Error('Could not create checkout session.');
    }

    // Redirect the user to Stripe's checkout page
    redirect(checkoutSession.url);

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    throw new Error('Failed to create checkout session.');
  }
}