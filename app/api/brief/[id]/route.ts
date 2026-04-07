import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  noStore();
  const orderId = params.id;
  const { data, error } = await (supabaseAdmin() as any)
    .from('orders')
    .select('status,language,share_token,briefs(token,day_schedule,medications,warning_signs,normal_things,follow_up)')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const orderData = data as any;
  const share_token = orderData.share_token ?? orderData.briefs?.token ?? null;
  const response: any = {
    status: orderData.status,
    language: orderData.language,
    share_token,
  };

  if (orderData.status === 'complete' && orderData.briefs) {
    response.brief = orderData.briefs;
  }

  return NextResponse.json(response);
}
