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

  // bail if already processed
  const { data: existing } = await (supabaseAdmin() as any)
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single();

  if (existing?.status === 'complete' || existing?.status === 'processing') {
    console.log('⏭️ order already processed, skipping', orderId);
    return;
  }

  await (supabaseAdmin() as any)
    .from('orders')
    .update({ status: 'processing', customer_email: session.customer_email })
    .eq('id', orderId);

  try {
    const blobUrl = metadata.blob_url;
    console.log('📄 fetching blob', blobUrl);
    const fileRes = await fetch(blobUrl);
    console.log('📄 blob fetch status', fileRes.status);
    const buffer = await fileRes.arrayBuffer();
    const mimeType = fileRes.headers.get('content-type') || detectMimeType(buffer);
    console.log('📄 mimeType', mimeType);

    const content = await extractContent(buffer, mimeType);
    console.log('📄 content extracted', content.type);

    console.log('🤖 calling generateFurbrief...');
    const brief = await generateFurbrief(
      content,
      metadata.pet_name,
      metadata.species,
      metadata.surgery_type,
      metadata.language
    );
    console.log('✅ brief generated');

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    await (supabaseAdmin() as any).from('briefs').insert({
      order_id: orderId,
      token,
      day_schedule: brief.day_schedule,
      medications: brief.medications,
      warning_signs: brief.warning_signs,
      normal_things: brief.normal_things,
      follow_up: brief.follow_up,
    });

    // write token back to orders so polling page can redirect
    await (supabaseAdmin() as any)
      .from('orders')
      .update({ status: 'complete', completed_at: new Date().toISOString(), share_token: token })
      .eq('id', orderId);

    const insertResult = await (supabaseAdmin() as any).from('briefs').insert({
      order_id: orderId,
      token,
      day_schedule: brief.day_schedule,
      medications: brief.medications,
      warning_signs: brief.warning_signs,
      normal_things: brief.normal_things,
      follow_up: brief.follow_up,
    }).select('token').single();

    // if token already exists, fetch it instead
    const finalToken = insertResult.error?.code === '23505'
      ? (await (supabaseAdmin() as any).from('briefs').select('token').eq('order_id', orderId).single()).data?.token
      : token;
    console.log('💾 brief insert result', insertResult.error ?? 'ok');

    const updateResult = await (supabaseAdmin() as any)
      .from('orders')
      .update({ status: 'complete', completed_at: new Date().toISOString() })
      .eq('id', orderId);
    console.log('💾 order update result', updateResult.error ?? 'ok');

    if (session.customer_email) {
      await sendBriefEmail(session.customer_email, metadata.pet_name, metadata.language, token);
    }
  } catch (error) {
    console.error('❌ processing failed', error);
    await (supabaseAdmin() as any).from('orders').update({ status: 'failed' }).eq('id', orderId);
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
