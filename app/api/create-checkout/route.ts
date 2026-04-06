import { NextResponse } from 'next/server';
import { stripe } from '../../../lib/stripe';
import { supabaseAdmin } from '../../../lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();
  const { blobUrl, petName, species, surgeryType, language } = body;

  if (!blobUrl || !petName || !species || !language) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!process.env.STRIPE_PRICE_ID || !process.env.NEXT_PUBLIC_APP_URL) {
    return NextResponse.json({ error: 'Missing Stripe or app URL env' }, { status: 500 });
  }

  const shareToken = crypto.randomUUID();
  const insertResult = await (supabaseAdmin() as any).from('orders').insert({
    pet_name: petName,
    species,
    surgery_type: surgeryType || '',
    language,
    blob_url: blobUrl,
    share_token: shareToken,
  }).select('id').single();

  if (insertResult.error || !insertResult.data?.id) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  const orderId = insertResult.data.id;
  const origin = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');

  const session = await (stripe() as any).checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    mode: 'payment',
    success_url: `${origin}/processing/${orderId}`,
    cancel_url: `${origin}/upload?step=3`,
    metadata: {
      order_id: orderId,
      share_token: shareToken,
      blob_url: blobUrl,
      pet_name: petName,
      species,
      surgery_type: surgeryType || '',
      language,
    },
  });

  await (supabaseAdmin() as any)
    .from('orders')
    .update({ stripe_session_id: session.id })
    .eq('id', orderId);

  return NextResponse.json({ url: session.url });
}
