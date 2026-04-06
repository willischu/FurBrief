import { supabaseAdmin } from '../../../lib/supabase';

const getIp = (request: Request) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return 'unknown';
};

const getHourWindow = () => {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  return now.toISOString();
};

export async function POST(request: Request) {
  const supabase = supabaseAdmin();

  const ip = getIp(request);
  const windowStart = getHourWindow();

  const rate = await supabase
    .from('rate_limits')
    .select('count')
    .eq('ip', ip)
    .eq('window_start', windowStart)
    .single();

  if (rate.error && rate.error.code !== 'PGRST116') {
    return new Response(JSON.stringify({ error: 'Rate limit check failed' }), { status: 500 });
  }

  const existingCount = (rate.data as any)?.count ?? 0;
  if (existingCount >= 10) {
    return new Response(JSON.stringify({ error: 'Too many uploads from this IP. Try again in an hour.' }), { status: 429 });
  }

  if (existingCount === 0) {
    await (supabase as any).from('rate_limits').insert({ ip, window_start: windowStart, count: 1 });
  } else {
    await (supabase as any)
      .from('rate_limits')
      .update({ count: existingCount + 1 })
      .eq('ip', ip)
      .eq('window_start', windowStart);
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const pastedText = formData.get('text') as string | null;

  if (!file && !pastedText) {
    return new Response(JSON.stringify({ error: 'Missing uploaded file or pasted text' }), { status: 400 });
  }

  let buffer: ArrayBuffer;
  let mimeType = 'application/octet-stream';
  let fileName = `furbrief-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File must be 10MB or less' }), { status: 400 });
    }
    buffer = await file.arrayBuffer();
    mimeType = file.type || mimeType;
    fileName += file.name.includes('.') ? `-${file.name}` : `.${file.type.split('/')[1] || 'dat'}`;
  } else {
    const text = (pastedText ?? '').trim();
    buffer = new TextEncoder().encode(text).buffer;
    mimeType = 'text/plain';
    fileName += '.txt';
  }

  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false
    });

  if (error) {
    return new Response(JSON.stringify({ error: `Upload failed: ${error.message}` }), { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(fileName);

  return new Response(JSON.stringify({ blob_url: publicUrl }), { status: 200 });
}
