'use client';

import './../../processing/processing.css';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../../components/Footer';

type Lang = 'en' | 'es' | 'ko' | 'zh';

const COPY: Record<Lang, {
  h1: string;
  messages: string[];
  steps: string[];
  failed_title: string;
  failed_desc: string;
}> = {
  en: {
    h1: 'translating your papers…',
    messages: ['reading your discharge papers', 'decoding the jargon…', 'building your day-by-day plan…', 'almost ready — hang tight!'],
    steps: ['reading papers', 'decoding jargon', 'building plan', 'finishing up'],
    failed_title: 'something went wrong',
    failed_desc: "your furbrief didn't generate.",
  },
  es: {
    h1: 'traduciendo tus papeles…',
    messages: ['leyendo tus papeles…', 'descifando la jerga…', 'construyendo tu plan diario…', '¡casi listo!'],
    steps: ['leyendo', 'descifando', 'construyendo', 'finalizando'],
    failed_title: 'algo salió mal',
    failed_desc: 'tu furbrief no se generó.',
  },
  ko: {
    h1: '서류 번역 중…',
    messages: ['서류를 읽는 중…', '의학 용어 해석 중…', '일별 계획 작성 중…', '거의 다 됐어요!'],
    steps: ['읽는 중', '해석 중', '작성 중', '마무리 중'],
    failed_title: '문제가 발생했습니다',
    failed_desc: '퍼브리프 생성에 실패했습니다.',
  },
  zh: {
    h1: '正在翻译您的文件…',
    messages: ['正在阅读您的文件…', '正在解读专业术语…', '正在制定日程计划…', '即将完成，请稍候！'],
    steps: ['阅读中', '解读中', '制作中', '完成中'],
    failed_title: '出现了问题',
    failed_desc: '您的毛简报未能生成。',
  },
};

const TOTAL_SECS = 45;

