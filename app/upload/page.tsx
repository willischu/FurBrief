'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import CatSvg from '../../components/CatSvg';
import { labels } from '../../i18n/strings';
import { useLanguage } from '../../contexts/LanguageContext';

const languages = [
  { value: 'en', label: 'English', className: '' },
  { value: 'es', label: 'Español', className: '' },
  { value: 'ko', label: '한국어', className: 'ko-p' },
  { value: 'zh', label: '中文', className: 'zh-p' },
] as const;

type Lang = typeof languages[number]['value'];

const speciesOptions = [
  { value: 'dog', label: { en: 'dog', es: 'perro', ko: '강아지', zh: '狗' } },
  { value: 'cat', label: { en: 'cat', es: 'gato', ko: '고양이', zh: '猫' } },
  { value: 'other', label: { en: 'other', es: 'otro', ko: '기타', zh: '其他' } },
] as const;

const t = {
  en: {
    eyebrow: 'the briefing your vet forgot to give you',
    h1: ['get your', "pet's", 'furbrief'],
    sub: 'upload vet discharge papers, choose your language, then pay $6 for a plain-English care plan.',
    def: 'no login required. no subscription. your papers are processed once and deleted immediately.',
    s1t: 'upload your papers',
    s1d: 'drag and drop or select a file. if it is easier, paste your text instead.',
    s2t: 'tell us about your pet',
    s2d: 'name, species, surgery type, and language. makes your furbrief feel personal.',
    pet_name_lbl: "what's your pet's name?",
    pet_name_ph: 'e.g. luna',
    species_lbl: 'species',
    surgery_lbl: 'what was the surgery for? (optional)',
    surgery_ph: 'e.g. dental extraction',
    lang_lbl: 'furbrief language',
    s3t: 'checkout',
    s3d: 'review your order, then pay $6 and get routed to the processing page.',
    order_summary: 'order summary',
    order_lang: 'language',
    order_price: 'price',
    order_price_val: '$6.00 one-time',
    cta: 'translate my vet papers →',
    cta_loading: 'redirecting…',
    paste_show: 'or paste the text instead',
    paste_hide: 'hide paste field',
    paste_ph: 'Paste your discharge notes here',
    paste_btn: 'upload text',
    paste_loading: 'uploading…',
    drop_title: 'drop your discharge papers here',
    drop_hint: 'PDF, photo, or screenshot · any clinic · any format',
    ready: 'ready to translate',
    uploading: 'uploading…',
    order_for: (name: string, lang: string) => `furbrief for ${name || 'your pet'} — language ${lang}`,
    next_note: "you'll be redirected to Stripe — your brief is ready in ~60 seconds.",
    trust: 'papers deleted after processing · refundable within 24h',
    pdf_label: 'PDF document',
  },
  es: {
    eyebrow: 'el resumen que tu vet olvidó darte',
    h1: ['recibe el', 'furbrief de', 'tu mascota'],
    sub: 'sube tus papeles de alta, elige tu idioma y paga $6 por un plan de cuidado en español.',
    def: 'sin registro. sin suscripción. tus papeles se procesan y se eliminan inmediatamente.',
    s1t: 'sube tus papeles',
    s1d: 'arrastra y suelta o selecciona un archivo. o pega el texto si es más fácil.',
    s2t: 'cuéntanos sobre tu mascota',
    s2d: 'nombre, especie, tipo de cirugía e idioma. hace tu furbrief más personal.',
    pet_name_lbl: '¿cómo se llama tu mascota?',
    pet_name_ph: 'ej. luna',
    species_lbl: 'especie',
    surgery_lbl: '¿para qué fue la cirugía? (opcional)',
    surgery_ph: 'ej. extracción dental',
    lang_lbl: 'idioma del furbrief',
    s3t: 'pago',
    s3d: 'revisa tu pedido, paga $6 y serás redirigido a la página de procesamiento.',
    order_summary: 'resumen del pedido',
    order_lang: 'idioma',
    order_price: 'precio',
    order_price_val: '$6.00 pago único',
    cta: 'traducir mis papeles →',
    cta_loading: 'redirigiendo…',
    paste_show: 'o pega el texto',
    paste_hide: 'ocultar campo de texto',
    paste_ph: 'Pega tus notas de alta aquí',
    paste_btn: 'subir texto',
    paste_loading: 'subiendo…',
    drop_title: 'arrastra tus papeles aquí',
    drop_hint: 'PDF, foto o captura · cualquier clínica · cualquier formato',
    ready: 'listo para traducir',
    uploading: 'subiendo…',
    order_for: (name: string, lang: string) => `furbrief para ${name || 'tu mascota'} — idioma ${lang}`,
    next_note: 'serás redirigido a Stripe — tu furbrief estará listo en ~60 segundos.',
    trust: 'papeles eliminados tras el procesamiento · reembolsable en 24h',
    pdf_label: 'documento PDF',
  },
  ko: {
    eyebrow: '수의사가 설명 못한 내용',
    h1: ['반려동물의', '퍼브리프를', '받아보세요'],
    sub: '퇴원 서류를 올리고, 언어를 선택한 뒤 $6을 결제하면 케어 플랜을 받아보실 수 있어요.',
    def: '로그인 불필요. 정기결제 없음. 서류는 처리 후 즉시 삭제됩니다.',
    s1t: '서류 업로드',
    s1d: '파일을 끌어다 놓거나 선택하세요. 텍스트를 붙여넣기 해도 됩니다.',
    s2t: '반려동물 정보 입력',
    s2d: '이름, 종류, 수술 유형, 언어를 입력하면 더 맞춤화된 퍼브리프를 받을 수 있어요.',
    pet_name_lbl: '반려동물 이름이 무엇인가요?',
    pet_name_ph: '예: 루나',
    species_lbl: '종류',
    surgery_lbl: '어떤 수술이었나요? (선택)',
    surgery_ph: '예: 발치',
    lang_lbl: '퍼브리프 언어',
    s3t: '결제',
    s3d: '주문을 확인하고 $6을 결제하면 처리 페이지로 이동합니다.',
    order_summary: '주문 요약',
    order_lang: '언어',
    order_price: '가격',
    order_price_val: '$6.00 일회 결제',
    cta: '퇴원 서류 번역하기 →',
    cta_loading: '이동 중…',
    paste_show: '또는 텍스트 붙여넣기',
    paste_hide: '텍스트 입력 숨기기',
    paste_ph: '퇴원 기록을 여기에 붙여넣으세요',
    paste_btn: '텍스트 업로드',
    paste_loading: '업로드 중…',
    drop_title: '퇴원 서류를 여기에 끌어다 놓으세요',
    drop_hint: 'PDF · 사진 · 스크린샷 · 모든 클리닉',
    ready: '번역 준비 완료',
    uploading: '업로드 중…',
    order_for: (name: string, lang: string) => `${name || '반려동물'}의 퍼브리프 — 언어: ${lang}`,
    next_note: 'Stripe 결제 페이지로 이동합니다 — 퍼브리프는 약 60초 내에 준비됩니다.',
    trust: '처리 후 즉시 삭제 · 24시간 내 환불 가능',
    pdf_label: 'PDF 문서',
  },
  zh: {
    eyebrow: '兽医忘记告诉你的内容',
    h1: ['获取您的', '宠物的', '毛简报'],
    sub: '上传出院文件，选择语言，然后支付$6即可获得护理计划。',
    def: '无需登录。无订阅。您的文件处理后立即删除。',
    s1t: '上传您的文件',
    s1d: '拖放或选择文件。也可以直接粘贴文字。',
    s2t: '告诉我们您的宠物信息',
    s2d: '姓名、物种、手术类型和语言。让您的毛简报更个性化。',
    pet_name_lbl: '您的宠物叫什么名字？',
    pet_name_ph: '例如：小月',
    species_lbl: '物种',
    surgery_lbl: '是什么手术？（可选）',
    surgery_ph: '例如：拔牙',
    lang_lbl: '毛简报语言',
    s3t: '结账',
    s3d: '确认订单，支付$6后将跳转到处理页面。',
    order_summary: '订单摘要',
    order_lang: '语言',
    order_price: '价格',
    order_price_val: '$6.00 一次性付款',
    cta: '翻译我的出院文件 →',
    cta_loading: '跳转中…',
    paste_show: '或粘贴文字',
    paste_hide: '隐藏粘贴框',
    paste_ph: '在这里粘贴出院记录',
    paste_btn: '上传文字',
    paste_loading: '上传中…',
    drop_title: '将出院文件拖放到这里',
    drop_hint: 'PDF · 照片 · 截图 · 任何诊所',
    ready: '准备翻译',
    uploading: '上传中…',
    order_for: (name: string, lang: string) => `${name || '您的宠物'}的毛简报 — 语言：${lang}`,
    next_note: '您将跳转至 Stripe 付款页面 — 毛简报约 60 秒内完成。',
    trust: '文件处理后立即删除 · 24小时内可退款',
    pdf_label: 'PDF 文件',
  },
};

