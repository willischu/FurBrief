export function getSubject(language: 'en' | 'es' | 'ko' | 'zh', name: string) {
  const subjects: Record<'en' | 'es' | 'ko' | 'zh', string> = {
    en: `Your furbrief for ${name} is ready`,
    es: `El furbrief de ${name} está listo`,
    ko: `${name}의 퍼브리프가 준비되었습니다`,
    zh: `${name}的毛简报已准备好`,
  };
  return subjects[language] || subjects.en;
}

export async function sendBriefEmail(
  to: string,
  name: string,
  language: 'en' | 'es' | 'ko' | 'zh',
  token: string
) {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.NEXT_PUBLIC_APP_URL) {
    throw new Error('Missing Resend or app URL environment variables');
  }

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/brief/${token}`;
  const subject = getSubject(language, name);
  const text = `Your furbrief is ready. View it here: ${url}\n\nIt's shareable — send it to anyone helping with ${name}'s recovery.`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject,
      text,
    }),
  });
}