export default function ProcessingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [elapsed, setElapsed] = useState(0);
  const [failed, setFailed] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const pollRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();

  const pct = Math.min(Math.round((elapsed / TOTAL_SECS) * 100), 95);
  const stepIndex = elapsed < 10 ? 0 : elapsed < 22 ? 1 : elapsed < 35 ? 2 : 3;

  useEffect(() => {
    // progress timer
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    // poll for completion
    const poll = async () => {
      try {
        const res = await fetch(`/api/brief/${params.id}`);
        const data = await res.json();
        if (data.language && ['en', 'es', 'ko', 'zh'].includes(data.language)) {
          setLang(data.language as Lang);
        }
        if (data.status === 'complete' && data.share_token) {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          sessionStorage.removeItem('furbrief_blob_url');
          sessionStorage.removeItem('furbrief_file_name');
          sessionStorage.removeItem('furbrief_file_size');
          router.push(`/brief/${data.share_token}`);
        } else if (data.status === 'failed') {
          clearInterval(timerRef.current);
          clearInterval(pollRef.current);
          setFailed(true);
        }
      } catch {}
    };

    poll();
    pollRef.current = setInterval(poll, 3000);

    // timeout after 3 min — do one final check before showing failure
    const timeout = setTimeout(async () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
      try {
        const res = await fetch(`/api/brief/${params.id}`);
        const data = await res.json();
        if (data.status === 'complete' && data.share_token) {
          sessionStorage.removeItem('furbrief_blob_url');
          sessionStorage.removeItem('furbrief_file_name');
          sessionStorage.removeItem('furbrief_file_size');
          router.push(`/brief/${data.share_token}`);
          return;
        }
      } catch {}
      setFailed(true);
    }, 180_000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(pollRef.current);
      clearTimeout(timeout);
    };
  }, [params.id, router]);

  const copy = COPY[lang];

  if (failed) return (
    <main className="hero-outer dot-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="step-card" style={{ maxWidth: 420, textAlign: 'center' }}>
        <p className="step-title" style={{ color: '#A86860' }}>{copy.failed_title}</p>
        <p className="step-desc" style={{ marginTop: 8 }}>
          {copy.failed_desc}{' '}email us at{' '}
          <a href={`mailto:furbrief@proton.me?subject=Refund request&body=Order ID: ${params.id}`} style={{ color: '#C4837A', fontWeight: 700 }}>
            furbrief@proton.me
          </a>{' '}
          and we'll refund you immediately.
        </p>
      </div>
    </main>
  );

  return (
    <main className="hero-outer dot-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      <h1 className="fredoka" style={{ fontSize: 26, color: '#3A2010', marginBottom: 8, textAlign: 'center' }}>
        {copy.h1}
      </h1>
      <p style={{ fontSize: 14, fontWeight: 700, color: '#8A6840', marginBottom: 36, textAlign: 'center', minHeight: 22 }}>
        {copy.messages[stepIndex]}
      </p>

      {/* running cat scene */}
      <div style={{ width: 320, height: 90, position: 'relative', overflow: 'hidden', marginBottom: 28 }}>
        <div className="cat-run">
          <svg viewBox="0 0 80 60" width="80" height="60">
            <ellipse cx="40" cy="35" rx="22" ry="14" fill="#FAE0B8" stroke="#ECC888" strokeWidth="1.5"/>
            <circle cx="58" cy="22" r="14" fill="#FAE0B8" stroke="#ECC888" strokeWidth="1.5"/>
            <polygon points="48,12 52,2 58,12" fill="#FAE0B8" stroke="#ECC888" strokeWidth="1.2"/>
            <polygon points="50,11 53,4 57,11" fill="#ECC888"/>
            <polygon points="62,12 66,2 70,12" fill="#FAE0B8" stroke="#ECC888" strokeWidth="1.2"/>
            <polygon points="63,11 66,4 69,11" fill="#ECC888"/>
            <ellipse cx="54" cy="20" rx="3" ry="3.5" fill="#3A2010"/>
            <circle cx="55.2" cy="18.5" r="1.2" fill="white"/>
            <ellipse cx="63" cy="20" rx="3" ry="3.5" fill="#3A2010"/>
            <circle cx="64.2" cy="18.5" r="1.2" fill="white"/>
            <ellipse cx="49" cy="24" rx="5" ry="3" fill="#FFB3CF" opacity={0.45}/>
            <ellipse cx="68" cy="24" rx="5" ry="3" fill="#FFB3CF" opacity={0.45}/>
            <ellipse cx="58" cy="26" rx="2.5" ry="1.8" fill="#E8A070"/>
            <path d="M18 32 Q8 20 12 10" fill="none" stroke="#ECC888" strokeWidth="3" strokeLinecap="round"/>
            <line x1="32" y1="46" x2="25" y2="58" stroke="#ECC888" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="38" y1="47" x2="44" y2="58" stroke="#ECC888" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="22" y1="44" x2="16" y2="56" stroke="#FAE0B8" strokeWidth="3.5" strokeLinecap="round"/>
            <line x1="28" y1="46" x2="34" y2="56" stroke="#FAE0B8" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="paw-print"/>
        <div className="paw-print"/>
        <div className="paw-print"/>
        <div className="ground-line"/>
      </div>

      {/* progress bar */}
      <div style={{ width: 320 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8A6840' }}>{copy.steps[stepIndex]}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8A6840' }}>{pct}%</span>
        </div>
        <div style={{ width: '100%', height: 10, background: '#FAE0B8', borderRadius: 50, overflow: 'hidden' }}>
          <div className="prog-fill-bar" style={{ width: `${pct}%` }}/>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' as const, justifyContent: 'center' }}>
          {copy.steps.map((label, i) => (
            <span key={label} style={{
              fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 50,
              background: i < stepIndex ? '#E4F4EC' : i === stepIndex ? '#C4837A' : '#FCF0C8',
              color: i < stepIndex ? '#3D7A58' : i === stepIndex ? '#fff' : '#8A6840',
              transition: 'all .3s'
            }}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <Footer language={lang} />
    </main>
  );
}
