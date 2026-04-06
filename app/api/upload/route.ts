import { supabaseAdmin } from '../../../lib/supabase';

const BLOB_BASE_URL = process.env.VERCEL_BLOB_URL || 'https://blob.vercel.com/v1/files';
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

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
  if (!BLOB_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing blob token' }), { status: 500 });
  }

  const ip = getIp(request);
  const windowStart = getHourWindow();

  const rate = await (supabaseAdmin() as any)
    .from('rate_limits')
    .select('count')
    .eq('ip', ip)
    .eq('window_start', windowStart)
    .single();

  if (rate.error && rate.error.code !== 'PGRST116') {
    return new Response(JSON.stringify({ error: 'Rate limit check failed' }), { status: 500 });
  }

  const existingCount = rate.data?.count ?? 0;
  if (existingCount >= 10) {
    return new Response(JSON.stringify({ error: 'Too many uploads from this IP. Try again in an hour.' }), { status: 429 });
  }

  if (existingCount === 0) {
    await (supabaseAdmin() as any).from('rate_limits').insert({ ip, window_start: windowStart, count: 1 });
  } else {
    await (supabaseAdmin() as any)
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
  let name = `furbrief-${Date.now()}`;

  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File must be 10MB or less' }), { status: 400 });
    }
    buffer = await file.arrayBuffer();
    mimeType = file.type || mimeType;
    name += file.name.includes('.') ? `-${file.name}` : `.${file.type.split('/')[1] || 'dat'}`;
  } else {
    const text = (pastedText ?? '').trim();
    buffer = new TextEncoder().encode(text).buffer;
    mimeType = 'text/plain';
    name += '.txt';
  }

  const fileName = `furbrief-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${mimeType.split('/')[1] || 'txt'}`;
  const uploadUrl = `${BLOB_BASE_URL}/${encodeURIComponent(fileName)}`;

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${BLOB_TOKEN}`,
      'Content-Type': mimeType,
    },
    body: buffer,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    return new Response(JSON.stringify({ error: `Blob upload failed: ${errorText}` }), { status: 500 });
  }

  return new Response(JSON.stringify({ blob_url: uploadUrl }), { status: 200 });
}
