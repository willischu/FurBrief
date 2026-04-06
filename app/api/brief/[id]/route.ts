import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const orderId = params.id;
  const { data, error } = await (supabaseAdmin() as any)
    .from('orders')
    .select('status,language,share_token,briefs(day_schedule,medications,warning_signs,normal_things,follow_up)')
    .eq('id', orderId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const orderData = data as any;
  const response: any = {
    status: orderData.status,
    language: orderData.language,
    share_token: orderData.share_token,
  };

  if (orderData.status === 'complete' && orderData.briefs) {
    response.brief = orderData.briefs;
  }

  return NextResponse.json(response);
}
