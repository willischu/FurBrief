'use client';

import { useEffect, useMemo, useState } from 'react';
import { labels } from '../i18n/strings';

interface BriefPageClientProps {
  shareToken: string;
  language: 'en' | 'es' | 'ko' | 'zh';
}

export default function BriefPageClient({ shareToken, language }: BriefPageClientProps) {
  const [toast, setToast] = useState('');
  const labelSet = labels[language] || labels.en;

  const shareUrl = useMemo(() => `${window.location.origin}/brief/${shareToken}`, [shareToken]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setToast(labelSet.copied);
    window.setTimeout(() => setToast(''), 2000);
  };

  useEffect(() => {
    setToast('');
  }, [language]);

  return (
    <div className="wcard" style={{ position: 'sticky', top: 18, zIndex: 10, background: '#fff' }}>
      <button type="button" className="cbtn" style={{ width: '100%' }} onClick={copyLink}>
        {labelSet.share}
      </button>
      {toast ? <p style={{ marginTop: 12, fontSize: 13, fontWeight: 700, color: '#3D7A58' }}>{toast}</p> : null}
    </div>
  );
}
