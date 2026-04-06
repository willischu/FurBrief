import { stripe } from '../../../lib/stripe';
import { supabaseAdmin } from '../../../lib/supabase';
import { extractContent, detectMimeType } from '../../../lib/extract';
import { generateFurbrief } from '../../../lib/claude';
import { sendBriefEmail } from '../../../lib/email';

const deleteBlob = async (blobUrl: string) => {
  try {
    const url = new URL(blobUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    await supabaseAdmin().storage.from('uploads').remove([fileName]);
  } catch (error) {
    console.error('failed to delete blob', error);
  }
};

const processSession = async (session: any) => {
  const metadata = session.metadata ?? {};
  const orderId = metadata.order_id;
  if (!orderId) return;

  await supabaseAdmin()
    .from('orders')
    .update({ status: 'processing', customer_email: session.customer_email })
    .eq('id', orderId);

  try {
    const blobUrl = metadata.blob_url;
    const fileRes = await fetch(blobUrl);
    const buffer = await fileRes.arrayBuffer();
    const mimeType = fileRes.headers.get('content-type') || detectMimeType(buffer);
    const content = await extractContent(buffer, mimeType);
    const brief = await generateFurbrief(
      content,
      metadata.pet_name,
      metadata.species,
      metadata.surgery_type,
      metadata.language
    );

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await supabaseAdmin().from('briefs').insert({
      order_id: orderId,
      token: token,
      day_schedule: brief.day_schedule,
      medications: brief.medications,
      warning_signs: brief.warning_signs,
      normal_things: brief.normal_things,
      follow_up: brief.follow_up,
    });

    await supabaseAdmin()
      .from('orders')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', orderId);

    if (session.customer_email) {
      await sendBriefEmail(session.customer_email, metadata.pet_name, metadata.language, token);
    }
  } catch (error) {
    console.error('processing failed', error);
    await supabaseAdmin().from('orders').update({ status: 'failed' }).eq('id', orderId);
  } finally {
    if (metadata.blob_url) {
      await deleteBlob(metadata.blob_url);
    }
  }
};

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') || '';

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return new Response('Missing Stripe webhook secret', { status: 500 });
  }

  let event;
  try {
    event = (stripe() as any).webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return new Response(`Webhook error: ${(error as Error).message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    void processSession(event.data.object);
  }

  return new Response('ok', { status: 200 });
}