export default function UploadPage() {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [textFallback, setTextFallback] = useState('');
  const [useTextFallback, setUseTextFallback] = useState(false);
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<'dog' | 'cat' | 'other'>('dog');
  const [surgeryType, setSurgeryType] = useState('');
  const [language, setLanguage] = useLanguage();
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'pdf' | 'other'>('other');
  const inputRef = useRef<HTMLInputElement>(null);

  const tx = useMemo(() => t[language], [language]);
  const selectedLanguage = useMemo(() => languages.find((item) => item.value === language), [language]);

  const step1Done = !!(blobUrl);
  const step2Done = !!(petName.trim());
  const allDone = step1Done && step2Done;

  useEffect(() => { setHydrated(true); }, []);

  // Pre-populate from landing page drop
  useEffect(() => {
    const blobUrlStored = sessionStorage.getItem('furbrief_blob_url');
    const fileNameStored = sessionStorage.getItem('furbrief_file_name');
    const fileSizeStored = sessionStorage.getItem('furbrief_file_size');
    if (blobUrlStored) {
      setBlobUrl(blobUrlStored);
      setFileName(fileNameStored || 'your file');
      setFileSize(fileSizeStored || '');
    }
  }, []);

  // Sync body class for CJK fonts
  useEffect(() => {
    document.body.className = language === 'ko' ? 'ko' : language === 'zh' ? 'zh' : '';
  }, [language]);

  const clearFile = () => {
    setBlobUrl(null);
    setFileName('');
    setFileSize('');
    if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
    setFileType('other');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setCheckoutError('File must be 10MB or smaller.'); return; }
    const type = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other';
    setFileType(type);
    if (type === 'image') setPreviewUrl(URL.createObjectURL(file));
    const formData = new FormData();
    formData.append('file', file);
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Upload failed');
      setBlobUrl(data.blob_url);
      setFileName(file.name);
      setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      setCheckoutError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length) await handleFile(event.dataTransfer.files[0]);
  };

  const handlePasteSubmit = async () => {
    if (!textFallback.trim()) { setCheckoutError('Please paste your text or upload a file.'); return; }
    setIsLoading(true);
    setCheckoutError(null);
    const formData = new FormData();
    formData.append('text', textFallback.trim());
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Upload failed');
      setBlobUrl(data.blob_url);
      setFileName('pasted notes');
      setFileSize('text');
    } catch (error) {
      setCheckoutError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!blobUrl) { setCheckoutError('Please upload your papers first.'); return; }
    if (!petName.trim()) { setCheckoutError("Please tell us your pet's name."); return; }
    setIsLoading(true);
    setCheckoutError(null);
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blobUrl, petName, species, surgeryType, language }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Checkout failed');
      window.location.assign(data.url);
    } catch (error) {
      setCheckoutError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="hero-outer dot-bg" data-hydrated={hydrated ? 'true' : undefined}>
      <nav>
        <a href="/" className="brand">
          <div className="bmark">
            <svg viewBox="0 0 32 42" width="18" height="24">
              <path d="M3,0 L20,0 L32,12 L32,39 Q32,42 29,42 L3,42 Q0,42 0,39 L0,3 Q0,0 3,0 Z" fill="#FFFBEE" />
              <path d="M20,0 L32,12 L20,12 Z" fill="rgba(255,255,255,.3)" />
              <line x1="6" y1="20" x2="26" y2="20" stroke="rgba(58,32,16,.2)" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="27" x2="26" y2="27" stroke="rgba(58,32,16,.2)" strokeWidth="2" strokeLinecap="round" />
              <line x1="6" y1="34" x2="18" y2="34" stroke="rgba(58,32,16,.2)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="bname">
            <em>fur</em>brief
          </span>
        </a>
      </nav>
      <div className="hero-inner">
        <section className="fu">
          <div className="eyebrow">
            <div className="eyebrow-dot" />
            <span className="eyebrow-text">{tx.eyebrow}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <h1 className="hero-h1" style={{ flex: 1 }}>
              {tx.h1[0]}<br />{tx.h1[1]}<br /><em>{tx.h1[2]}</em>
            </h1>
            <div style={{ position: 'relative', flexShrink: 0, marginTop: 8 }}>
              <CatSvg size={90} />
              <svg viewBox="0 0 16 16" width="14" height="14" style={{ position: 'absolute', top: -4, right: -6, fill: '#ECC888' }}>
                <path d="M8 0 L9.6 5.6 L16 8 L9.6 10.4 L8 16 L6.4 10.4 L0 8 L6.4 5.6 Z" />
              </svg>
              <svg viewBox="0 0 16 16" width="10" height="10" style={{ position: 'absolute', bottom: 10, left: -10, fill: '#C4837A' }}>
                <path d="M8 0 L9.6 5.6 L16 8 L9.6 10.4 L8 16 L6.4 10.4 L0 8 L6.4 5.6 Z" />
              </svg>
            </div>
          </div>
          <p className="hero-sub">{tx.sub}</p>
          <p className="hero-def">{tx.def}</p>

          {/* Language selector — always visible pills */}
          <div style={{ marginTop: 20 }}>
            <div className="blang-lbl">{tx.lang_lbl}</div>
            <div className="bpills" style={{ marginTop: 10 }}>
              {languages.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`bpill ${language === item.value ? 'on' : ''} ${item.className}`}
                  onClick={() => setLanguage(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="hero-r fu2">

          {/* Upload zone — swaps to success card once uploaded */}
          {blobUrl ? (
            <div className="flex items-center gap-4 p-5 rounded-3xl border-2 border-[#6BA888] bg-[#E4F4EC] mb-4">
              {previewUrl ? (
                <img src={previewUrl} alt="file preview" className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" style={{ border: '2px solid #B8E4CA' }} />
              ) : fileType === 'pdf' ? (
                <div className="w-14 h-14 rounded-2xl bg-white flex flex-col items-center justify-center flex-shrink-0" style={{ border: '2px solid #B8E4CA', gap: 2 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4837A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="13" y2="17" />
                  </svg>
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#C4837A', letterSpacing: '.04em' }}>PDF</span>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#6BA888] flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#3D7A58] text-sm truncate">{fileName}</p>
                <p className="text-[#6BA888] text-xs font-semibold mt-0.5">
                  {fileType === 'pdf' ? tx.pdf_label : fileSize} · {tx.ready}
                </p>
              </div>
              <button onClick={clearFile} className="text-[#6BA888] hover:text-[#3D7A58] p-1 flex-shrink-0" title="Remove file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              className={`uzone${isDragging ? ' drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              role="button"
              tabIndex={0}
            >
              <div className="uico">
                {isLoading ? (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                )}
              </div>
              <p className="utit">{isLoading ? tx.uploading : tx.drop_title}</p>
              <p className="uhint">{tx.drop_hint}</p>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,image/jpeg,image/png,image/heic"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          {/* Step 1 */}
          <div className={`step-card${step1Done ? ' done' : ''}`} style={{ marginTop: 16 }}>
            <div className="step-num">1</div>
            <p className="step-title">{tx.s1t}</p>
            <p className="step-desc">{tx.s1d}</p>
            <div className="step-tags">
              <span className="stag">PDF</span>
              <span className="stag">photo</span>
              <span className="stag">screenshot</span>
              <span className="stag">HEIC</span>
            </div>
            <button
              type="button"
              className="cbtn"
              style={{ marginTop: 16, width: 'auto', padding: '11px 18px' }}
              onClick={() => setUseTextFallback(!useTextFallback)}
            >
              {useTextFallback ? tx.paste_hide : tx.paste_show}
            </button>
            {useTextFallback && (
              <>
                <textarea
                  value={textFallback}
                  onChange={(e) => setTextFallback(e.target.value)}
                  placeholder={tx.paste_ph}
                  rows={6}
                  className="border border-[#ECC888] rounded-[16px] p-4 w-full mt-4"
                  style={{ fontFamily: 'Nunito, sans-serif', fontSize: 15, minHeight: 160 }}
                />
                <button type="button" className="cbtn" onClick={handlePasteSubmit} disabled={isLoading}>
                  {isLoading ? tx.paste_loading : tx.paste_btn}
                </button>
              </>
            )}
            {checkoutError && <p className="text-sm font-semibold mt-3" style={{ color: '#A86860' }}>{checkoutError}</p>}
          </div>

          {/* Step 2 */}
          <div className={`step-card${step2Done ? ' done' : ''}`} style={{ marginTop: 20 }}>
            <div className="step-num">2</div>
            <p className="step-title">{tx.s2t}</p>
            <p className="step-desc">{tx.s2d}</p>
            <label className="block text-sm font-semibold text-[#3A2010] mt-4">
              {tx.pet_name_lbl}
              <input
                className="mt-2 w-full rounded-[18px] border border-[#ECC888] bg-white px-4 py-3 text-base"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder={tx.pet_name_ph}
              />
            </label>
            <div style={{ marginTop: 16 }}>
              <div className="blang-lbl">{tx.species_lbl}</div>
              <div className="bpills" style={{ marginTop: 10 }}>
                {speciesOptions.map((item) => (
                  <button key={item.value} type="button" className={`bpill ${species === item.value ? 'on' : ''}`} onClick={() => setSpecies(item.value)}>
                    {item.label[language]}
                  </button>
                ))}
              </div>
            </div>
            <label className="block text-sm font-semibold text-[#3A2010] mt-4">
              {tx.surgery_lbl}
              <input
                className="mt-2 w-full rounded-[18px] border border-[#ECC888] bg-white px-4 py-3 text-base"
                value={surgeryType}
                onChange={(e) => setSurgeryType(e.target.value)}
                placeholder={tx.surgery_ph}
              />
            </label>
          </div>

          {/* Step 3 */}
          <div className={`step-card${allDone ? ' done' : ''}`} style={{ marginTop: 20 }}>
            <div className="step-num">3</div>
            <p className="step-title">{tx.s3t}</p>
            <p className="step-desc">{tx.s3d}</p>
            <div className="paper-card" style={{ marginTop: 14 }}>
              <div className="paper-top">{tx.order_summary}</div>
              <p className="pline">{tx.order_for(petName, selectedLanguage?.label ?? '')}</p>
              <p className="pline">{tx.order_price} <span className="phl">{tx.order_price_val}</span></p>
            </div>
            <p style={{ fontSize: 11, color: '#8A6840', fontWeight: 600, lineHeight: 1.6, marginTop: 16, padding: '10px 14px', background: '#FEF9EE', borderRadius: 12, border: '1px solid #E8D098' }}>
              {labels[language].disclaimerCheckout}
            </p>
            <p style={{ fontSize: 12, color: '#8A6840', fontWeight: 600, lineHeight: 1.6, marginTop: 14 }}>
              {tx.next_note}
            </p>
            <button type="button" className="cbtn" style={{ marginTop: 10, opacity: allDone ? 1 : 0.45, cursor: allDone ? 'pointer' : 'not-allowed' }} onClick={handleCheckout} disabled={isLoading || !allDone}>
              {isLoading ? tx.cta_loading : tx.cta}
            </button>
            <p style={{ fontSize: 11, color: '#B8866A', fontWeight: 700, textAlign: 'center', marginTop: 10, letterSpacing: '.01em' }}>
              {tx.trust}
            </p>
          </div>

        </section>
      </div>
      <Footer />
    </main>
  );
}
