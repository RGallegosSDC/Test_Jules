import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Stripe webhook secret or signature is missing.');
    return new NextResponse('Webhook secret not configured', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          const checkoutSession = event.data.object as Stripe.Checkout.Session;

          if (!checkoutSession.metadata?.clientId) {
            throw new Error('clientId not found in checkout session metadata');
          }

          await prisma.client.update({
            where: {
              id: checkoutSession.metadata.clientId,
            },
            data: {
              stripeCustomerId: checkoutSession.customer as string,
              subscriptionId: checkoutSession.subscription as string,
              subscriptionStatus: 'active',
            },
          });
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object as Stripe.Subscription;
          await prisma.client.update({
            where: {
              subscriptionId: subscription.id,
            },
            data: {
              subscriptionStatus: subscription.status,
            },
          });
          break;

        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error('Webhook handler error:', error);
      return new NextResponse(
        'Webhook handler failed. View logs for more details.',
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ received: true });
}