'use client';

import { useEffect, useMemo, useState } from 'react';
import html2pdf from 'html2pdf.js';
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

  const downloadPdf = () => {
    const element = document.getElementById('furbrief-content');
    if (!element) return;
    html2pdf()
      .set({ margin: 16, filename: `furbrief-${shareToken}.pdf`, jsPDF: { unit: 'mm', format: 'a4' }, pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }})
      .from(element)
      .save();
  };

  useEffect(() => {
    setToast('');
  }, [language]);

  return (
    <div className="wcard" style={{ position: 'sticky', top: 18, zIndex: 10, background: '#fff' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="button" className="cbtn" style={{ width: 'auto' }} onClick={copyLink}>
          {labelSet.share}
        </button>
        <button type="button" className="cbtn" style={{ width: 'auto' }} onClick={downloadPdf}>
          {labelSet.download}
        </button>
      </div>
      {toast ? <p style={{ marginTop: 12, color: '#3A2010' }}>{toast}</p> : null}
    </div>
  );
}
