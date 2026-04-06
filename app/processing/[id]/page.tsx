'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { labels } from '../../../i18n/strings';

const mailto = 'mailto:help@furbrief.com?subject=Refund%20request';

export default function ProcessingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  const [status, setStatus] = useState<'pending' | 'processing' | 'complete' | 'failed'>('processing');
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'es' | 'ko' | 'zh'>('en');
  const [timeoutReached, setTimeoutReached] = useState(false);

  const labelSet = labels[language] || labels.en;
  const text = useMemo(() => labelSet.processing[messageIndex % labelSet.processing.length], [labelSet, messageIndex]);

  useEffect(() => {
    const rotate = setInterval(() => setMessageIndex((value) => value + 1), 4000);
    return () => clearInterval(rotate);
  }, []);

  useEffect(() => {
    let poll: NodeJS.Timeout;
    const start = Date.now();

    const refresh = async () => {
      try {
        const response = await fetch(`/api/brief/${orderId}`);
        if (!response.ok) {
          throw new Error('Unable to check status');
        }
        const data = await response.json();
        if (data.language) {
          setLanguage(data.language);
        }
        setStatus(data.status);
        if (data.status === 'complete' && data.share_token) {
          router.replace(`/brief/${data.share_token}`);
          return;
        }
        if (data.status === 'failed') {
          setError('Something went wrong while creating your furbrief.');
          return;
        }
        if (Date.now() - start > 180000) {
          setTimeoutReached(true);
          setError('Processing timed out.');
          return;
        }
      } catch (err) {
        setError('Unable to reach processing service.');
      }
      if (!timeoutReached && status !== 'failed') {
        poll = setTimeout(refresh, 3000);
      }
    };

    refresh();
    return () => clearTimeout(poll);
  }, [orderId, router, status, timeoutReached]);

  return (
    <main className="hero-outer dot-bg">
      <div className="hero-inner" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <section style={{ width: '100%', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FCF0C8', padding: '5px 14px', borderRadius: 50, border: '1.5px solid #F0DC90' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B8866A' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#8A6840' }}>furbrief is being built</span>
            </div>
          </div>
          <div style={{ marginBottom: 24 }}>
            <div style={{ width: 160, height: 160, margin: '0 auto', position: 'relative' }}>
              <svg viewBox="0 0 100 100" width="160" height="160">
                <use href="#cat" />
              </svg>
            </div>
          </div>
          <h1 className="hero-h1" style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16 }}>
            {text}
          </h1>
          <p className="hero-sub" style={{ maxWidth: 560, margin: '0 auto' }}>
            {error
              ? `${error} ${timeoutReached ? 'If this keeps happening, email us for a refund.' : 'This should be ready in under 3 minutes.'}`
              : 'Your papers are being read and translated into a care plan for your pet.'}
          </p>
          {error && (
            <div style={{ marginTop: 24 }}>
              <a href={mailto} className="cbtn" style={{ display: 'inline-flex' }}>
                request refund
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
